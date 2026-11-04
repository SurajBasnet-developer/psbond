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
