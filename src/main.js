// BiggerBody — app bootstrap, router and navigation.
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { el, icon } from './ui/dom.js';
import { getSettings } from './modules/storage.js';
import { unlockAudio, stopMelody } from './modules/audio.js';

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
  { id: 'care', label: 'Care', icon: 'heart' },
  { id: 'library', label: 'Library', icon: 'book' },
  { id: 'books', label: 'Book Summaries', icon: 'book' },
  { id: 'melodies', label: 'Melodies', icon: 'music' },
  { id: 'dates', label: 'Date Converter', icon: 'calendar' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const navLink = r => `<a href="#/${r.id}" data-route="${r.id}">${icon(r.icon)}<span>${r.label}</span></a>`;
nav.innerHTML = ROUTES.map(navLink).join('');
sidebar.innerHTML = `
  <div class="brand"><img src="/icons/logo-512.png"> BiggerBody</div>
  ${[...ROUTES.filter(r => r.id !== 'more'), ...SIDE_EXTRA].map(navLink).join('')}
  <div class="foot">Made with ❤️ by<br><b>Suraj Basnet</b></div>
`;

// "More" view aggregates secondary sections
function renderMore(v) {
  v.innerHTML = `
    <div class="header"><div class="brand">${icon('grid')} More</div></div>
    <div class="grid-2">
      ${SIDE_EXTRA.map(r => `
        <div class="card tap" data-go="${r.id}">
          <div style="font-size:26px">${{ dance: '💃', motivation: '💫', care: '💞', library: '📚', books: '📖', melodies: '🎵', dates: '📅', settings: '⚙️' }[r.id]}</div>
          <div style="font-weight:800" class="mt-8">${r.label}</div>
          <div class="small muted">${{ dance: 'Beat studio & dance cardio', motivation: 'Quotes & affirmations', care: 'Relationships & gratitude', library: 'All exercises A–Z', books: 'Best self-help books, distilled', melodies: 'Generated meditation music', dates: 'Nepali ↔ English calendar', settings: 'Profile, theme, install' }[r.id]}</div>
        </div>`).join('')}
    </div>
    <div class="center small muted mt-20">Made with ❤️ by <b>Suraj Basnet</b></div>
  `;
  v.querySelectorAll('[data-go]').forEach(n => n.addEventListener('click', () => { location.hash = `#/${n.dataset.go}`; }));
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
    view.innerHTML = `<div class="empty"><div class="e">😅</div>Something went wrong loading this page.<br><span class="small">${err.message}</span></div>`;
  }
}

// expose rerender for views that update state
Object.defineProperty(view, '_rerender', { get: () => route });

window.addEventListener('hashchange', route);
route();

// unlock audio on first interaction (mobile browsers)
['pointerdown', 'keydown'].forEach(ev =>
  window.addEventListener(ev, unlockAudio, { once: true, passive: true })
);

// keep PWA installed prompt data fresh
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.__bbPrompt = e; });
