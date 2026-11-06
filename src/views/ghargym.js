// GharGym — strength training with what every Nepali home already has.
// Tap an exercise for steps, tips and a one-tap "done" that feeds XP.
import { el, icon, toast, openModal, esc } from '../ui/dom.js';
import { GITEMS, itemMeta, GHAREX } from '../data/household.js';
import { getGharDone, markGharDone } from '../modules/storage.js';
import { t } from '../i18n.js';

const ALL_GRAD = 'linear-gradient(135deg,#fb7185,#f97316 55%,#7c3aed)';

let state = { item: 'all', q: '' };

export function render(view) {
  const doneToday = Object.keys(getGharDone()).length;

  view.innerHTML = `
    <div class="hero" style="padding:18px">
      <h1 style="font-size:21px">${esc(t('No gym? No problem 🏠'))}</h1>
      <p>${esc(t('Full strength training with bottles, gagri, bhaari, bricks, towels and stairs — things found in every Nepali home. Equipment cost: Rs. 0.'))}</p>
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
        <span class="book-pill">${t('{0} exercises', GHAREX.length)}</span>
        <span class="book-pill">${t('{0} done today', doneToday)}</span>
        <span class="book-pill">offline</span>
      </div>
    </div>

    <div class="field mt-14" style="margin-bottom:0">
      <input id="gk-q" type="search" placeholder="${esc(t('Search goblet, sack, brick, stairs…'))}" autocomplete="off" value="${esc(state.q)}">
    </div>
    <div class="chips mt-8" id="gk-items">
      ${GITEMS.map(i => `<button class="chip ${state.item === i.id ? 'on' : ''}" data-i="${i.id}">${esc(t(i.label))}</button>`).join('')}
    </div>
    <div class="row between mt-8">
      <div class="small muted" id="gk-count"></div>
      <div class="small muted">${esc(t('tap an exercise'))}</div>
    </div>
    <div class="stack mt-8" id="gk-list"></div>
  `;

  const list = view.querySelector('#gk-list');
  const count = view.querySelector('#gk-count');

  function draw() {
    const done = getGharDone();
    const q = state.q.trim().toLowerCase();
    const items = GHAREX.filter(x =>
      (state.item === 'all' || x.item === state.item) &&
      (!q || x.name.toLowerCase().includes(q) || x.nepali.includes(q) || x.muscles.toLowerCase().includes(q))
    );
    count.textContent = t('{0} exercises', items.length);
    list.innerHTML = items.length ? '' : `<div class="empty"><div class="e">🔍</div>${esc(t('No exercises found.'))}<br><span class="small">${esc(t('Try another search or item.'))}</span></div>`;

    items.forEach(x => {
      const meta = itemMeta(x.item);
      const row = el(`
        <div class="ex-row tap" data-ex="${x.id}">
          <div class="thumb" style="font-size:30px;line-height:1">${x.emoji}</div>
          <div>
            <h4>${esc(x.name)} ${done[x.id] ? '<span title="done today">✅</span>' : ''}</h4>
            <div class="meta">${esc(x.nepali)} · ${esc(x.muscles)}</div>
            <div class="meta" style="color:var(--accent-1);font-weight:700">${esc(t(meta.desc))} · ${esc(x.dose)}</div>
          </div>
          <span class="go">${icon('chev')}</span>
        </div>`);
      row.addEventListener('click', () => openEx(x));
      list.appendChild(row);
    });
  }

  function openEx(x) {
    const meta = itemMeta(x.item);
    const doneNow = !!getGharDone()[x.id];
    const modal = openModal(`
      <div class="book-modal-head" style="background:${meta.grad || ALL_GRAD}">
        <div class="book-modal-emoji">${x.emoji}</div>
        <div class="book-modal-cat">${esc(meta.label.replace(/^[^ ]+ /, ''))} · ${esc(x.muscles)}</div>
      </div>
      <h2 class="book-modal-title">${esc(x.name)}</h2>
      <div class="small muted">${esc(x.nepali)} · ${esc(t('dose:'))} ${esc(x.dose)}</div>
      <div class="card-title mt-14">${esc(t('How to do it'))}</div>
      <ol class="book-lessons">
        ${x.steps.map(s => `<li>${esc(s)}</li>`).join('')}
      </ol>
      <div class="book-quote">💡 ${esc(x.tip)}</div>
      <button class="btn wide mt-14 ${doneNow ? '' : 'primary'}" data-done>${doneNow ? esc(t('Done today ✅')) : esc(t('✅ Mark done (+8 XP)'))}</button>
      <button class="btn wide ghost mt-8" data-close>${esc(t('Close'))}</button>
    `, {
      onClose: () => draw(),
    });
    modal.el.querySelector('[data-done]').addEventListener('click', () => {
      if (markGharDone(x.id)) toast(t('GharGym done! +8 XP 💪'));
      modal.close();
      draw();
    });
  }

  draw();

  view.querySelector('#gk-q').addEventListener('input', e => {
    state.q = e.target.value;
    draw();
  });
  view.querySelector('#gk-items').addEventListener('click', e => {
    const chip = e.target.closest('[data-i]');
    if (!chip) return;
    state.item = chip.dataset.i;
    view.querySelectorAll('#gk-items .chip').forEach(c => c.classList.toggle('on', c === chip));
    draw();
  });
}
