// Daily motivation quotes — free APIs with graceful offline fallback.
import { get, set, dayKey } from './storage.js';
import { LOCAL_QUOTES } from '../data/content.js';

function pickLocal(seed) {
  return LOCAL_QUOTES[seed % LOCAL_QUOTES.length];
}

async function tryFetch(url, timeout = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

export async function getDailyQuote(force = false) {
  const cached = get('quote', null);
  if (!force && cached && cached.date === dayKey()) return cached;

  const seed = Math.abs([...dayKey()].reduce((a, c) => a + c.charCodeAt(0), 0));
  let quote = null;

  // 1) ZenQuotes (free, CORS-friendly)
  try {
    const data = await tryFetch('https://zenquotes.io/api/random');
    if (Array.isArray(data) && data[0]?.q) quote = { q: data[0].q, a: data[0].a || 'Unknown' };
  } catch { /* next */ }

  // 2) Quotable (free)
  if (!quote) {
    try {
      const data = await tryFetch('https://api.quotable.io/random?tags=inspirational,motivational,wisdom');
      if (data?.content) quote = { q: data.content, a: data.author || 'Unknown' };
    } catch { /* next */ }
  }

  // 3) Offline library
  if (!quote) quote = pickLocal(seed);

  const result = { ...quote, date: dayKey(), offline: !quote.source };
  set('quote', result);
  return result;
}

export function randomQuote() {
  return LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
}

// ---------- DummyJSON big-quote engine (https://dummyjson.com/quotes) ----------
// Fetches the full free library (~1450 quotes) once with ?limit=0, caches it on
// device, then serves a seeded "quote of the day" or a random spark on demand.
const DUMMY_URL = 'https://dummyjson.com/quotes?limit=0';

async function getDummyLibrary() {
  const cached = get('dummyQuotes', null);
  if (cached?.quotes?.length) return cached;
  try {
    const data = await tryFetch(DUMMY_URL, 8000);
    if (!Array.isArray(data?.quotes) || !data.quotes.length) throw new Error('empty');
    const lib = {
      quotes: data.quotes.map(x => ({ q: x.quote, a: x.author || 'Unknown' })),
      total: data.total || data.quotes.length,
      at: Date.now(),
    };
    try { set('dummyQuotes', lib); } catch { /* quota — usable this session only */ }
    return lib;
  } catch { return null; }
}

function seededIndex(len, salt = '') {
  const s = Math.abs([...(dayKey() + salt)].reduce((a, c) => a + c.charCodeAt(0), 0));
  return s % len;
}

export async function getBigQuote(force = false) {
  const lib = await getDummyLibrary();
  if (lib) {
    const i = force ? Math.floor(Math.random() * lib.quotes.length) : seededIndex(lib.quotes.length);
    return { ...lib.quotes[i], n: i + 1, total: lib.total, online: true };
  }
  // Offline — fall back to the bundled library with the same daily-seed logic.
  const q = force ? randomQuote() : pickLocal(seededIndex(LOCAL_QUOTES.length));
  return { ...q, n: 0, total: 0, online: false };
}
