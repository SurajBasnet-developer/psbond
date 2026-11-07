// News — live headlines from Nepal's portals, with a premium in-app reader.
// Chips switch portals (or All / Saved), search filters stories, hero + cards
// show images, and every story reads inside a full-screen sheet.

import { el, icon, esc, toast, haptic } from '../ui/dom.js';
import { t, getLang } from '../i18n.js';
import { get, set } from '../modules/storage.js';
import {
  SOURCES, sourceById, getFeed, getSaved, toggleSave, isSaved,
  isRead, markRead, timeAgo, fullDate, extractArticle, proxiedImg,
} from '../modules/news.js';

let sel = 'all';
let query = '';
let data = { items: [], at: 0, failed: false };
let busy = false;
let shown = [];       // item ids currently rendered → lookup on tap
let viewEl = null;
let idleTimer = null; // second-pass background fetch for the remaining portals
let mode = 'sites';   // 'sites' → load the actual portals in-app | 'feed' → headlines
let siteSel = null;   // portal shown in the site browser
const EAGER_N = 6;    // first batch (the portals people open every day)

const srcLabel = s => (getLang() === 'ne' && s.nep) ? s.nep : s.name;

// segmented 🌐 Sites | 📰 Headlines switch
const modeSeg = () => `
  <div class="n-mode-seg" id="n-mode" role="group" aria-label="News mode">
    <button class="seg ${mode === 'sites' ? 'on' : ''}" data-mode="sites">🌐 ${esc(t('Sites'))}</button>
    <button class="seg ${mode === 'feed' ? 'on' : ''}" data-mode="feed">📰 ${esc(t('Headlines'))}</button>
  </div>`;

function bindModeSeg() {
  viewEl.querySelector('#n-mode')?.addEventListener('click', e => {
    const b = e.target.closest('[data-mode]');
    if (!b || b.dataset.mode === mode) return;
    set('newsMode', b.dataset.mode);
    haptic(8);
    render(viewEl);
  });
}

