// 🕉️ Hindu Books — free scripture reader. Everything bundled & offline.
import { icon, esc, toast, openModal, haptic } from '../ui/dom.js';
import { SCRIPTURES, SCRIPTURE_CATS, DAILY_WISDOM } from '../data/scriptures.js';
import { get, set, dayKey } from '../modules/storage.js';
import { t } from '../i18n.js';

let category = 'All';
let query = '';
let savedOnly = false;

const savedIds = () => get('scripSaved', []);
const readMap = () => get('scripRead', {});
const nLines = b => b.sections.reduce((a, s) => a + s.lines.length, 0);
const nRead = (b, map) => (map[b.id] || []).length;
const nSec = b => b.sections.length;

// deterministic pick for “shloka of the day”
function dailyPick() {
  const key = dayKey();
  const h = [...key].reduce((a, c) => a + c.charCodeAt(0) * 31, 0);
  return DAILY_WISDOM[h % DAILY_WISDOM.length];
}

export function render(view) {
  const saved = savedIds();

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('lotus')} ${esc(t('Hindu Books'))}</div></div>
    <div class="hero" style="padding:18px">
      <h1 style="font-size:21px">🕉️ Read the shastras, free</h1>
      <p>${esc(t('Gita, Hanuman Chalisa, stotras, Vedas, Upanishads & purana stories — bundled inside the app, no cost, works offline, forever.'))}</p>
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
        <span class="book-pill">${SCRIPTURES.reduce((a, b) => a + nSec(b), 0)} sections</span>
        <span class="book-pill">${SCRIPTURES.reduce((a, b) => a + nLines(b), 0)} verses & readings</span>
        <span class="book-pill">offline · free</span>
      </div>
    </div>

    <div class="card tap mt-14" id="daily-shloka" style="border-color:rgba(250,200,80,.45)">
      <div class="row between">
        <div class="card-title">${esc(t('Shloka of the day'))}</div>
        <div style="font-size:22px">🪔</div>
      </div>
      ${shlokaOfDayHTML()}
      <div class="small muted mt-8">${esc(t('A new verse is picked for today — tap to open its source book.'))}</div>
    </div>

    <div class="field mt-14" style="margin-bottom:0">
      <input id="scrip-search" type="search" placeholder="${esc(t('Search mantras, chapters, ideas…'))}" autocomplete="off" value="${esc(query)}">
    </div>
    <div class="chips mt-8" id="scrip-cats">
      ${SCRIPTURE_CATS.map(c => `<button class="chip ${c === category ? 'on' : ''}" data-cat="${c}">${c === 'Mantra' ? 'Mantra' : esc(c)}</button>`).join('')}
      <button class="chip ${savedOnly ? 'on' : ''}" id="scrip-saved-filter">🔖 ${esc(t('Saved'))} (${saved.length})</button>
    </div>
    <div class="row between mt-8">
      <div class="small muted" id="scrip-count"></div>
      <div class="small muted">${esc(t('tap a book to open its reader'))}</div>
    </div>
    <div class="stack mt-8" id="scrip-list"></div>

    <div class="card mt-16" style="border-color:rgba(123,60,255,.35)">
      <div class="card-title">${esc(t('Read more, still free'))}</div>
      <div class="small muted">${esc(t('Full public-domain texts online (these open out of the app):'))}</div>
      <div class="chips mt-8" style="flex-wrap:wrap">
        <a class="chip" href="https://en.wikisource.org/wiki/Bhagavad_Gita" target="_blank" rel="noopener">Gita · Wikisource ↗</a>
        <a class="chip" href="https://www.sacred-texts.com/hin/" target="_blank" rel="noopener">sacred-texts ↗</a>
        <a class="chip" href="https://archive.org/search?query=hindu+scriptures" target="_blank" rel="noopener">archive.org ↗</a>
      </div>
    </div>
  `;

  const list = view.querySelector('#scrip-list');
  const count = view.querySelector('#scrip-count');
  const search = view.querySelector('#scrip-search');

  const draw = () => {
    const ss = savedIds(), rd = readMap();
    const savedBtn = view.querySelector('#scrip-saved-filter');
    if (savedBtn) savedBtn.innerHTML = `🔖 ${esc(t('Saved'))} (${ss.length})`;
    const q = query.trim().toLowerCase();
    let items = SCRIPTURES.filter(b => {
      if (savedOnly && !ss.includes(b.id)) return false;
      if (category !== 'All' && b.cat !== category) return false;
      if (!q) return true;
      return [b.title, b.sub, b.author, b.tagline, b.cat, ...b.sections.map(s => s.title), ...b.sections.flatMap(s => s.lines.flatMap(l => [l.sa, l.en]))]
        .join(' ').toLowerCase().includes(q);
    });
    count.textContent = `${items.length} ${items.length === 1 ? 'book' : 'books'}${q ? ` — “${query.trim()}”` : ''}`;
    list.innerHTML = items.length ? items.map(b => {
      const r = nRead(b, rd), tot = nSec(b), pct = tot ? Math.round(r * 100 / tot) : 0;
      return `
      <div class="book-card card tap" data-book="${b.id}">
        <div class="book-cover" style="background:${b.gradient}">
          <span>${b.emoji}</span>
          <small>${esc(b.cat)}</small>
        </div>
        <div class="book-info">
          <div class="row between" style="align-items:flex-start;gap:8px">
            <h3>${esc(b.title)}</h3>
            ${ss.includes(b.id) ? '<span class="book-saved">🔖</span>' : ''}
          </div>
          <div class="small muted">${esc(b.sub)} · ${tot} sections</div>
          <div class="book-tagline">${esc(b.tagline)}</div>
          ${r ? `<div class="small mt-8" style="color:var(--accent,#f9d77e)">📖 ${r}/${tot} ${esc(t('sections read'))} · ${pct}%</div>` : ''}
        </div>
      </div>`;
    }).join('') : `<div class="empty"><div class="e">🔍</div>${esc(t('Nothing found.'))}<br><span class="small">${esc(t('Try another search or category.'))}</span></div>`;

    list.querySelectorAll('[data-book]').forEach(c =>
      c.addEventListener('click', () => openReader(c.dataset.book)));
  };

  search.addEventListener('input', e => { query = e.target.value; draw(); });
  view.querySelectorAll('[data-cat]').forEach(ch => ch.addEventListener('click', () => {
    category = ch.dataset.cat;
    view.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('on', x.dataset.cat === category));
    draw();
  }));
  view.querySelector('#scrip-saved-filter').addEventListener('click', () => {
    savedOnly = !savedOnly;
    view.querySelector('#scrip-saved-filter').classList.toggle('on', savedOnly);
    draw();
  });
  view.querySelector('#daily-shloka').addEventListener('click', () =>
    openReader(dailyPick().book));

  draw();
}

function shlokaOfDayHTML() {
  const d = dailyPick();
  return `
    ${d.sa ? `<div class="scrip-sa" style="font-size:15.5px;margin-top:4px">${esc(d.sa)}</div>` : ''}
    <div class="scrip-en" style="margin-top:8px">${esc(d.en)}</div>
    <div class="small muted mt-8">${d.emoji} ${esc(SCRIPTURES.find(b => b.id === d.book)?.title || '')}</div>
  `;
}

// ---------- reader ----------
function openReader(bookId) {
  const b = SCRIPTURES.find(x => x.id === bookId);
  if (!b) return;
  haptic(14);

  const fontPct = () => get('scripFont', 100);
  const modal = openModal(`
    <div class="book-modal-head" style="background:${b.gradient}">
      <div class="book-modal-emoji">${b.emoji}</div>
      <div class="book-modal-cat">${esc(b.cat)} · ${nSec(b)} ${esc(t('sections'))} · free</div>
    </div>
    <h2 class="book-modal-title">${esc(b.title)}</h2>
    <div class="small muted">${esc(b.author)}</div>
    ${b.intro ? `<p class="small mt-8" style="line-height:1.6">${esc(b.intro)}</p>` : ''}
    <div class="row mt-14" id="scrip-tools" style="gap:8px">
      <button class="btn" id="scrip-f-minus">A−</button>
      <button class="btn" id="scrip-f-plus">A+</button>
      <button class="btn" id="scrip-save"></button>
      <button class="btn" id="scrip-share">${icon('share')} ${esc(t('Share'))}</button>
    </div>
    <div class="small muted mt-8" id="scrip-progress"></div>
    <div class="scrip-body mt-14" id="scrip-body"></div>
    <div class="small muted mt-8">🕉 ${esc(t('Traditional text · our own free rendering · public domain.'))}</div>
    <button class="btn wide mt-14" data-close>${esc(t('Close reader'))}</button>
  `);

  const body = modal.el.querySelector('#scrip-body');
  const progressEl = modal.el.querySelector('#scrip-progress');
  const paintFont = () => { body.style.fontSize = `${(get('scripFont', 100) / 100 * 16).toFixed(1)}px`; };
  const applyFont = d => {
    const next = Math.max(85, Math.min(140, get('scripFont', 100) + d));
    set('scripFont', next); paintFont();
  };
  paintFont();
  modal.el.querySelector('#scrip-f-minus').addEventListener('click', () => applyFont(-10));
  modal.el.querySelector('#scrip-f-plus').addEventListener('click', () => applyFont(10));

  const paintSave = () => {
    const ss = savedIds();
    modal.el.querySelector('#scrip-save').innerHTML =
      ss.includes(b.id) ? `🔖 ${esc(t('Saved'))}` : `🔖 ${esc(t('Save offline'))}`;
  };
  const rd = () => readMap();
  const markReadOne = (id, i) => {
    const m = rd();
    const arr = m[id] || [];
    if (!arr.includes(i)) { arr.push(i); m[id] = arr; set('scripRead', m); }
    paintProgress();
  };
  const paintProgress = () => {
    const r = nRead(b, rd()), tot = nSec(b);
    progressEl.innerHTML = `📖 ${r}/${tot} ${esc(t('sections read'))} · ${tot ? Math.round(r * 100 / tot) : 0}% ${r >= tot ? '· 🙏 ' + esc(t('fully read')) : ''}`;
  };
  paintProgress();

  modal.el.addEventListener('click', e => {
    if (e.target.closest('#scrip-share') || e.target.closest('#scrip-save') ||
        e.target.closest('#scrip-f-minus') || e.target.closest('#scrip-f-plus')) haptic(10);
  });
  modal.el.querySelector('#scrip-save').addEventListener('click', () => {
    const ss = savedIds();
    const on = !ss.includes(b.id);
    set('scripSaved', on ? [...ss, b.id] : ss.filter(x => x !== b.id));
    toast(on ? t('Saved to your shelf 🔖') : t('Removed from shelf'));
    paintSave();
  });
  modal.el.querySelector('#scrip-share').addEventListener('click', async () => {
    const first = b.sections[0]?.lines[0];
    const text = `${b.emoji} ${b.title}\n${b.tagline}\n\n${first?.sa || first?.en || ''}\n${first?.sa ? first.en + '\n\n' : ''}— shared from BiggerBody`;
    try { await navigator.share({ title: b.title, text }); }
    catch { toast(t('Copy works better in some browsers')); try { await navigator.clipboard.writeText(text); toast(t('Copied ✅')); } catch { /* noop */ } }
  });
  paintSave();

  // whole book, continuously readable
  body.innerHTML = b.sections.map((s, i) => `
    <div class="scrip-sec" data-i="${i}">
      <div class="scrip-sec-title">${esc(s.title)}</div>
      ${s.lines.map(l => `
        ${l.sa ? `<div class="scrip-sa">${esc(l.sa)}</div>` : ''}
        ${l.en ? `<div class="scrip-en">${esc(l.en)}</div>` : ''}
      `).join('')}
    </div>`).join('');

  // mark sections read progressively as they scroll through
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) markReadOne(b.id, Number(e.target.dataset.i));
    });
  }, { root: body, threshold: 0.3 });
  body.querySelectorAll('.scrip-sec').forEach(s => io.observe(s));
}
