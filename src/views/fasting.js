// Fast & Fest — train wisely around Nepali fasts and festivals.
// Computes Shrawan Sombar, Sankranti & Maghe Sankranti from the BS calendar,
// learns your weekly fast patterns, and offers fasting-safe training plans.
import { icon, esc, toast, openModal } from '../ui/dom.js';
import { todayBs, formatBs, formatAd } from '../data/nepaliCalendar.js';
import { FESTS, PATTERNS, LEVEL_LABEL, KIND_LABEL, GRAD, festById, todaysFlags, getUpcoming, leftLabel } from '../data/fests.js';
import { dayKey, getFastState, toggleFastToday, getFastPatterns, toggleFastPattern } from '../modules/storage.js';
import { PROGRAMS } from '../data/content.js';
import { t } from '../i18n.js';

const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'fast', label: '🙏 Fasts' },
  { id: 'fest', label: '🎉 Festivals' },
  { id: 'food', label: '🍲 Food days' },
];

// Low-intensity programs + one dance cardio for fast days.
const LIGHT_IDS = ['x-calm-morning', 'x-unwind', 'x-heavy-day', 'f-glow', 'd-feelgood'];

let state = { kind: 'all' };

export function render(view) {
  const now = todayBs();
  const fs = getFastState();
  const isOn = !!fs[dayKey()]?.on;
  const flags = todaysFlags();
  const pats = getFastPatterns();

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('lotus')} ${esc(t('Fast & Fest'))}</div></div>

    <div class="hero" style="padding:18px">
      <h1 style="font-size:20px">${esc(formatBs(now.bs))}</h1>
      <p class="small muted">${esc(formatAd(now.ad, { weekday: true }))}</p>
      ${flags.length ? `
        <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
          ${flags.map(f => `<span class="book-pill">${f.emoji} ${esc(f.title)}</span>`).join('')}
        </div>` : `
        <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
          <span class="book-pill">${esc(t('a regular day — full sessions open'))}</span>
        </div>`}
    </div>

    <div class="card tap mt-14" id="fast-toggle" style="border-color:${isOn ? 'rgba(255,154,107,.45)' : 'rgba(255,255,255,.08)'}">
      <div class="row between">
        <div>
          <div class="card-title">${esc(t('Fasting mode'))}</div>
          <div style="font-weight:800;font-size:15.5px">${esc(isOn ? t('ON — today is a fasting day 🌾') : t('Off — am I fasting today?'))}</div>
          <div class="small muted mt-8">${esc(isOn ? t('Light sessions only · hydration reminder on · guidance below') : t('Mark fast days here — home screen will adjust suggestions automatically'))}</div>
        </div>
        <button class="btn ${isOn ? 'danger' : 'primary'}">${esc(isOn ? t('Turn off') : t('Mark today'))}</button>
      </div>
    </div>

    ${isOn ? fastingCards(now) : ''}

    <div class="section-title">${esc(t('Upcoming · auto-tracked'))}</div>
    <div class="stack mt-8" id="up-list"></div>

    <div class="section-title">${esc(t('My weekly fasts'))}</div>
    <div class="chips" id="fast-pats">
      ${PATTERNS.map(p => `<button class="chip ${pats.includes(p.dow) ? 'on' : ''}" data-p="${p.dow}">🙏 ${p.ne}</button>`).join('')}
    </div>
    <div class="small muted mt-8">${esc(t('Tap the days you regularly fast (Sombar-Shiva, Sanibar-Shani, Santoshi Shukrabar…). They turn on fasting mode automatically.'))}</div>

    <div class="section-title" id="guide-title">${esc(t('Day guide'))}</div>
    <div class="chips" id="fest-kinds">
      ${KINDS.map(k => `<button class="chip ${state.kind === k.id ? 'on' : ''}" data-k="${k.id}">${esc(t(k.label))}</button>`).join('')}
    </div>
    <div class="stack mt-8" id="fest-list"></div>

    <div class="center small muted mt-20">${esc(t('Dates shift yearly with the lunar tithi — everything here is guidance, not an astrological calendar.'))}</div>
  `;

  drawUpcoming(view);
  drawFests(view);

  // fasting toggle
  view.querySelector('#fast-toggle').addEventListener('click', () => {
    const nowOn = toggleFastToday(null);
    toast(nowOn ? t('Fasting mode ON — take it light today 🙏') : t('Fasting mode off — full sessions back'));
    view._rerender?.();
  });

  // fasting-safe program rows
  view.querySelectorAll('[data-program]').forEach(n => n.addEventListener('click', () => {
    import('./workouts.js').then(m => m.openProgram(n.dataset.program));
  }));

  // upcoming rows (open the day guide where we have one)
  view.querySelector('#up-list').addEventListener('click', e => {
    const row = e.target.closest('[data-fest]');
    if (row) openFest(row.dataset.fest, view);
  });

  // weekly fast patterns
  view.querySelector('#fast-pats').addEventListener('click', e => {
    const chip = e.target.closest('[data-p]');
    if (!chip) return;
    toggleFastPattern(+chip.dataset.p);
    view._rerender?.();
  });

  // day guide filter
  view.querySelector('#fest-kinds').addEventListener('click', e => {
    const chip = e.target.closest('[data-k]');
    if (!chip) return;
    state.kind = chip.dataset.k;
    view.querySelectorAll('#fest-kinds .chip').forEach(c => c.classList.toggle('on', c === chip));
    drawFests(view);
  });

  // day guide rows — delegate on the container so it survives re-draws
  view.querySelector('#fest-list').addEventListener('click', e => {
    const row = e.target.closest('[data-fest]');
    if (row) openFest(row.dataset.fest, view);
  });
}

// ---------- fasting mode content ----------
function fastingCards(now) {
  const pats = getFastPatterns();
  const patternToday = PATTERNS[now.ad.weekday] && pats.includes(now.ad.weekday);
  return `
    <div class="card mt-14">
      <div class="card-title">Fasting-safe sessions</div>
      ${LIGHT_IDS.map(id => {
        const p = PROGRAMS.find(x => x.id === id);
        if (!p) return '';
        return `
          <div class="ex-row tap" data-program="${p.id}">
            <div class="thumb" style="font-size:26px">${p.section === 'mind' ? '🧘' : p.section === 'dance' ? '💃' : '🌸'}</div>
            <div>
              <h4>${esc(p.name)}</h4>
              <div class="meta">${p.mins} min · ${esc(p.cat)}</div>
            </div>
            <span class="go">${icon('chev')}</span>
          </div>`;
      }).join('')}
          <div class="small muted mt-8">${esc(t('Slow movement keeps energy steady while fasting — these all stay under walking intensity.'))}</div>
    </div>

    <div class="card">
      <div class="card-title">${esc(t('Fast-day rules of thumb'))}</div>
      <div class="stack" style="gap:8px">
        ${[
          '💧 Water even on fast days — unless it is nirjala: sip every 30–45 min otherwise.',
          '🥗 Break the fast gently: fruit, milk or warm khichadi before anything fried.',
          '🛑 No high-intensity or heavy lifting on an empty stomach — ever.',
          '🧂 If fasting with salt-free foods, fatigue comes faster — shorten sessions.',
        ].map(x => `<div class="small">${esc(t(x))}</div>`).join('')}
      </div>
    </div>

    ${patternToday ? `
    <div class="card small" style="border-color:rgba(255,154,107,.4)">
      ${esc(t('{0} — automatic flag from your weekly fast. Connecting with {1} today? Keep the phone away and the timer short. 🙏', PATTERNS[now.ad.weekday].ne, PATTERNS[now.ad.weekday].who))}
    </div>` : ''}

    <div class="small muted center" style="margin-bottom:6px">${esc(t('Health note: diabetics, pregnant & nursing mothers, and anyone on regular medication — talk to your doctor about fasting. Never push through dizziness.'))}</div>
  `;
}

// ---------- upcoming (computed) list ----------
function drawUpcoming(view) {
  const list = view.querySelector('#up-list');
  const up = getUpcoming().slice(0, 6);
  list.innerHTML = !up.length ? '' : up.map(u => {
    const f = u.fest || (u.pattern ? { emoji: '🙏', name: `${u.pattern.ne} fast`, ne: t('weekly · {0}', u.pattern.who) } : null);
    if (!f) return '';
    return `
      <div class="ex-row tap" ${u.fest ? `data-fest="${u.fest.id}"` : 'data-static'}>
        <div class="thumb" style="font-size:26px">${f.emoji}</div>
        <div>
          <h4>${esc(f.name)}${u.note ? ` <span class="small muted">· ${esc(u.note)}</span>` : ''}</h4>
          <div class="meta">${esc(f.ne || '')} · ${esc(formatBs(u.bs, { weekday: false, nepali: false }))}</div>
        </div>
        <div style="margin-left:auto;flex:none;text-align:right">
          <span class="chip on" style="padding:5px 10px;font-size:11.5px">${esc(t(leftLabel(u.left)))}</span>
        </div>
      </div>`;
  }).join('');
}

// ---------- day guide list ----------
function drawFests(view) {
  const list = view.querySelector('#fest-list');
  const items = FESTS.filter(f => state.kind === 'all' || f.kind === state.kind);
  list.innerHTML = items.map(f => `
    <div class="ex-row tap" data-fest="${f.id}">
      <div class="thumb" style="font-size:26px">${f.emoji}</div>
      <div>
        <h4>${esc(f.name)} <span class="small muted">${esc(f.ne)}</span></h4>
        <div class="meta">
          <span class="chip" style="padding:2px 8px;font-size:10.5px;${f.kind === 'fast' ? 'background:rgba(255,154,107,.16)' : f.kind === 'fest' ? 'background:rgba(255,111,165,.16)' : 'background:rgba(45,212,167,.16)'}">${KIND_LABEL[f.kind]}</span>
          ${esc(f.when)}
        </div>
        <div class="meta mt-8">${esc(t(LEVEL_LABEL[f.level]))}</div>
      </div>
      <span class="go">${icon('chev')}</span>
    </div>`).join('');
}

// ---------- festival detail modal ----------
function openFest(id, view) {
  const f = festById(id);
  if (!f) return;
  const modal = openModal(`
    <div class="book-modal-head" style="background:${GRAD[f.kind]}">
      <div class="book-modal-emoji">${f.emoji}</div>
      <div class="book-modal-cat">${esc(f.ne)} · ${esc(t(LEVEL_LABEL[f.level]))}</div>
    </div>
    <h2 class="book-modal-title">${esc(f.name)}</h2>
    <div class="small muted">${esc(f.when)}</div>
    <div class="book-summary">${esc(f.desc)}</div>
    <div class="card-title mt-14">Food & drink</div>
    <ul class="book-lessons">${f.food.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="card-title mt-14">Training this day</div>
    <ul class="book-lessons">${f.train.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="book-quote">&#9878;️ ${esc(f.safety)}</div>
    <button class="btn wide primary mt-14" data-fest-fast>${esc(t('🌾 Open fasting mode'))}</button>
    <button class="btn wide ghost mt-8" data-close>${esc(t('Close'))}</button>
  `);
  modal.el.querySelector('[data-fest-fast]').addEventListener('click', () => {
    toggleFastToday(true);
    modal.close();
    toast(t('Fasting mode ON for today 🙏'));
    view._rerender?.();
  });
}
