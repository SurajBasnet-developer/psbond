// News — live headlines from Nepal's portals, straight in the app. No backend:
// feeds are fetched through a CORS-friendly chain and parsed in the browser
// with DOMParser. Everything caches on-device (localStorage) so the last
// loaded feed lives on offline, and articles are extracted for in-app reading.

import { get, set } from './storage.js';
import { t, getLang } from '../i18n.js';

// ---------- sources ----------
// type 'rss'   → the portal's own feed (articles + images → best in-app reading)
// type 'gnews' → no open feed; a Google News "site:" feed carries the wires
export const SOURCES = [
  { id: 'onlinekhabar', name: 'Online Khabar', nep: 'अनलाइन खबर', color: '#ff9a6b', type: 'rss', url: 'https://www.onlinekhabar.com/feed', home: 'https://www.onlinekhabar.com/', frame: true },
  { id: 'ekantipur', name: 'eKantipur', nep: 'एकान्तिपुर', color: '#ef4056', type: 'gnews', url: 'https://news.google.com/rss/search?q=site:ekantipur.com+when:30d&hl=ne&gl=NP&ceid=NP:ne', home: 'https://ekantipur.com/', frame: true },
  { id: 'gorkhapatra', name: 'Gorkhapatra', nep: 'गोरखापत्र', color: '#34d399', type: 'rss', url: 'https://gorkhapatraonline.com/rss', home: 'https://gorkhapatraonline.com/', frame: true },
  { id: 'shilapatra', name: 'Shilapatra', nep: 'शिलापत्र', color: '#4ade80', type: 'rss', url: 'https://shilapatra.com/feed', home: 'https://shilapatra.com/', frame: true },
];

export const sourceById = id => SOURCES.find(s => s.id === id);

// ---------- tiny helpers ----------
export const stripHtml = h => {
  try { const d = new DOMParser().parseFromString(`<div>${String(h || '')}</div>`, 'text/html'); return (d.body.textContent || '').replace(/\s+/g, ' ').trim(); }
  catch { return String(h || '').replace(/<[^>]*>/g, '').trim(); }
};

const hash = s => [...String(s)].reduce((h, c) => ((h * 31 + c.charCodeAt(0)) >>> 0), 5381).toString(36);

const isBadImg = u => !u || /^(data|javascript):/i.test(u)
  || /(?:^|[\/._-])(?:logo|favicon|icon|sprite|default-photo|placeholder|avatar|gravatar|pixel|1x1|feedburner)(?:[\/._-]|$)/i.test(u)
  || /(?:^|[\/_-])(?:ads?|banner)(?:[\/._-]|$)/i.test(u)
  || u.startsWith('https://news.google.com');

