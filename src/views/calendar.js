// Calendar — Nepali patro: Bikram Sambat dates with festivals, fasts and
// public holidays. Reuses the exact BS converter (nepaliCalendar.js) and the
// verified 2083 festival tables (nepaliFestivals.js) — fully offline.
// Tapping any day (grid, list, hero) opens a colourful day popup.
import { icon, esc, openModal, haptic } from '../ui/dom.js';
import { t, getLang } from '../i18n.js';
import {
  todayBs, bsToAd, daysInBsMonth, toDevanagari, formatAd,
  BS_MONTHS, BS_MONTHS_EN, WEEKDAYS, WEEKDAYS_NE, AD_MONTHS,
  BS_MIN_YEAR, BS_MAX_YEAR,
} from '../data/nepaliCalendar.js';
import { eventsForBs, monthEvents } from '../data/nepaliFestivals.js';

// kind → color + chip dressing (shares hues with the app's design palette)
const KINDS = {
  national: { c: '#ff5e7d', bg: 'rgba(255,94,125,.15)', label: 'National' },
  festival: { c: '#9d7bff', bg: 'rgba(157,123,255,.16)', label: 'Festival' },
  fast:     { c: '#fbbf24', bg: 'rgba(251,191,36,.15)', label: 'Fast' },
  intl:     { c: '#4f8cff', bg: 'rgba(79,140,255,.16)', label: 'International' },
};
// one vivid band per kind for the day-popup header
const KIND_GRAD = {
  national: 'linear-gradient(135deg, #ff9a6b, #ff5e7d)',
  festival: 'linear-gradient(135deg, #9d7bff, #ff6fa5)',
  fast:     'linear-gradient(135deg, #fbc44d, #f59e0b)',
  intl:     'linear-gradient(135deg, #4f8cff, #66d4c6)',
};
const kindOf = e => KINDS[e.kind] || KINDS.festival;
const kindKey = e => KIND_GRAD[e.kind] ? e.kind : 'festival';
// the event that drives a day's color: holiday > fast > first event
const heroEv = evs => evs.find(e => e.hol) || evs.find(e => e.kind === 'fast') || evs[0];

// Devanagari single-letter weekday strip, Sunday first (आइत सोम मंगल बुध बिही शुक्र शनि)
const WD = ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'];

// module state survives re-renders (language toggles, route hops)
let st = null;

const ne$ = () => getLang() === 'ne';
const name = e => ne$() ? e.ne : e.en;
const sub = e => ne$() ? e.en : e.ne;
const monthName = m => ne$() ? BS_MONTHS[m - 1] : BS_MONTHS_EN[m - 1];

export function render(view) {
  const now = todayBs();
  if (!st) st = { y: now.bs.year, m: now.bs.month, sel: now.bs.day };
  const dim = daysInBsMonth(st.y, st.m);
  if (st.sel > dim) st.sel = dim; // keep the selected day legal for this month
  if (st.y < BS_MIN_YEAR || st.y > BS_MAX_YEAR) st = { y: now.bs.year, m: now.bs.month, sel: now.bs.day };

  draw(view);
}

