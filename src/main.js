// BiggerBody — app bootstrap, router and navigation.
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { el, icon, esc, toast, haptic } from './ui/dom.js';
import {
  getSettings, saveSettings, getWater, setWater,
  getSoState, setSoState, dayKey, addXP,
} from './modules/storage.js';
import { SO_PAPERS } from './data/sofficer.js';
import { unlockAudio, stopMelody } from './modules/audio.js';
import { t, setLang, applyChrome } from './i18n.js';
import { autoRepaint } from './modules/dateline.js';
import { init as initDateReminder } from './modules/reminder.js';
import { ADMIN_ROUTE } from './data/notices.js';

registerSW({ immediate: true });

// ---------- theme ----------
const s = getSettings();
if (s.theme === 'light') document.documentElement.dataset.theme = 'light';
if (s.theme === 'auto') {
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : '';
}

// ---------- splash ----------
const splash = el(`
  <div id="splash">
    <div class="inner">
      <img src="/icons/logo-512.png" alt="BiggerBody">
      <h1>BiggerBody</h1>
      <p>Train · Meditate · Grow</p>
      <div class="loader"></div>
      <div class="love">Made with ❤️ by <b>Suraj Basnet</b></div>
    </div>
  </div>`);
document.body.appendChild(splash);
const hideSplash = () => setTimeout(() => splash.classList.add('gone'), 1100);
if (document.readyState === 'complete') hideSplash();
else window.addEventListener('load', hideSplash);

// ---------- shell ----------
const app = document.getElementById('app');
app.innerHTML = `
  <aside class="sidebar" id="sidebar"></aside>
  <main class="app" id="view"></main>
  <nav class="nav" id="nav"></nav>
`;
const view = document.getElementById('view');
const nav = document.getElementById('nav');
const sidebar = document.getElementById('sidebar');

// ---------- quick language toggle (English ⇄ नेपाली) ----------
// Floating EN | ने pill so Nepali is always one tap away, no Settings trip needed.
const langBtn = el(`
  <div id="lang-toggle" class="mini-lang" role="group" aria-label="Switch language / भाषा बदल्नुहोस्">
    <button class="seg" data-lang="en">EN</button><button class="seg" data-lang="ne">ने</button>
  </div>`);
document.body.appendChild(langBtn);
function paintLangBtn() {
  const cur = getSettings().lang || 'en';
  langBtn.querySelectorAll('.seg').forEach(s => s.classList.toggle('on', s.dataset.lang === cur));
}
paintLangBtn();
document.addEventListener('bb-lang', paintLangBtn);
langBtn.addEventListener('click', e => {
  const seg = e.target.closest('.seg');
  if (!seg || seg.dataset.lang === (getSettings().lang || 'en')) return;
  saveSettings({ lang: seg.dataset.lang });
  setLang(seg.dataset.lang);
  applyChrome();
  toast(t('Language changed ✅'));
  route();
});

// ---------- top date strip (always visible — Android, iOS & desktop) ----------
const dateStrip = el(`<div id="date-strip" class="date-strip" role="status" aria-label="Today's date"></div>`);
document.body.appendChild(dateStrip);
autoRepaint(dateStrip);