function imgFromHtml(html) {
  if (!html) return '';
  const m = String(html).match(/<img[^>]+src=["']?([^"'\s>]+)/i)
    || String(html).match(/<img[^>]+data-(?:src|orig(?:inal)?)=["']([^"']+)/i);
  let u = m ? m[1].replace(/&amp;/g, '&') : '';
  // worst case: empty attribute then a later src ❑ — also try <img srcset
  if (!u) {
    const m2 = String(html).match(/srcset=["']?([^"',\s]+)/i);
    u = m2 ? m2[1] : '';
  }
  return isBadImg(u) ? '' : u;
}

// hotlink-blocked or slow image? re-serve through the free weserv image proxy
export const proxiedImg = u =>
  `https://images.weserv.nl/?url=${encodeURIComponent(String(u).replace(/^https?:\/\//i, ''))}&w=520&output=webp&q=85`;

// portals whose wire comes without images (WordPress ones expose oEmbed with the
// story thumbnail) — enrich the first few imageless items, persist it in cache
async function wpOembed(src, items) {
  let host = '';
  try { host = new URL(src.url).host; } catch { return false; }
  const know = get('newsOembed', {});
  if (know[host] === 'skip') return false;
  const targets = items.filter(i => !i.img && i.link).slice(0, 5);
  if (!targets.length) return false;
  let changed = false, answered = 0;
  await Promise.all(targets.map(async it => {
    const got = await pace(() => tryFetch(`https://${host}/wp-json/oembed/1.0/embed?url=${encodeURIComponent(it.link)}`, 9000));
    if (!got) return;
    answered++;
    try {
      const j = JSON.parse(got);
      let t = j.thumbnail_url || imgFromHtml(j.html || '');
      if (t && !isBadImg(t)) { it.img = t.replace(/&amp;/g, '&'); changed = true; }
    } catch { /* not a wp-json endpoint */ }
  }));
  know[host] = changed ? 'ok' : (answered > 0 ? 'skip' : know[host]);
  set('newsOembed', know);
  return changed;
}

// Google News links are base64-packed; try to pull the real article URL out.
function gnewsTarget(link) {
  if (!/news\.google\.com/.test(link)) return link;
  try {
    let b = (link.match(/articles\/([A-Za-z0-9\-_]+)/) || [])[1] || '';
    if (!b) return link;
    b = b.replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    const bin = atob(b).slice(0, 600);
    const hit = bin.match(/https?:\/\/[\x21-\x2b\x2d\x2f-\x3f\x40-\x7e]+/); // printable, minus \s and "
    return hit ? hit[0] : link;
  } catch { return link; }
}

// Google titles look like "Story - Source"; drop a suffix matching the outlet.
function cleanTitle(title, src) {
  let s = String(title || '').replace(/\s+/g, ' ').trim();
  if (src?.type === 'gnews') {
    const tokens = src.name.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (tokens.length) {
      const re = new RegExp(`\\s*[-–—]\\s*(?:The\\s+)?(?:${tokens.join('|')})\\w*[^-–—]*$`, 'i');
      s = s.replace(re, '');
    }
  }
  return s;
}

const parseDate = v => {
  if (!v) return 0;
  const d = new Date(String(v).trim().replace(/(\d\d:\d\d:\d\d)\s+/, '$1 '));
  const ms = d.getTime();
  return Number.isFinite(ms) ? ms : 0;
};

function withTimeout(ms) {
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, done: () => clearTimeout(id) };
}

async function tryFetch(url, ms = 9000, headers) {
  const { signal, done } = withTimeout(ms);
  try {
    const r = await fetch(url, { signal, headers: headers || { Accept: 'application/json, application/rss+xml, application/atom+xml, text/xml, text/html, */*' } });
    if (!r.ok) throw new Error(String(r.status));
    const txt = await r.text();
    if (!txt || txt.length < 24) throw new Error('empty');
    return txt;
  } finally { done(); }
}

// ---------- feed fetching (chain: rss2json → direct → allorigins → codetabs) ----------
async function viaRss2json(url, src) {
  const j = JSON.parse(await tryFetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`, 11000));
  if (j.status !== 'ok' || !Array.isArray(j.items)) throw new Error('rss2json');
  return j.items.map(i => ({
    title: i.title, link: i.link, ts: parseDate(i.pubDate),
    html: i.content || '', desc: i.description || '',
    img: i.thumbnail || i.enclosure?.link || '',
  }));
}

function parseXmlFeed(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('not-a-feed');
  // getElementsByTagName handles namespaced tags (content:encoded, media:content …)
  const feedItems = [...(doc.getElementsByTagName('item') || []), ...(doc.getElementsByTagName('entry') || [])];
  if (!feedItems.length) throw new Error('not-a-feed');
  const out = [];
  for (const n of feedItems) {
    const first = names => {
      let f = null;
      for (const name of names) {
        const list = n.getElementsByTagName(name);
        if (list.length) { f = list[0]; break; }
      }
      return f;
    };
    const linkNode = first(['link']);
    let link = linkNode ? (linkNode.textContent?.trim() || linkNode.getAttribute('href')?.trim() || '') : '';
    if (!link || !/^https?:/i.test(link)) { const g = first(['guid', 'id']); link = g ? g.textContent.trim() : ''; link = stripHtml(link); }
    if (!/^https?:\/\//i.test(link)) continue;
    const html = first(['content:encoded', 'content', 'description', 'summary'])?.textContent || '';
    let img = '';
    const mc = first(['media:content']), mt = first(['media:thumbnail']);
    if (mc && !isBadImg(mc.getAttribute('url'))) img = mc.getAttribute('url').replace(/&amp;/g, '&');
    else if (mt && !isBadImg(mt.getAttribute('url'))) img = mt.getAttribute('url').replace(/&amp;/g, '&');
    else {
      const e = first(['enclosure']);
      const eu = e?.getAttribute('url');
      if (eu && /image|\.jpe?g|\.png|\.webp|\.gif/i.test(`${e.getAttribute('type') || ''} ${eu}`)) img = eu.replace(/&amp;/g, '&');
    }
    out.push({
      title: first(['title'])?.textContent || '',
      link,
      ts: parseDate(first(['pubDate', 'published', 'updated', 'dc:date'])?.textContent),
      html,
      desc: html,
      img,
    });
  }
  return out;
}

// proxy pacing — public endpoints rate-limit bursts hard, so keep a global
// budget of parallel fallback requests
const MAX_INFLIGHT = 4;
let inflight = 0;
const waiters = [];

async function pace(fn) {
  if (inflight >= MAX_INFLIGHT) await new Promise(res => waiters.push(res));
  inflight++;
  try {
    return await fn();
  } catch {
    return null;
  } finally {
    inflight = Math.max(0, inflight - 1);
    const w = waiters.shift();
    if (w) w();
  }
}

export async function fetchFeed(src) {
  // the two dependable channels race first (rss2json ↔ jina raw-xml); the rest
  // walk through the global pace so bursts can't trip every public rate cap.
  const steps = [
    () => viaRss2json(src.url, src),
    () => tryFetch(`https://r.jina.ai/${src.url}`, 13000, { 'x-return-format': 'text' }),
    () => tryFetch(src.url, 6000),
    () => tryFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(src.url)}`, 11000),
    () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(src.url)}`, 11000),
    () => tryFetch(`https://api.allorigins.win/get?url=${encodeURIComponent(src.url)}`, 11000),
    () => tryFetch(`https://corsproxy.io/?url=${encodeURIComponent(src.url)}`, 11000),
  ];
  const first = await Promise.allSettled([steps[0](), steps[1]()]);
  for (const r of first) {
    if (r.status !== 'fulfilled') continue;
    const items = parseGot(r.value, src);
    if (items.length) return items;
  }
  for (const step of steps.slice(2)) {
    const got = await pace(step);
    if (got == null) continue;
    const items = parseGot(got, src);
    if (items.length) return items;
  }
  return [];
}

function parseGot(got, src) {
  if (Array.isArray(got)) return normalize(got, src); // rss2json already in item form
  if (typeof got !== 'string') return [];
  let raw = got;
  if (raw[0] === '{' && raw.includes('"contents"')) { try { raw = JSON.parse(raw).contents || raw; } catch { /* carried on with raw */ } }
  // heads like jina may prepend meta lines — parse from the actual XML
  const xi = raw.indexOf('<?xml');
  const body = xi > 0 ? raw.slice(xi) : raw;
  if (!/<item[\s>]|<entry[\s>]/.test(body)) return [];
  try { return normalize(parseXmlFeed(body), src); } catch { return []; }
}

function normalize(raw, src) {
  const out = [];
  const seen = new Set();
  for (const r of raw) {
    let link = (r.link || '').trim().replace(/&amp;/g, '&');
    if (src.type === 'gnews') link = gnewsTarget(link);
    if (!/^https?:\/\//i.test(link)) continue;
    // home-page links aren't stories
    try { const u = new URL(link); if (u.pathname.length < 2 || /^\/?(home|index\.\w+)?\/?$/i.test(u.pathname)) continue; } catch { continue; }
    const id = hash(link);
    if (seen.has(id)) continue;
    seen.add(id);
    const img = (r.img && !isBadImg(r.img) ? r.img : '') || imgFromHtml(r.html) || imgFromHtml(r.desc);
    const title = cleanTitle(r.title, src) || stripHtml(r.desc).slice(0, 80) || 'Untitled';
    if (title.length < 5) continue; // navigational noise, not a story
    // Google's site-search serves ancient index leftovers with no fresh glance — drop them
    if (src.type === 'gnews' && r.ts && Date.now() - r.ts > 60 * 864e5) continue;
    const desc = src.type === 'gnews' ? '' : stripHtml(r.html || r.desc || '').slice(0, 320);
    out.push({ id, title, link, source: src.id, ts: r.ts || Date.now(), desc, img });
  }
  return out.sort((a, b) => b.ts - a.ts);
}

// ---------- cache ----------
const TTL = 20 * 60 * 1000;

export async function getFeed(src, force = false) {
  const cache = get('newsFeed', {});
  const hit = cache[src.id];
  if (!force && hit?.items?.length && Date.now() - hit.at < TTL) {
    return { items: hit.items, at: hit.at, failed: false };
  }
  const items = await fetchFeed(src);
  if (items.length) {
    // wire has mostly no images and the portal is WordPress? pull thumbnails
    // from its oEmbed endpoint so cards and the hero look right
    const imgless = items.filter(i => !i.img).length;
    if (imgless > items.length * 0.7) {
      try { await wpOembed(src, items); } catch { /* cosmetic only */ }
    }
    cache[src.id] = { at: Date.now(), items: items.slice(0, 14) };
    set('newsFeed', cache);
    return { items: cache[src.id].items, at: cache[src.id].at, failed: false };
  }
  if (hit?.items?.length) return { items: hit.items, at: hit.at, failed: true };
  return { items: [], at: 0, failed: true };
}

export async function getMixed(force = false) {
  // stagger portals in small batches so public proxies don't rate-limit a burst
  const res = await pool(SOURCES, 3, s => getFeed(s, force).catch(() => ({ items: [], at: 0, failed: true })));
  const seen = new Set();
  const items = res
    .flatMap(r => r.items)
    .sort((a, b) => b.ts - a.ts)
    .filter(i => { // de-dupe identical headlines across portals
      const k = i.title.toLowerCase().replace(/\W+/g, '').slice(0, 48);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  return { items: items.slice(0, 120), at: Math.max(0, ...res.map(r => r.at || 0)), failed: res.every(r => r.failed) && !items.length };
}

// run fn over tasks n-at-a-time, preserving order
async function pool(tasks, n, fn) {
  const out = new Array(tasks.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, tasks.length) }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      out[idx] = await fn(tasks[idx]);
    }
  }));
  return out;
}

// ---------- saved / read ----------
export const getSaved = () => get('newsSaved', []);

export function toggleSave(item) {
  const s = getSaved();
  const i = s.findIndex(x => x.id === item.id);
  if (i > -1) { s.splice(i, 1); set('newsSaved', s); return false; }
  s.unshift({ ...item, savedAt: Date.now() });
  set('newsSaved', s.slice(0, 60));
  return true;
}

export const isSaved = id => getSaved().some(x => x.id === id);

export function markRead(id) {
  const log = get('newsRead', {});
  log[id] = Date.now();
  const entries = Object.entries(log).sort((a, b) => b[1] - a[1]).slice(0, 400);
  set('newsRead', Object.fromEntries(entries));
}

export const isRead = id => !!get('newsRead', {})[id];

// ---------- time / date ----------
export function timeAgo(ts) {
  if (!ts) return '';
  const sec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (sec < 90) return t('Just now');
  const m = Math.floor(sec / 60);
  if (m < 60) return t('{0} min ago', m);
  const h = Math.floor(m / 60);
  if (h < 24) return t('{0} hr ago', h);
  const d = Math.floor(h / 24);
  if (d === 1) return t('Yesterday');
  if (d < 7) return t('{0} days ago', d);
  try {
    return new Intl.DateTimeFormat(getLang() === 'ne' ? 'ne-NP' : 'en', { day: 'numeric', month: 'short' }).format(ts);
  } catch { return ''; }
}

export function fullDate(ts) {
  if (!ts) return '';
  try {
    return new Intl.DateTimeFormat(getLang() === 'ne' ? 'ne-NP' : 'en', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(ts);
  } catch { return ''; }
}

// ---------- in-app reader article extraction ----------
export async function extractArticle(url) {
  // path 1 — clean text via the Jina reader, parsed into blocks
  try {
    const md = await tryFetch(`https://r.jina.ai/${url}`, 14000);
    const blocks = mdToBlocks(md);
    if (blocks.filter(b => b.type !== 'img').length >= 4) return { blocks };
  } catch { /* next */ }
  // path 2 — raw HTML through allorigins, extract the story body ourselves
  try {
    const html = await tryFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, 11000);
    const blocks = htmlToBlocks(new DOMParser().parseFromString(html, 'text/html'), url);
    if (blocks.length >= 4) return { blocks };
  } catch { /* next */ }
  // path 3 — codetabs mirror
  try {
    const html = await tryFetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, 11000);
    const blocks = htmlToBlocks(new DOMParser().parseFromString(html, 'text/html'), url);
    if (blocks.length >= 4) return { blocks };
  } catch { /* give up */ }
  return null;
}

