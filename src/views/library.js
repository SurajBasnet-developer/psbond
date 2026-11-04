// Library — the unlimited exercise library with search, filters and a plan builder.
import { el, icon, toast } from '../ui/dom.js';
import { createFigure } from '../ui/figure.js';
import { EXERCISES, byId } from '../data/exercises.js';
import { exerciseModal } from './workouts.js';
import { playWorkout } from '../modules/player.js';

const GROUPS = [
  { id: 'all', label: 'All' },
  { id: 'male', label: '💪 Men' },
  { id: 'female', label: '🌸 Women' },
  { id: 'dance', label: '💃 Dance' },
  { id: 'mind', label: '🧘 Mind' },
];

let state = { group: 'all', q: '' };
let picked = [];

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('book')} Library</div>
      <span class="small muted">${EXERCISES.length}+ exercises · always growing</span>
    </div>
    <div class="field"><input id="lib-q" placeholder="🔍 Search biceps, squat, dance, calm…" value="${state.q}"></div>
    <div class="chips" id="lib-groups">
      ${GROUPS.map(g => `<button class="chip ${state.group === g.id ? 'on' : ''}" data-g="${g.id}">${g.label}</button>`).join('')}
    </div>
    <div class="card" id="plan-bar" style="display:none">
      <div class="row between">
        <div><b id="plan-count"></b> <span class="small muted">selected</span></div>
        <div class="row">
          <button class="btn" id="plan-clear">Clear</button>
          <button class="btn primary" id="plan-go">${icon('play')} Start</button>
        </div>
      </div>
    </div>
    <div class="stack mt-14" id="lib-list"></div>
  `;

  const list = view.querySelector('#lib-list');

  function draw() {
    view._figs?.forEach(f => f.destroy());
    view._figs = [];
    const q = state.q.toLowerCase();
    const items = EXERCISES.filter(e =>
      (state.group === 'all' || e.section === state.group) &&
      (!q || e.name.toLowerCase().includes(q) || e.muscles.toLowerCase().includes(q) || e.cat.includes(q))
    );
    list.innerHTML = items.length ? '' : `<div class="empty"><div class="e">🔍</div>No exercises match "${state.q}"</div>`;
    items.forEach(ex => {
      const row = el(`
        <div class="ex-row">
          <div class="thumb"></div>
          <div><h4>${ex.name}</h4><div class="meta">${ex.section === 'male' ? '💪' : ex.section === 'female' ? '🌸' : ex.section === 'dance' ? '💃' : '🧘'} ${ex.muscles} · ${ex.secs}s</div></div>
          <button class="icon-btn add-btn" title="Add to custom plan" style="width:34px;height:34px;border-radius:11px">${icon('plus')}</button>
          <span class="go">${icon('chev')}</span>
        </div>`);
      const f = createFigure(row.querySelector('.thumb'), {
        gender: ex.section === 'female' ? 'female' : ex.section === 'mind' ? 'female' : 'male',
        pose: ex.pose, speed: 0.85,
      });
      view._figs.push(f);
      row.querySelector('.add-btn').addEventListener('click', e => {
        e.stopPropagation();
        if (!picked.includes(ex.id)) { picked.push(ex.id); toast(`Added ${ex.name} to plan ✅`); refreshBar(); }
      });
      row.addEventListener('click', () => exerciseModal(ex));
      list.appendChild(row);
    });
  }

  draw();

  view.querySelector('#lib-q').addEventListener('input', e => { state.q = e.target.value; draw(); });
  view.querySelector('#lib-groups').addEventListener('click', e => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    state.group = b.dataset.g;
    view.querySelectorAll('#lib-groups .chip').forEach(c => c.classList.toggle('on', c === b));
    draw();
  });

  // plan bar (custom builder)
  const bar = view.querySelector('#plan-bar');
  function refreshBar() {
    bar.style.display = picked.length ? 'block' : 'none';
    view.querySelector('#plan-count').textContent = picked.length;
  }
  view.querySelector('#plan-clear').addEventListener('click', () => { picked = []; refreshBar(); });
  view.querySelector('#plan-go').addEventListener('click', () => {
    if (!picked.length) return;
    playWorkout('My Custom Plan', picked.map(byId).filter(Boolean));
    picked = [];
    refreshBar();
  });
  refreshBar();
}
