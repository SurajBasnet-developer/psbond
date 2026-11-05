// Book summaries — the best self-help ideas, distilled into minute reads.
import { icon, esc, toast, openModal } from '../ui/dom.js';
import { BOOKS, BOOK_CATS } from '../data/books.js';
import { get, set } from '../modules/storage.js';

let category = 'All';
let query = '';

export function render(view) {
  let saved = get('savedBooks', []);
  let onlySaved = false;

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('book')} Book Summaries</div></div>
    <div class="hero" style="padding:18px">
      <h1 style="font-size:21px">Read less, learn more 📚</h1>
      <p>The top self-help books, distilled into short, practical summaries you can finish in minutes.</p>
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
        <span class="book-pill">${BOOKS.length} books</span>
        <span class="book-pill">${BOOKS.reduce((a, b) => a + b.mins, 0)} min total</span>
        <span class="book-pill">offline</span>
      </div>
    </div>

    <div class="field mt-14" style="margin-bottom:0">
      <input id="book-search" type="search" placeholder="Search books, authors or ideas…" autocomplete="off" value="${esc(query)}">
    </div>
    <div class="chips mt-8" id="book-cats">
      ${BOOK_CATS.map(c => `<button class="chip ${c === category ? 'on' : ''}" data-cat="${c}">${c}</button>`).join('')}
      <button class="chip" id="book-saved-filter">🔖 Saved (${saved.length})</button>
    </div>
    <div class="row between mt-8">
      <div class="small muted" id="book-count"></div>
      <div class="small muted">tap a book to open</div>
    </div>
    <div class="stack mt-8" id="book-list"></div>
  `;

  const list = view.querySelector('#book-list');
  const count = view.querySelector('#book-count');
  const search = view.querySelector('#book-search');

  const draw = () => {
    const savedBtn = view.querySelector('#book-saved-filter');
    if (savedBtn) savedBtn.textContent = `🔖 Saved (${saved.length})`;
    const q = query.trim().toLowerCase();
    let items = BOOKS.filter(b => {
      if (onlySaved && !saved.includes(b.id)) return false;
      if (category !== 'All' && b.cat !== category) return false;
      if (!q) return true;
      return [b.title, b.author, b.tagline, b.summary, b.cat, ...b.lessons].join(' ').toLowerCase().includes(q);
    });
    count.textContent = `${items.length} ${items.length === 1 ? 'summary' : 'summaries'}${q ? ` for “${query.trim()}”` : ''}`;
    list.innerHTML = items.length ? items.map(b => `
      <div class="book-card card tap" data-book="${b.id}">
        <div class="book-cover" style="background:${b.gradient}">
          <span>${b.emoji}</span>
          <small>${esc(b.cat)}</small>
        </div>
        <div class="book-info">
          <div class="row between" style="align-items:flex-start;gap:8px">
            <h3>${esc(b.title)}</h3>
            ${saved.includes(b.id) ? '<span class="book-saved">🔖</span>' : ''}
          </div>
          <div class="small muted">${esc(b.author)} · ${b.mins} min read</div>
          <div class="book-tagline">${esc(b.tagline)}</div>
        </div>
      </div>`).join('') : `<div class="empty"><div class="e">🔍</div>No summaries found.<br><span class="small">Try another search or category.</span></div>`;
  };

  const openBook = id => {
    const b = BOOKS.find(x => x.id === id);
    if (!b) return;
    const isSaved = saved.includes(b.id);
    const modal = openModal(`
      <div class="book-modal-head" style="background:${b.gradient}">
        <div class="book-modal-emoji">${b.emoji}</div>
        <div class="book-modal-cat">${esc(b.cat)} · ${b.mins} min read</div>
      </div>
      <h2 class="book-modal-title">${esc(b.title)}</h2>
      <div class="small muted">by ${esc(b.author)}</div>
      <div class="book-summary">${esc(b.summary)}</div>
      <div class="card-title mt-14">Key lessons</div>
      <ul class="book-lessons">
        ${b.lessons.map(l => `<li>${esc(l)}</li>`).join('')}
      </ul>
      <div class="book-quote">“${esc(b.quote)}”</div>
      <button class="btn wide mt-14 ${isSaved ? 'danger' : 'primary'}" data-save="${b.id}">
        ${isSaved ? 'Remove from saved' : '🔖 Save summary'}
      </button>
      <button class="btn wide ghost mt-8" data-close>Close</button>
    `, {
      onClose: () => draw(),
    });
    modal.el.querySelector('[data-save]')?.addEventListener('click', () => {
      if (saved.includes(b.id)) {
        saved = saved.filter(x => x !== b.id);
        toast('Removed from saved');
      } else {
        saved = [...saved, b.id];
        toast('Saved for later 🔖');
      }
      set('savedBooks', saved);
      modal.close();
      draw();
    });
  };

  search.addEventListener('input', () => { query = search.value; draw(); });
  view.querySelector('#book-cats').addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (chip) {
      category = chip.dataset.cat;
      onlySaved = false;
      view.querySelectorAll('#book-cats .chip').forEach(c => c.classList.toggle('on', c === chip));
    }
    if (e.target.closest('#book-saved-filter')) {
      onlySaved = !onlySaved;
      view.querySelectorAll('#book-cats .chip').forEach(c => c.classList.remove('on'));
      e.target.closest('#book-saved-filter').classList.toggle('on', onlySaved);
      e.target.closest('#book-saved-filter').textContent = `🔖 Saved (${saved.length})`;
    }
    draw();
  });
  list.addEventListener('click', e => {
    const card = e.target.closest('[data-book]');
    if (card) openBook(card.dataset.book);
  });

  draw();
}