// ---------- full draw ----------
function draw(view) {
  const now = todayBs();
  const { y, m, sel } = st;
  const dim = daysInBsMonth(y, m);
  const firstWd = bsToAd(y, m, 1).weekday;
  const evMap = monthEvents(y, m);
  const isToday = d => y === now.bs.year && m === now.bs.month && d === now.bs.day;

  // ----- hero: today in Nepal (tap = today's popup) -----
  const todayEvs = eventsForBs(now.bs.year, now.bs.month, now.bs.day, now.ad);
  const todaySat = now.ad.weekday === 6;
  const hero = `
    <div class="hero tap" data-today style="padding:18px">
      <div class="halo"></div>
      <div class="card-title" style="margin-bottom:8px">${esc(t('Today in Nepal'))}</div>
      <div class="row" style="gap:14px">
        <div class="cal-big">${toDevanagari(now.bs.day)}</div>
        <div style="min-width:0">
          <h1 style="font-size:20px;line-height:1.3">${esc(ne$()
            ? `${BS_MONTHS[now.bs.month - 1]} ${toDevanagari(now.bs.year)} · ${WEEKDAYS_NE[now.ad.weekday]}`
            : `${BS_MONTHS_EN[now.bs.month - 1]} ${now.bs.year} · ${WEEKDAYS[now.ad.weekday]}`)}</h1>
          <div class="small muted mt-8">${esc(formatAd(now.ad, { weekday: false }))}</div>
        </div>
      </div>
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
        ${todaySat ? `<span class="book-pill" style="border-color:rgba(255,94,125,.4)">🛀 ${esc(t('Saturday — weekly holiday'))}</span>` : ''}
        ${todayEvs.map(e => `<span class="book-pill" style="border-color:${kindOf(e).c}">${e.emoji} ${esc(name(e))}</span>`).join('')}
        ${!todayEvs.length && !todaySat ? `<span class="book-pill">${esc(t('Regular day'))}</span>` : ''}
      </div>
    </div>`;

  // ----- patro grid (kind-colored washes make the month readable at a glance) -----
  let cells = '';
  for (let i = 0; i < firstWd; i++) cells += '<div class="pato-cell ghost" aria-hidden="true"></div>';
  for (let d = 1; d <= dim; d++) {
    const ad = bsToAd(y, m, d);
    const evs = evMap[d] || [];
    const cls = ['pato-cell', ad.weekday === 6 && 'wk', isToday(d) && 'today', d === sel && 'sel'].filter(Boolean).join(' ');
    const tint = !isToday(d) && evs.length ? kindOf(heroEv(evs)) : null;
    cells += `
      <button class="${cls}" data-d="${d}"${tint ? ` style="background:${tint.bg}"` : ''} aria-label="${esc(`${BS_MONTHS_EN[m - 1]} ${d}, ${y}`)}">
        <span class="dn">${toDevanagari(d)}</span>
        <span class="ad">${ad.day}</span>
        <span class="pato-dots">${evs.slice(0, 3).map(e => `<i style="background:${kindOf(e).c}"></i>`).join('')}</span>
      </button>`;
  }
  const pad = (7 - (firstWd + dim) % 7) % 7;
  for (let i = 0; i < pad; i++) cells += '<div class="pato-cell ghost" aria-hidden="true"></div>';

  const patro = `
    <div class="card mt-14">
      <div class="pato-bar">
        <button class="pato-nav" data-nav="-1" aria-label="Previous month" ${y === BS_MIN_YEAR && m === 1 ? 'disabled' : ''}>${icon('prev')}</button>
        <button class="pato-label" data-pick>
          <span class="pl-ne">${BS_MONTHS[m - 1]} ${toDevanagari(y)}</span>
          <span class="pl-en">${BS_MONTHS_EN[m - 1]} ${y} · tap to browse</span>
        </button>
        <button class="pato-nav" data-nav="1" aria-label="Next month" ${y === BS_MAX_YEAR && m === 12 ? 'disabled' : ''}>${icon('next')}</button>
        <button class="chip pato-go" data-go>${esc(t('Today'))}</button>
      </div>
      <div class="pato-wd">${WD.map(w => `<span>${w}</span>`).join('')}</div>
      <div class="pato-grid">${cells}</div>
      <div class="cal-legend">
        <span><i style="background:${KINDS.national.c}"></i>${esc(t('National / holiday'))}</span>
        <span><i style="background:${KINDS.fast.c}"></i>${esc(t('Fast'))}</span>
        <span><i style="background:${KINDS.festival.c}"></i>${esc(t('Festival'))}</span>
        <span><i style="background:${KINDS.intl.c}"></i>${esc(t('International'))}</span>
      </div>
    </div>
    ${y !== 2083 ? `<div class="cal-note mt-14">${esc(t('Lunar festival dates shift every year — BS 2083 (Apr 2026 – Apr 2027) is fully verified. Other years show fixed days & weekly holidays only.'))}</div>` : ''}`;

  // ----- this month -----
  const rows = [];
  for (let d = 1; d <= dim; d++) {
    for (const e of evMap[d] || []) {
      const ad = bsToAd(y, m, d);
      rows.push(`
        <div class="cal-ev tap" data-d="${d}">
          <div class="ne-e" style="background:${kindOf(e).bg}">${e.emoji}</div>
          <div style="min-width:0;flex:1">
            <h4>${esc(name(e))} <span class="small muted">${esc(sub(e))}</span></h4>
            <div class="small muted mt-8">${esc(ad.day)} ${esc(AD_MONTHS[ad.month - 1].slice(0, 3))}${e.note ? ` · ${esc(e.note)}` : ''}${e.food ? ` · ${esc(e.food)}` : ''}</div>
          </div>
          <span class="cal-badge" style="color:${kindOf(e).c};background:${kindOf(e).bg}">${esc(e.hol ? t('Public holiday') : t(kindOf(e).label))}</span>
        </div>`);
    }
  }
  const monthList = `
    <div class="section-title">${esc(t('This month'))}</div>
    <div class="card" id="cal-mlist" style="padding:8px 16px">
      ${rows.length
        ? rows.join('')
        : `<div class="center small muted" style="padding:16px 0">${esc(t('This month has no recorded events — Saturdays are still weekly holidays.'))}</div>`}
    </div>`;

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('calendar')} ${esc(t('Calendar'))}</div></div>
    ${hero}
    ${patro}
    ${monthList}
    <div class="center small muted mt-20">${esc(t('Saturday is the weekly public holiday of Nepal.'))}</div>
  `;

  wire(view);
}

// ---------- keep the grid highlight in sync without a full redraw ----------
function markSel(view) {
  view.querySelectorAll('.pato-cell.sel').forEach(x => x.classList.remove('sel'));
  view.querySelector(`.pato-cell[data-d="${st.sel}"]`)?.classList.add('sel');
}

// ---------- wiring ----------
function wire(view) {
  // month stepping (with year rollover)
  view.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => {
    haptic(8);
    let { y, m } = st;
    m += +b.dataset.nav;
    if (m === 0) { m = 12; y--; } else if (m === 13) { m = 1; y++; }
    if (y < BS_MIN_YEAR || y > BS_MAX_YEAR) return;
    st = { y, m, sel: 1 };
    draw(view);
  }));

  // back to today
  view.querySelector('[data-go]').addEventListener('click', () => {
    const now = todayBs();
    st = { y: now.bs.year, m: now.bs.month, sel: now.bs.day };
    haptic(8);
    draw(view);
  });

  // open the month/year picker
  view.querySelector('[data-pick]').addEventListener('click', () => openPick(view));

  // hero card → today's popup
  view.querySelector('[data-today]').addEventListener('click', e => {
    if (e.target.closest('.book-pill')) return; // chips stay visual only
    openDay(view, todayBs().bs.day);
  });

  // tapping a day in the grid opens the colourful popup
  view.querySelector('.pato-grid').addEventListener('click', e => {
    const c = e.target.closest('[data-d]');
    if (!c) return;
    st.sel = +c.dataset.d;
    markSel(view);
    openDay(view, st.sel);
  });

  // month list rows open the popup for that day too
  view.querySelector('#cal-mlist').addEventListener('click', e => {
    const r = e.target.closest('[data-d]');
    if (!r) return;
    st.sel = +r.dataset.d;
    markSel(view);
    openDay(view, st.sel);
  });
}

// ---------- colourful day popup ----------
function openDay(view, d) {
  haptic(10);
  const { y, m } = st;
  const ad = bsToAd(y, m, d);
  const evs = eventsForBs(y, m, d, ad);
  const sat = ad.weekday === 6;
  const hasHol = evs.some(e => e.hol);
  const anyFast = evs.some(e => e.kind === 'fast');
  const ke = heroEv(evs);
  const band = ke ? KIND_GRAD[kindKey(ke)] : sat ? KIND_GRAD.national : '';
  const dt = todayBs();
  const isToday = y === dt.bs.year && m === dt.bs.month && d === dt.bs.day;

  const title = `${ne$() ? WEEKDAYS_NE[ad.weekday] : WEEKDAYS[ad.weekday]}, ${monthName(m)} ${ne$() ? toDevanagari(d) : d} ${ne$() ? toDevanagari(y) : y}`;
  const badges = (hasHol || sat) ? `
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:14px">
      ${hasHol ? `<span class="cal-badge" style="color:${KINDS.national.c};background:${KINDS.national.bg}">${esc(t('Public holiday'))}</span>` : ''}
      ${sat ? `<span class="cal-badge" style="color:var(--muted);background:var(--surface-2)">${esc(t('Weekly holiday'))}</span>` : ''}
    </div>` : '';
  const eventsBody = evs.length ? `
    <div class="stack" style="gap:2px">
      ${evs.map(e => `
        <div class="cal-ev hl" style="border-left-color:${kindOf(e).c}">
          <div class="ne-e" style="background:${kindOf(e).bg}">${e.emoji}</div>
          <div style="min-width:0;flex:1">
            <h4>${esc(name(e))} <span class="small muted">${esc(sub(e))}</span></h4>
            ${e.note || e.food ? `<div class="small muted mt-8">${esc(e.note || '')}${e.note && e.food ? ' · ' : ''}${esc(e.food || '')}</div>` : ''}
          </div>
          <span class="cal-badge" style="color:${kindOf(e).c};background:${kindOf(e).bg}">${esc(e.hol ? t('Public holiday') : t(kindOf(e).label))}</span>
        </div>`).join('')}
    </div>` : `<div class="small muted" style="margin-top:12px">${esc(t('No events on this day'))}.</div>`;

  const modal = openModal(`
    <div class="cal-pop-head${band ? '' : ' soft'}"${band ? ` style="background:${band}"` : ''}>
      <button class="cp-nav" data-daynav="-1" aria-label="Previous day">${icon('prev')}</button>
      <div class="cal-pop-num">${toDevanagari(d)}</div>
      <div style="min-width:0;flex:1">
        <div class="cp-title">${esc(title)}${isToday ? ` · ${esc(t('Today'))}` : ''}</div>
        <div class="cp-sub">${esc(formatAd(ad, { weekday: false }))}${sat ? ` · ${esc(t('Weekly holiday'))}` : ''}</div>
      </div>
      <button class="cp-nav" data-daynav="1" aria-label="Next day">${icon('next')}</button>
    </div>
    ${badges}
    <div style="margin-top:14px">${eventsBody}</div>
    ${anyFast ? `<a class="btn wide primary" style="text-decoration:none;margin-top:14px" href="#/fasting" data-fast>🌾 ${esc(t('Fast & Fest'))} →</a>` : ''}
    <button class="btn wide ghost mt-14" data-close>${esc(t('Close'))}</button>
  `);

  // prev / next day stepping (rolls over month & year)
  modal.el.addEventListener('click', e => {
    const nav = e.target.closest('[data-daynav]');
    if (!nav) return;
    const prevM = st.m, prevY = st.y;
    let { y, m } = st;
    let nd = d + +nav.dataset.daynav;
    if (nd < 1) {
      m--; if (m < 1) { m = 12; y--; }
      nd = daysInBsMonth(y, m);
    } else if (nd > daysInBsMonth(y, m)) {
      nd = 1; m++; if (m > 12) { m = 1; y++; }
    }
    if (y < BS_MIN_YEAR || y > BS_MAX_YEAR) return;
    haptic(8);
    st = { y, m, sel: nd };
    modal.close();
    if (m !== prevM || y !== prevY) draw(view);
    else markSel(view);
    openDay(view, nd);
  });

  // navigating to Fast & Fest closes the popup; the route swap happens after
  modal.el.addEventListener('click', e => {
    if (e.target.closest('[data-fast]')) modal.close();
  });
}

// ---------- month / year picker modal ----------
function openPick(view) {
  let years = '';
  for (let yy = 2078; yy <= 2088; yy++) {
    years += `<button class="chip ${yy === st.y ? 'on' : ''}" data-py="${yy}">${toDevanagari(yy)}
      <small>${yy === 2083 ? `✓ ${esc(t('verified'))}` : yy}</small></button>`;
  }
  const modal = openModal(`
    <div class="card-title">${esc(t('Select month'))}</div>
    <div class="cal-pick">
      ${BS_MONTHS.map((n, i) => `<button class="chip ${i + 1 === st.m ? 'on' : ''}" data-pm="${i + 1}">${n}<small>${BS_MONTHS_EN[i]}</small></button>`).join('')}
    </div>
    <div class="card-title mt-14">${esc(t('Select year'))}</div>
    <div class="cal-pick">${years}</div>
    <button class="btn wide ghost mt-14" data-close>${esc(t('Close'))}</button>
  `);
  modal.el.addEventListener('click', e => {
    const pm = e.target.closest('[data-pm]');
    const py = e.target.closest('[data-py]');
    if (!pm && !py) return;
    if (pm) st = { ...st, m: +pm.dataset.pm };
    if (py) st = { ...st, y: +py.dataset.py };
    st = { ...st, sel: Math.min(st.sel, daysInBsMonth(st.y, st.m)) };
    haptic(10);
    modal.close();
    draw(view);
  });
}