function mdToBlocks(md) {
  const out = [];
  let pastMeta = false;
  for (const raw of String(md).split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const isMeta = /^(Title|URL Source|Published Time|Markdown Content|Lang|Warning)/.test(line) && line.length < 300;
    if (isMeta) { pastMeta = true; continue; }
    if (!pastMeta) pastMeta = true;
    else {
      const imgM = line.match(/^!\[[^\]]*\]\(([^)\s]+)/);
      if (imgM) {
        if (!isBadImg(imgM[1])) out.push({ type: 'img', src: imgM[1].replace(/&amp;/g, '&') });
        continue;
      }
      if (/^#{1,4} /.test(line)) { out.push({ type: 'h', text: tidy(line.replace(/^#+ /, '')) }); continue; }
      if (/^[-*]\s/.test(line)) { out.push({ type: 'p', text: tidy(line.replace(/^[-*]\s/, '• ')) }); continue; }
      if (/^\|.*\|$/.test(line)) continue; // tables
    }
    const text = tidy(line);
    if (text.split(/\s+/).length >= 5) out.push({ type: 'p', text });
  }
  return out.slice(0, 220);
}

const tidy = s => String(s)
  .replace(/\[([^\]]*)\]\(([^)]+)\)/g, '$1')
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/[*_`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

function htmlToBlocks(doc, baseUrl) {
  doc.querySelectorAll('script,style,noscript,iframe,svg,form,nav,header,footer,button,label,link,rel').forEach(n => n.remove());
  const selectors = ['article', '[itemprop="articleBody"]', '.entry-content', '.post-content', '.article-content', '.article--body', '#article-body', '.story-content', '.main-content', 'main'];
  let host = null;
  for (const s of selectors) {
    const n = doc.querySelector(s);
    if (n && n.querySelectorAll('p').length >= 3) { host = n; break; }
  }
  if (!host) {
    let best = null, bestLen = 0;
    doc.querySelectorAll('div, section, article, main, body').forEach(d => {
      const len = [...d.querySelectorAll('p')].reduce((a, p) => a + (p.textContent || '').length, 0);
      if (len > bestLen) { bestLen = len; best = d; }
    });
    host = best;
  }
  if (!host) return [];
  const blocks = [];
  host.querySelectorAll('img, p, h2, h3').forEach(n => {
    if (n.tagName === 'IMG') {
      const src = n.getAttribute('src') || n.getAttribute('data-src') || '';
      if (isBadImg(src)) return;
      try { const abs = new URL(src.replace(/&amp;/g, '&'), baseUrl); if (abs.protocol.startsWith('http')) blocks.push({ type: 'img', src: abs.href }); } catch { /* skip */ }
    } else if (n.tagName.startsWith('H')) {
      const txt = (n.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) blocks.push({ type: 'h', text: txt });
    } else {
      const txt = (n.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt.split(/\s+/).length >= 6) blocks.push({ type: 'p', text: txt });
    }
  });
  const out = [];
  let last = '';
  for (const b of blocks) {
    if (b.type === 'p' && b.text === last) continue;
    out.push(b);
    if (b.type === 'p') last = b.text;
  }
  return out.slice(0, 240);
}
