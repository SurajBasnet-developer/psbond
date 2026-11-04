// Workouts — Male & Female tabs with categories, program cards and the player.
import { el, icon, openModal, toast } from '../ui/dom.js';
import { createFigure } from '../ui/figure.js';
import { byId, byCat, CATS } from '../data/exercises.js';
import { PROGRAMS } from '../data/content.js';
import { playWorkout } from '../modules/player.js';
import { getSettings } from '../modules/storage.js';

let state = { tab: 'male', cat: 'all' };

export function render(view, params) {
  if (params?.tab) state.tab = params.tab;
  if (!params?.tab && !params?.cat) state = { tab: state.tab, cat: 'all' };
  if (params?.cat) state.cat = params.cat;

  const settings = getSettings();
  const isMale = state.tab === 'male';
  const accent = isMale ? 'var(--male)' : 'var(--female)';

  view.innerHTML = `
    <div class="header">
      <div class="brand">${icon('train')} Train</div>
    </div>
    <div class="chips" id="tabs">
      <button class="chip ${isMale ? 'on' : ''}" data-tab="male">💪 Build & Power (Men)</button>
      <button class="chip ${!isMale ? 'on' : ''}" data-tab="female">🌸 Slim & Glow (Women)</button>
    </div>
    <div class="chips" id="cats">
      ${CATS[state.tab].map(c => `<button class="chip ${state.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.label}</button>`).join('')}
      <button class="chip" data-lib="1">${icon('book')} Library</button>
    </div>
    <div id="program-list" class="stack"></div>
    <div class="mt-14 center">
      <button class="btn wide" id="shuffle">${icon('sparkle')} Surprise me — shuffle a workout</button>
    </div>
  `;

  const list = view.querySelector('#program-list');

  function programCard(p) {
    const ex = byId(p.items[0]);
    const card = el(`
      <div class="program" style="min-width:0" data-id="${p.id}">
        <span class="tag ${p.section}">${p.cat}</span>
        <div class="fig-wrap" style="height:110px"></div>
        <h3>${p.name}</h3>
        <div class="meta">${p.mins} min · ${p.level} · ${p.items.length} moves</div>
        <div class="small muted mt-8">${p.desc}</div>
      </div>`);
    if (ex) {
      card._fig = createFigure(card.querySelector('.fig-wrap'), {
        gender: ex.section === 'female' ? 'female' : 'male', pose: ex.pose, speed: 0.9,
      });
      view._figs.push(card._fig);
    }
    card.addEventListener('click', () => openProgram(p.id));
    return card;
  }

  function drawList() {
    view._figs?.forEach(f => f.destroy());
    view._figs = [];
    list.innerHTML = '';
    const programs = PROGRAMS.filter(p => p.section === state.tab);
    programs.forEach(p => list.appendChild(programCard(p)));
  }
  drawList();

  view.querySelector('#tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    state = { tab: b.dataset.tab, cat: 'all' };
    render(view, { tab: state.tab });
  });
  view.querySelector('#cats').addEventListener('click', e => {
    const lib = e.target.closest('[data-lib]');
    if (lib) return (location.hash = '#/library');
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    view.querySelectorAll('#cats .chip[data-cat]').forEach(c => c.classList.toggle('on', c === b));
    // filter exercises into a "custom session" preview
    drawCustom(byCat(state.tab, state.cat));
  });

  function drawCustom(exs) {
    view._figs?.forEach(f => f.destroy());
    view._figs = [];
    list.innerHTML = '';
    if (!exs.length) { list.innerHTML = `<div class="empty"><div class="e">🤸</div>Nothing here yet</div>`; return; }
    const mins = Math.round(exs.reduce((a, e) => a + e.secs + 15, 0) / 60);
    const kcal = Math.round(exs.reduce((a, e) => a + e.kcal * e.secs / 60, 0));
    const card = el(`
      <div class="card">
        <div class="row between">
          <div>
            <div style="font-weight:800;font-size:16px">Custom session · ${exs.length} moves</div>
            <div class="small muted mt-8">≈ ${mins} min · ~${kcal} kcal · tap an exercise for details</div>
          </div>
          <button class="btn primary" id="start-custom">${icon('play')} Start</button>
        </div>
      </div>`);
    card.querySelector('#start-custom').addEventListener('click', () => playWorkout('Custom Session', exs));
    list.appendChild(card);
    exs.forEach(ex => list.appendChild(exRow(ex)));
  }

  function exRow(ex) {
    const row = el(`
      <div class="ex-row">
        <div class="thumb"></div>
        <div><h4>${ex.name}</h4><div class="meta">${ex.secs}s · ${ex.kcal} kcal/min · ${ex.diff}</div></div>
        <span class="go">${icon('chev')}</span>
      </div>`);
    row._fig = createFigure(row.querySelector('.thumb'), {
      gender: ex.section === 'female' ? 'female' : 'male', pose: ex.pose, speed: 0.8,
    });
    view._figs.push(row._fig);
    row.addEventListener('click', () => exerciseModal(ex));
    return row;
  }

  view.querySelector('#shuffle').addEventListener('click', () => {
    const pool = byCat(state.tab, 'all');
    const pick = [...pool].sort(() => Math.random() - .5).slice(0, 8);
    playWorkout('Shuffle Workout', pick);
  });
}

export function exerciseModal(ex) {
  const settings = getSettings();
  const m = openModal(`
    <div class="center"><div id="m-fig" style="width:190px;height:190px;margin:0 auto"></div></div>
    <h2 class="center" style="margin:6px 0 2px">${ex.name}</h2>
    <div class="center small muted">${ex.muscles} · ${ex.diff} · ~${ex.kcal} kcal/min</div>
    <div class="card mt-14">
      <div class="card-title">How to</div>
      ${ex.steps.map((s, i) => `<div class="row mt-8" style="align-items:flex-start"><b style="color:var(--accent-1)">${i + 1}.</b><span>${s}</span></div>`).join('')}
    </div>
    <div class="card mt-14" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">💡 Pro tip</div>
      <div class="small">${ex.tip}</div>
    </div>
    <button class="btn primary wide mt-14" id="m-start">${icon('play')} Start ${ex.secs}s set</button>
  `, { onClose: () => fig.destroy() });
  const fig = createFigure(m.el.querySelector('#m-fig'), { gender: ex.section === 'female' ? 'female' : 'male', pose: ex.pose });
  m.el.querySelector('#m-start').addEventListener('click', () => { m.close(); playWorkout(ex.name, [ex]); });
}

export function openProgram(id) {
  const p = PROGRAMS.find(x => x.id === id);
  if (!p) return;
  const exs = p.items.map(byId).filter(Boolean);
  const kcal = Math.round(exs.reduce((a, e) => a + e.kcal * e.secs / 60, 0));
  const m = openModal(`
    <div class="row between">
      <div>
        <span class="tag ${p.section}">${p.cat}</span>
        <h2 style="margin-top:8px">${p.name}</h2>
        <div class="small muted mt-8">${p.desc}</div>
        <div class="small muted mt-8">${p.mins} min · ~${kcal} kcal · ${p.level}</div>
      </div>
      <button class="icon-btn" data-close>${icon('close')}</button>
    </div>
    <div class="stack mt-14" style="max-height:300px;overflow-y:auto">
      ${exs.map((e, i) => `<div class="ex-row" style="cursor:default"><div class="thumb small" style="width:44px;height:44px;font-weight:800;display:grid;place-items:center">${i + 1}</div><div><h4>${e.name}</h4><div class="meta">${e.secs}s · ${e.muscles}</div></div></div>`).join('')}
    </div>
    <button class="btn primary wide mt-14" id="pm-start">${icon('play')} Start workout</button>
  `);
  m.el.querySelector('#pm-start').addEventListener('click', () => { m.close(); playWorkout(p.name, exs); });
}