// synchronous paint from the on-device cache (before any network)
function cachedItems() {
  const cache = get('newsFeed', {});
  const seen = new Set();
  const items = SOURCES
    .flatMap(s => (cache[s.id]?.items || []))
    .sort((a, b) => b.ts - a.ts)
    .filter(i => {
      const k = i.title.toLowerCase().replace(/\W+/g, '').slice(0, 48);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  return { items: items.slice(0, 120), at: Math.max(0, ...SOURCES.map(s => cache[s.id]?.at || 0)), failed: !items.length };
}

export function render(view) {
  viewEl = view;
  clearTimeout(idleTimer);
  mode = get('newsMode', 'sites');
  sel = get('newsTab', 'all');
  if (sel !== 'all' && sel !== 'saved' && !sourceById(sel)) sel = 'all'; // dropped portal tab
  if (sel !== 'all' && sel !== 'saved') set('newsTab', sel);
  data = cachedItems();

  // ---------- 🌐 Sites mode — the portals themselves, in-app ----------
  if (mode === 'sites') {
    siteSel = get('newsSite', 'onlinekhabar');
    if (!sourceById(siteSel)) siteSel = 'onlinekhabar';
    view.innerHTML = `
      <div class="header">
        <div class="brand">${icon('news')} ${esc(t('News'))}</div>
        ${modeSeg()}
      </div>
      <div class="chips" id="n-s-chips">
        ${SOURCES.map(s => `
          <button class="chip ${siteSel === s.id ? 'on' : ''}" data-site="${s.id}">
            <i class="n-dot" style="background:${s.color}"></i>${esc(srcLabel(s))}
          </button>`).join('')}
      </div>
      <div class="site-frame" id="n-site"></div>
    `;
    view.querySelector('#n-mode').addEventListener('click', e => {
      const b = e.target.closest('[data-mode]');
      if (!b || b.dataset.mode === mode) return;
      set('newsMode', b.dataset.mode);
      haptic(8);
      render(view);
    });
    view.querySelector('#n-s-chips').addEventListener('click', e => {
      const c = e.target.closest('[data-site]');
      if (!c || siteSel === c.dataset.site) return;
      siteSel = c.dataset.site;
      set('newsSite', siteSel);
      haptic(8);
      view.querySelectorAll('#n-s-chips .chip').forEach(x => x.classList.toggle('on', x.dataset.site === siteSel));
      drawSite();
    });
    drawSite();
    return;
  }
  // ---------- 📰 Headlines mode — the wire list ----------
  view.innerHTML = `
    <div class="header">
      <div class="brand">${icon('news')} ${esc(t('News'))}</div>
      <div class="actions">
        ${modeSeg()}
        <button class="icon-btn" id="n-refresh" aria-label="Refresh">${icon('refresh')}</button>
      </div>
    </div>

    <div class="hero news-hero">
      <div class="halo"></div>
      <h1>${esc(t('Latest headlines'))} 📰</h1>
  <p>${esc(t("Onlinekhabar, eKantipur, Gorkhapatra, Shilapatra"))}</p>
    </div>

    <div class="field mt-14">
      <input id="n-search" type="search" placeholder="${esc(t('Search stories…'))}" autocomplete="off" value="${esc(query)}">
    </div>

    <div class="chips" id="n-chips">
      <button class="chip ${sel === 'all' ? 'on' : ''}" data-tab="all">✨ ${esc(t('All'))}</button>
      ${SOURCES.map(s => `
        <button class="chip ${sel === s.id ? 'on' : ''}" data-tab="${s.id}">
          <i class="n-dot" style="background:${s.color}"></i>${esc(srcLabel(s))}
        </button>`).join('')}
      <button class="chip ${sel === 'saved' ? 'on' : ''}" data-tab="saved">${icon('bookmark')} ${esc(t('Saved'))}</button>
    </div>

    <div class="small muted n-upd" id="n-upd"></div>
    <div class="stack mt-8" id="n-list" style="margin-top:8px"></div>
  `;

  view.querySelector('#n-search').addEventListener('input', e => { query = e.target.value; draw(); });
  bindModeSeg();
  view.querySelector('#n-refresh').addEventListener('click', () => load(true));
  view.querySelector('#n-chips').addEventListener('click', e => {
    const c = e.target.closest('[data-tab]');
    if (!c || sel === c.dataset.tab) { if (c) draw(); return; }
    sel = c.dataset.tab;
    set('newsTab', sel);
    haptic(8);
    query = '';
    const s = viewEl.querySelector('#n-search'); if (s) s.value = '';
    // switch instantly onto cached data for the new scope, then refresh in background
    if (sel === 'all' || sel === 'saved' || get('newsFeed', {})[sel]) data = cachedItems();
    draw();
    if (sel !== 'saved') load(false);
  });
  view.querySelector('#n-list').addEventListener('click', e => {
    const retry = e.target.closest('[data-retry]');
    if (retry) { load(true); return; }
    const card = e.target.closest('[data-story]');
    if (!card) return;
    const item = shown.find(x => x.id === card.dataset.story)
      || getSaved().find(x => x.id === card.dataset.story);
    if (item) openStory(item);
  });

  draw();
  if (sel !== 'saved') load(false, true);
}

// ---------- 🌐 site browser — load the portal itself inside the app ----------
function drawSite() {
  const box = viewEl.querySelector('#n-site');
  if (!box) return;
  const s = sourceById(siteSel);
  if (!s) return;
  const openNow = () => window.open(s.home, '_blank', 'noopener');
  if (!s.frame) {
    box.innerHTML = `
      <div class="card site-block">
        <div class="empty">
          <div class="e">🌐</div>
          <b>${esc(srcLabel(s))}</b><br>
          <span class="small">${esc(t('This site blocks in-app browsing, so it opens directly.'))}</span>
        </div>
        <button class="btn primary wide mt-14" id="n-open-now">${icon('open')} ${esc(t('Open in browser'))}</button>
      </div>`;
    box.querySelector('#n-open-now').addEventListener('click', openNow, { once: true });
    return;
  }
  box.innerHTML = `
    <div class="card site-frame">
      <div class="row between sf-bar">
        <span class="sf-name"><i style="background:${s.color}"></i>${esc(srcLabel(s))}</span>
        <span class="row" style="gap:6px">
          <button class="icon-btn" data-sf="reload" aria-label="Reload">${icon('refresh')}</button>
          <button class="icon-btn" data-sf="open" aria-label="Open in browser">${icon('open')}</button>
        </span>
      </div>
      <iframe class="sf-frame" title="${esc(srcLabel(s))}" src="${esc(s.home)}" referrerpolicy="no-referrer" loading="eager"></iframe>
      <div class="sf-hint small muted">${esc(t('Scroll inside the site · tap ⤢ to open it in your own browser'))}</div>
    </div>`;
  const frame = box.querySelector('.sf-frame');
  box.querySelector('[data-sf="reload"]').addEventListener('click', () => {
    haptic(8);
    frame.src = s.home;
  });
  box.querySelector('[data-sf="open"]').addEventListener('click', openNow);
}

// ---------- loading ----------
async function load(force = false, eagerOnly = false) {
  if (busy || sel === 'saved') return;
  busy = true;
  viewEl?.querySelector('#n-refresh')?.classList.add('spin');

  const srcList = sel === 'all'
    ? (eagerOnly ? SOURCES.slice(0, EAGER_N) : SOURCES)
    : [sourceById(sel)].filter(Boolean);
  // per-source collection → progressive paint as each feed lands
  const col = {};
  let doneN = 0, okN = 0;
  const merge = () => {
    const seen = new Set();
    const items = Object.values(col)
      .flatMap(r => r.items || [])
      .sort((a, b) => b.ts - a.ts)
      .filter(i => {
        const k = i.title.toLowerCase().replace(/\W+/g, '').slice(0, 48);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    data = {
      items: items.slice(0, 120),
      at: Math.max(0, ...Object.values(col).map(r => r.at || 0)),
      failed: doneN > 0 && !okN && !items.length,
    };
    draw();
  };
  // instant paint from the on-device cache, then refresh the stale ones
  const cache = get('newsFeed', {});
  srcList.forEach(s => { if (cache[s.id]) col[s.id] = cache[s.id]; });
  merge();
  updMeta();

  await pool(srcList, 2, async s => {
    const r = await getFeed(s, force).catch(() => ({ items: [], at: 0, failed: true }));
    if (sel !== 'all' && sel !== s.id) return; // user tabbed away mid-load
    doneN++;
    okN += r.items?.length ? 1 : 0;
    col[s.id] = r;
    if (r.items?.length || force || r.failed) merge();
  }).catch(() => {});

  const wasEager = sel === 'all' && eagerOnly;
  busy = false;
  viewEl?.querySelector('#n-refresh')?.classList.remove('spin');
  draw();
  if (wasEager) { // paint done → quietly pull the remaining portals
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => load(false).catch(() => {}), 9000);
  }
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

// ---------- rendering ----------
function updMeta() {
  const m = viewEl?.querySelector('#n-upd');
  if (!m) return;
  if (sel === 'saved') { m.textContent = `${getSaved().length} ${t('saved')}`; return; }
  const scope = sel === 'all'
    ? `${data.items.length} ${t('stories')} · `
    : '';
  m.textContent = busy ? `${scope}${t('Updating…')}`
    : data.at ? (Date.now() - data.at < 90000 ? `${scope}${t('Updated just now')}` : `${scope}${t('Updated {0} ago', timeAgo(data.at))}`)
    : '';
}

function imgTag(item, cls) {
  return item.img
    ? `<img class="${cls}" src="${esc(item.img)}" loading="${cls === 'nh-img' ? 'eager' : 'lazy'}" alt="" data-fallback="${esc(item.img)}" data-initial="${esc((sourceById(item.source)?.nep || 'ने')[0])}">`
    : '';
}

function sourceTag(item) {
  const s = sourceById(item.source);
  return `<span class="s-badge" style="color:${s?.color || 'inherit'};border-color:${(s?.color || '#fff')}33;background:${(s?.color || '#fff')}14">${esc(sourceLabelFor(item))}</span>`;
}
const sourceLabelFor = item => {
  const s = sourceById(item.source);
  return s ? srcLabel(s) : item.source || '';
};

function heroCard(item) {
  return `
    <div class="card tap n-hero" data-story="${esc(item.id)}">
      <div class="nh-media ${item.img ? '' : 'noimg'}">
        ${item.img ? imgTag(item, 'nh-img') : ''}
        ${sourceTag(item)}
      </div>
      <div class="nh-body">
        <h3>${esc(item.title)}</h3>
        <div class="row small muted nh-meta">
          <span>${esc(timeAgo(item.ts))}</span>
          ${isSaved(item.id) ? `<span class="svd">${icon('bookmark')}</span>` : ''}
          ${isRead(item.id) ? `<span>${esc(t('read'))}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function rowCard(item, saved = false) {
  const s = sourceById(item.source);
  return `
    <div class="card tap n-story ${isRead(item.id) ? 'visited' : ''}" data-story="${esc(item.id)}">
      <div class="ns-thumb ${item.img ? '' : 'noimg'}">
        ${item.img ? imgTag(item, 'ns-img') : `<span style="color:${s?.color || 'inherit'}">${esc(item.title[0] || '')}</span>`}
      </div>
      <div class="ns-body">
        <div class="ns-src" style="color:${s?.color || 'inherit'}">${esc(sourceLabelFor(item))}</div>
        <h4>${esc(item.title)}</h4>
        <div class="row small muted ns-meta">
          <span>${esc(timeAgo(saved ? (item.savedAt || item.ts) : item.ts))}</span>
          ${saved || isSaved(item.id) ? `<span class="svd">${icon('bookmark')}</span>` : ''}
        </div>
      </div>
    </div>`;
}

const skelRows = n => Array.from({ length: n }, () => `
  <div class="card n-story skel">
    <div class="ns-thumb"><div class="sk" style="width:100%;height:100%"></div></div>
    <div class="ns-body">
      <div class="sk" style="width:38%;height:10px"></div>
      <div class="sk" style="width:92%;height:13px;margin-top:8px"></div>
      <div class="sk" style="width:70%;height:13px;margin-top:6px"></div>
      <div class="sk" style="width:30%;height:10px;margin-top:8px"></div>
    </div>
  </div>`).join('');

function draw() {
  const list = viewEl?.querySelector('#n-list');
  if (!list) return;
  viewEl.querySelectorAll('#n-chips .chip').forEach(c => c.classList.toggle('on', c.dataset.tab === sel));
  updMeta();

  const q = query.trim().toLowerCase();
  let items = sel === 'saved' ? getSaved().slice() : (data.items || []).filter(i => sel === 'all' || i.source === sel);
  if (q) items = items.filter(i => `${i.title} ${i.desc || ''}`.toLowerCase().includes(q));
  shown = items;

  let html = '';
  if (!items.length && busy && sel !== 'saved') html = skelRows(9);
  else if (sel === 'saved' && !items.length) {
    html = `<div class="empty"><div class="e">🔖</div>${esc(t('No saved stories yet'))}<br>
      <span class="small">${esc(t('Open any story and tap Save.'))}</span></div>`;
  } else if (!items.length && data.failed && !busy) {
    html = `<div class="empty"><div class="e">📡</div>${esc(t('No stories right now'))}<br>
      <span class="small">${esc(t('Check your connection or try again.'))}</span>
      <div class="mt-14"><button class="btn" data-retry>${icon('refresh')} ${esc(t('Retry'))}</button></div></div>`;
  } else if (!items.length) {
    html = `<div class="empty"><div class="e">🔍</div>${esc(t('Nothing found'))}<br>
      <span class="small">${esc(t('Try another word or source.'))}</span></div>`;
  } else {
    const hero = sel === 'all' && !q ? items.find(i => i.img) : null;
    const rest = items.filter(i => i !== hero);
    if (hero) html += heroCard(hero);
    html += rest.map(i => rowCard(i, sel === 'saved')).join('');
  }
  list.innerHTML = html;
  bindImgFallback(list);
}

// direct load → weserv proxy rerun → pretty initial tile (beats hotlink blocks)
function bindImgFallback(root, initial = 'ने') {
  root.querySelectorAll('img[data-fallback]').forEach(img => {
    if (!img.dataset.initial) img.dataset.initial = initial;
    img.addEventListener('error', () => {
      try {
        if (!img.dataset.stage) {
          img.dataset.stage = '1';
          img.src = proxiedImg(img.dataset.fallback);
          return;
        }
        img.replaceWith(el(`<span class="n-fallback" data-initial="${esc(img.dataset.initial)}">${esc(img.dataset.initial)}</span>`));
      } catch { /* image never comes — fine */ }
    });
  });
}

// ---------- in-app reader ----------
const FONTS = [15.5, 17, 19, 21.5];

function openStory(item) {
  haptic(10);
  markRead(item.id);
  draw();
  const s = sourceById(item.source) || {};
  let fIdx = FONTS.indexOf(get('newsFont', 17));
  if (fIdx < 0) fIdx = 1;

  const back = el(`
    <div class="reader-back" role="dialog" aria-modal="true">
      <article class="reader" style="--rfs:${FONTS[fIdx]}px">
        <div class="r-top">
          <button class="icon-btn r-pop" data-r="close" aria-label="Close">${icon('close')}</button>
          <span class="r-srcname"><i style="background:${s.color || 'var(--accent-2)'}"></i>${esc(srcLabel(s))}</span>
          <button class="icon-btn r-pop r-fsz" data-r="font" aria-label="Text size">Aa</button>
        </div>
        <div class="r-scroll">
          <h1 class="r-title">${esc(item.title)}</h1>
          <div class="row small muted r-meta"><span>${esc(srcLabel(s))}</span><span class="dotsep">·</span><span>${esc(fullDate(item.ts))}</span></div>
          ${item.img ? `<figure class="r-hero r-art-top"><img src="${esc(item.img)}" alt="" data-fallback="${esc(item.img)}"></figure>` : ''}
          <div class="r-art" id="r-art">
            <div class="r-load">
              <div class="sk" style="width:100%;height:13px"></div>
              <div class="sk" style="width:94%;height:13px"></div>
              <div class="sk" style="width:88%;height:13px"></div>
              <div class="sk" style="width:52%;height:13px"></div>
            </div>
          </div>
        </div>
        <div class="r-fab">
          <button class="ff ${isSaved(item.id) ? 'on' : ''}" data-r="save">${icon('bookmark')}<span>${isSaved(item.id) ? esc(t('Saved')) : esc(t('Save'))}</span></button>
          <button class="ff" data-r="share">${icon('share')}<span>${esc(t('Share'))}</span></button>
          <button class="ff" data-r="open">${icon('open')}<span>${esc(t('Open'))}</span></button>
        </div>
      </article>
    </div>`);

  const close = () => { back.remove(); window.removeEventListener('hashchange', navClose); document.removeEventListener('keydown', onKey); draw(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const navClose = () => close();
  document.addEventListener('keydown', onKey);
  window.addEventListener('hashchange', navClose); // leaving via nav closes the reader

  const art = back.querySelector('#r-art');

  const readInApp = async () => {
    const res = await extractArticle(item.link).catch(() => null);
    if (!back.isConnected) return;
    if (!res || !res.blocks.length) {
      const paras = (item.desc || '').split('\n').map(x => x.trim()).filter(Boolean);
      art.innerHTML = `
        <div class="r-fallback">
          <div class="empty"><div class="e">🗞️</div>${esc(t('The full story is at the source for this one.'))}</div>
          ${paras.length ? `<div class="r-snippet">${paras.map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
          <button class="btn primary wide mt-14" data-r="open">${icon('open')} ${esc(t('Open full story'))}</button>
        </div>`;
    } else {
      art.innerHTML = res.blocks.map(b =>
        b.type === 'img'
          ? `<figure class="r-fig"><img src="${esc(b.src)}" loading="lazy" alt="" data-fallback="${esc(b.src)}"></figure>`
          : b.type === 'h' ? `<h3>${esc(b.text)}</h3>` : `<p>${esc(b.text)}</p>`
      ).join('');
      bindImgFallback(art, '🖼️');
    }
  };
  readInApp();

  const doOpen = () => window.open(item.link, '_blank', 'noopener');
  const doShare = async () => {
    const payload = `${item.title}\n${item.link}\n\nvia BiggerBody 📰`;
    try {
      if (navigator.share) await navigator.share({ title: item.title, text: item.title, url: item.link });
      else { await navigator.clipboard.writeText(payload); toast(t('Link copied ✨')); }
    } catch { /* cancelled */ }
  };
  const doSave = () => {
    const on = toggleSave(item);
    const b = back.querySelector('[data-r="save"]');
    b.classList.toggle('on', on);
    b.querySelector('span').textContent = on ? t('Saved') : t('Save');
    toast(on ? t('Saved for later 🔖') : t('Removed from Saved'));
    updMeta();
  };

  back.addEventListener('click', e => {
    if (e.target === back) return close();
    const b = e.target.closest('[data-r]');
    if (!b) return;
    const act = b.dataset.r;
    if (act === 'close') close();
    else if (act === 'save') doSave();
    else if (act === 'share') doShare();
    else if (act === 'open') doOpen();
    else if (act === 'font') {
      fIdx = (fIdx + 1) % FONTS.length;
      back.querySelector('.reader').style.setProperty('--rfs', `${FONTS[fIdx]}px`);
      set('newsFont', FONTS[fIdx]);
    }
  });
  document.body.appendChild(back);
  bindImgFallback(back, '🖼️');
}
