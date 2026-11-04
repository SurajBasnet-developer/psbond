// DOM helpers + inline icon set (no external icon fonts — fully offline).

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  train: '<path d="M6.5 6.5v11M17.5 6.5v11"/><rect x="2" y="9" width="3" height="6" rx="1"/><rect x="19" y="9" width="3" height="6" rx="1"/><path d="M5.5 12h13"/>',
  mind: '<path d="M12 3c-2 2.5-5 3-5 6.5 0 2 1.5 3 1.5 4.5S7 17 8.5 18.5 12 21 12 21s2-1 3.5-2.5S16.5 15.5 16.5 14 18 11.5 18 9.5C18 6 15 5.5 12 3z" fill="none"/><path d="M12 3v18"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1.4" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1.4" fill="currentColor" stroke="none"/>',
  next: '<path d="M5 4.5v15l10-7.5z" fill="currentColor" stroke="none"/><rect x="16.5" y="4" width="2.6" height="16" rx="1.3" fill="currentColor" stroke="none"/>',
  prev: '<path d="M19 4.5v15L9 12z" fill="currentColor" stroke="none"/><rect x="4.9" y="4" width="2.6" height="16" rx="1.3" fill="currentColor" stroke="none"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  heart: '<path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.7-8 11-8 11z" fill="currentColor" stroke="none"/>',
  flame: '<path d="M12 3c1 3-3 4.5-3 8a3 3 0 0 0 6 0c0-1-.5-2-.5-2 2 1 3.5 3 3.5 5.5A6 6 0 0 1 6 14.5C6 9 11 7.5 12 3z" fill="currentColor" stroke="none"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" fill="currentColor" stroke="none"/>',
  quote: '<path d="M6 15c0-4 2.5-7 6-8l.8 1.6C10.5 9.8 9.5 11 9.4 12.4c.2-.1.5-.1.8-.1a2.7 2.7 0 1 1-2.7 2.7H6zm8 0c0-4 2.5-7 6-8l.8 1.6c-2.3 1.2-3.3 2.4-3.4 3.8.2-.1.5-.1.8-.1a2.7 2.7 0 1 1-2.7 2.7H14z" fill="currentColor" stroke="none"/>',
  music: '<path d="M9 18V6l11-2v11"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="15" r="2.5"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/>',
  sun: '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
  settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8 13.5 5a7.2 7.2 0 0 1 2.6 1.1l2.6-.8 1.5 2.6-1.9 2a7.2 7.2 0 0 1 0 2.9l1.9 2-1.5 2.6-2.6-.8A7.2 7.2 0 0 1 13.5 19L12 21.2 10.5 19a7.2 7.2 0 0 1-2.6-1.1l-2.6.8-1.5-2.6 1.9-2a7.2 7.2 0 0 1 0-2.9l-1.9-2L5.3 5.3l2.6.8A7.2 7.2 0 0 1 10.5 5z" fill="none"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.4-4.4"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 2M9.5 2.5h5"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 18.5V5.5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M16 15.2c2.6.3 4.5 2 4.5 4.8"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" fill="currentColor" stroke="none"/>',
  download: '<path d="M12 3v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/><path d="M8.3 10.8l7-4M8.3 13.2l7 4"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v5h-5"/>',
  lotus: '<path d="M12 20c-2.5-1.5-4-4-4-7 0-3.5 2-6 4-8 2 2 4 4.5 4 8 0 3-1.5 5.5-4 7z"/><path d="M12 20c-4 0-7-2.5-8-6 2.5-.5 5 0 7 1.5M12 20c4 0 7-2.5 8-6-2.5-.5-5 0-7 1.5"/>',
  wind: '<path d="M3 8h9a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h6a2.5 2.5 0 1 1-2.5 2.5"/>',
};

export function icon(name, cls = '') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

// ---------- toast ----------
export function toast(msg, ms = 2400) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = el('<div class="toast-wrap"></div>'); document.body.appendChild(wrap); }
  const t = el(`<div class="toast">${msg}</div>`);
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, ms);
}

// ---------- modal ----------
export function openModal(contentHTML, { onClose } = {}) {
  const back = el(`<div class="modal-back"><div class="modal"><div class="grab"></div>${contentHTML}</div></div>`);
  const close = () => { back.remove(); onClose?.(); };
  back.addEventListener('click', e => { if (e.target === back) close(); });
  back.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
  document.body.appendChild(back);
  return { el: back, close };
}

// ---------- haptics ----------
export function haptic(ms = 25) {
  try { navigator.vibrate?.(ms); } catch { /* noop */ }
}

// ---------- misc ----------
export const fmtMin = m => m < 60 ? `${Math.round(m)}m` : `${Math.floor(m / 60)}h ${Math.round(m % 60)}m`;
export const plural = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`;

export function vibrateOn(node) {
  node.addEventListener('click', () => haptic(12));
}