const ROUTES = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'workouts', label: 'Train', icon: 'train' },
  { id: 'mind', label: 'Mind', icon: 'mind' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
  { id: 'more', label: 'More', icon: 'grid' },
];
const SIDE_EXTRA = [
  { id: 'dance', label: 'Dance', icon: 'music' },
  { id: 'motivation', label: 'Motivation', icon: 'sparkle' },
  { id: 'news', label: 'News', icon: 'news' },
  { id: 'care', label: 'Care', icon: 'heart' },
  { id: 'library', label: 'Library', icon: 'book' },
  { id: 'books', label: 'Book Summaries', icon: 'book' },
  { id: 'sofficer', label: 'Section Officer', icon: 'medal' },
  { id: 'scriptures', label: 'Hindu Books', icon: 'lotus' },
  { id: 'melodies', label: 'Melodies', icon: 'music' },
  { id: 'dates', label: 'Date Converter', icon: 'calendar' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'ghargym', label: 'GharGym', icon: 'home' },
  { id: 'fasting', label: 'Fast & Fest', icon: 'lotus' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const navLink = r => `<a href="#/${r.id}" data-route="${r.id}">${icon(r.icon)}<span>${esc(t(r.label))}</span></a>`;
nav.innerHTML = ROUTES.map(navLink).join('');
sidebar.innerHTML = `
  <div class="brand"><img src="/icons/logo-512.png"> BiggerBody</div>
  ${[...ROUTES.filter(r => r.id !== 'more'), ...SIDE_EXTRA].map(navLink).join('')}
  <div class="foot">Made with ❤️ by<br><b>Suraj Basnet</b></div>
`;

// "More" — the premium hub: greeting · quick actions · flagship card · grouped services
const HUB_TAG = {
  dance: 'Beat studio & dance cardio', motivation: 'Quotes & affirmations', news: 'Live headlines from Nepal & beyond',
  care: 'Relationships & gratitude', library: 'All exercises A–Z', books: 'Best self-help books, distilled',
  scriptures: 'Free Hindu books — Gita, Chalisa & more', melodies: 'Generated meditation music',
  dates: 'Nepali ↔ English calendar', calendar: 'Nepali patro — festivals & holidays',
  ghargym: 'Strength from bottles, sacks, bricks', fasting: 'Train smart on fasting & festival days',
  settings: 'Profile, theme, install',
};
const HUB_EMOJI = {
  dance: '💃', motivation: '💫', news: '📰', care: '💞', library: '📚', books: '📖',
  scriptures: '🕉️', melodies: '🎵', dates: '📅', calendar: '🗓️', ghargym: '🏠', fasting: '🙏', settings: '⚙️',
};
const HUB_GROUPS = [
  { name: 'Workout & Body', ne: 'शरीर', dot: '#ff9a6b', tile: 't-work', ids: ['dance', 'ghargym', 'library'] },
  { name: 'Mind & Soul', ne: 'मन र आत्मा', dot: '#9d7bff', tile: 't-soul', ids: ['scriptures', 'melodies', 'fasting', 'care'] },
  { name: 'Knowledge', ne: 'ज्ञान', dot: '#4f8cff', tile: 't-know', ids: ['news', 'books', 'motivation'] },
  { name: 'Tools', ne: 'औजार', dot: '#2dd4a7', tile: 't-tool', ids: ['dates', 'calendar', 'settings'] },
];

const soStreak = so => {
  let s = 0;
  const d = new Date();
  const has = k => (so.hours?.[k] || 0) > 0;
  if (!has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (has(dayKey(d))) { s++; d.setDate(d.getDate() - 1); }
  return s;
};

function renderMore(v) {
  const so = getSoState();
  const topics = SO_PAPERS.flatMap(p => p.topics);
  const done = topics.filter(x => so.topics?.[x.id]).length;
  const pct = Math.round(done / topics.length * 100);
  const name = getSettings().name;
  const h = new Date().getHours();
  const hello = h < 12 ? 'शुभ प्रभात' : h < 17 ? 'नमस्ते' : 'शुभ साँझ';
  const tMin = so.hours?.[dayKey()] || 0;
  const prep = so.started
    ? Math.max(1, Math.floor((Date.now() - new Date(`${so.started}T00:00:00`).getTime()) / 864e5) + 1)
    : 0;

  v.innerHTML = `
    <div class="header"><div class="brand">${icon('grid')} ${esc(t('More'))}</div></div>
    <div class="hub-greet so-fade">
      <div class="hub-hello">${esc(hello)}${name ? `, ${esc(name)}` : ''} 🙏</div>
      <div class="hub-sub">सबै सेवा एकै ठाउँमा — every section, one tap away</div>
    </div>
    <div class="hub-quick so-fade mt-14" style="animation-delay:.05s">
      <button class="hub-q" data-act="water">💧 +1 water</button>
      <button class="hub-q" data-act="study">✍️ +30m study</button>
      <button class="hub-q" data-go="workouts">🏋️ Train</button>
      <button class="hub-q" data-go="mind">🧘 Breathe</button>
      <button class="hub-q" data-go="news">📰 Headlines</button>
    </div>
    <div class="hub-flag so-fade mt-14" data-go="sofficer" style="animation-delay:.09s">
      <div class="so-spot-shine"></div>
      <div class="row between" style="align-items:flex-start;gap:12px">
        <div style="min-width:0">
          <div class="hub-flag-eyebrow">FEATURED · LOK SEWA AAYOG</div>
          <div style="font-weight:900;font-size:17px" class="mt-8">🎖️ Section Officer</div>
          <div class="small muted mt-8">Job-aware schedule · syllabus · discipline · techniques</div>
        </div>
        <div class="so-ring" style="--p:${pct}%;width:58px;height:58px">
          <div class="in"><b style="font-size:12px">${pct}%</b><small>syllabus</small></div>
        </div>
      </div>
      <div class="row mt-14" style="gap:6px;flex-wrap:wrap">
        <span class="hub-chip">🔥 ${soStreak(so)}d streak</span>
        <span class="hub-chip">⏱ ${tMin}m today</span>
        ${prep ? `<span class="hub-chip">📅 ${prep}d preparing</span>` : '<span class="hub-chip">🚀 Start today</span>'}
      </div>
    </div>
    ${HUB_GROUPS.map((g, gi) => `
      <div class="hub-group-title so-fade" style="animation-delay:${.13 + gi * .05}s">
        <span class="dot" style="background:${g.dot}"></span>${esc(t(g.name))}
        <span class="small muted" style="font-weight:700">${esc(g.ne)}</span>
      </div>
      <div class="hub-grid">
        ${g.ids.map((id, i) => `
          <div class="hub-card so-fade" data-go="${id}" style="animation-delay:${.15 + gi * .05 + i * .03}s">
            <span class="tile ${g.tile}">${HUB_EMOJI[id]}</span>
            <span class="n">${esc(t(SIDE_EXTRA.find(r => r.id === id).label))}</span>
            <span class="d">${esc(t(HUB_TAG[id]))}</span>
          </div>`).join('')}
      </div>`).join('')}
    <div class="center small muted mt-20">Made with ❤️ by <b>Suraj Basnet</b></div>
  `;

  v.querySelectorAll('[data-go]').forEach(n => n.addEventListener('click', () => {
    location.hash = `#/${n.dataset.go}`;
    window.scrollTo({ top: 0 });
  }));
  v.querySelectorAll('[data-act]').forEach(n => n.addEventListener('click', () => {
    if (n.dataset.act === 'water') {
      const next = Math.min(12, getWater() + 1);
      setWater(next);
      toast(next >= 8 ? `💧 ${next}/8 glasses — goal done! 🎉` : `💧 ${next}/8 glasses — keep going`);
      haptic(12);
    }
    if (n.dataset.act === 'study') {
      const st = getSoState();
      const k = dayKey();
      st.hours[k] = (st.hours[k] || 0) + 30;
      setSoState({ started: st.started || k, hours: st.hours });
      addXP(3);
      toast('✍️ +30m logged — the officer in you grows 💪');
      haptic(14);
    }
  }));
}

// ---------- router ----------
let currentRoute = null;
let cleanup = null;

async function route() {
  const hash = (location.hash || '#/home').replace('#/', '');
  const [routeId, query] = hash.split('?');
  const params = Object.fromEntries(new URLSearchParams(query || ''));

  cleanup?.();
  stopMelody();
  const { stopSession } = await import('./views/mind.js');
  stopSession();
  view._figs?.forEach(f => f.destroy());
  view._figs = [];

  // 🔒 hidden admin — exists only at the unique link from data/notices.js
  if (routeId === ADMIN_ROUTE) {
    currentRoute = 'admin';
    try {
      const mod = await import('./views/admin.js');
      mod.render(view, params);
    } catch (err) {
      console.error(err);
      view.innerHTML = `<div class="empty"><div class="e">😅</div>${esc(t('Something went wrong loading this page.'))}<br><span class="small">${err.message}</span></div>`;
    }
    return;
  }

  const id = ROUTES.some(r => r.id === routeId) || SIDE_EXTRA.some(r => r.id === routeId) ? routeId : 'home';
  currentRoute = id;

  document.querySelectorAll('.nav a, .sidebar a').forEach(a => {
    const target = a.dataset.route === id ? a : (id === 'more' && a.dataset.route === 'more' ? a : null);
    a.classList.toggle('on', !!target);
  });
  window.scrollTo({ top: 0 });

  try {
    if (id === 'more') return renderMore(view);
    const mod = await import(`./views/${id}.js`);
    mod.render(view, params);
  } catch (err) {
    console.error(err);
    view.innerHTML = `<div class="empty"><div class="e">😅</div>${esc(t('Something went wrong loading this page.'))}<br><span class="small">${err.message}</span></div>`;
  }
}

// expose rerender for views that update state
Object.defineProperty(view, '_rerender', { get: () => route });

window.addEventListener('hashchange', route);
route();

// daily date notification — fires at the chosen time with today's date in it
initDateReminder();

// unlock audio on first interaction (mobile browsers)
['pointerdown', 'keydown'].forEach(ev =>
  window.addEventListener(ev, unlockAudio, { once: true, passive: true })
);

// keep PWA installed prompt data fresh
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.__bbPrompt = e; });
