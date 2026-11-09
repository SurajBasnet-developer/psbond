// 📣 Announcement engine — picks live notices, paints the beautiful Home
// card and fires a one-time device notification per notice. All state is
// per-device storage; the notices themselves live in src/data/notices.js.
import { get, set } from './storage.js';
import { esc, icon } from '../ui/dom.js';
import { t } from '../i18n.js';
import { NOTICES } from '../data/notices.js';

const today = () => new Date().toISOString().slice(0, 10);
const inWindow = n => (!n.from || today() >= n.from) && (!n.to || today() <= n.to);

export const TYPES = {
  info: ['info', 'Announcement', '#4f8cff'],
  good: ['good', 'New feature', '#2dd4a7'],
  warn: ['warn', 'Important', '#fbbf24'],
  love: ['love', 'From the maker', '#ff6fa5'],
};

export function activeNotices() {
  // shipped notices — max 3 live at once so Home stays calm
  const out = NOTICES.filter(inWindow).slice(0, 3);
  const p = get('noticePreview', null); // admin device preview always shows first
  if (p) out.unshift(p);
  const gone = get('noticeDismissed', []);
  return out.filter(n => !gone.includes(n.id));
}

export function statusOf(n) {
  if (n.preview) return { cls: 'good', label: 'New feature' };
  const d = today();
  if (n.to && d >= n.to) return { cls: 'warn', label: t('Ended') };
  if (n.from && d < n.from) return { cls: 'info', label: t('Scheduled') };
  return { cls: 'good', label: t('Live') };
}

export function rangeOf(n) {
  return n.from || n.to ? `${n.from || '…'} → ${n.to || '∞'}` : t('always visible');
}

// ---- per-device state ----
export const dismiss = id => set('noticeDismissed', [...get('noticeDismissed', []), id]);
export const setPreview = n => set('noticePreview', n);
export const clearPreview = () => set('noticePreview', null);
export const previewNotice = () => get('noticePreview', null);

async function post(n, ask = false) {
  if (typeof Notification === 'undefined') return false;
  let ok = Notification.permission;
  if (ask && ok === 'default') ok = await Notification.requestPermission();
  if (ok !== 'granted') return false;
  const body = (n.body || '').slice(0, 150);
  const opts = {
    body, tag: `bb-notice-${n.id}`,
    icon: '/icons/logo-512.png', badge: '/icons/logo-512.png',
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration?.();
    if (reg) await reg.showNotification(n.title, opts);
    else await new Promise(r => { new Notification(n.title, opts); r(); });
    return true;
  } catch { return false; }
}

// Fire the device notification for a notice exactly once (silent for
// previews — the admin triggers those explicitly from the panel).
async function fireOnce(n) {
  if (n.preview) return;
  const seen = get('noticeSeen', {});
  if (seen[n.id]) return;
  seen[n.id] = Date.now();
  set('noticeSeen', seen);
  return post(n, false);
}

export async function fireTest(n) {
  const ok = await post({ ...n, id: `test-${n.id || 'draft'}` }, true);
  return ok;
}

// ---- the beautiful card ----
export function cardHTML(n) {
  const type = n.preview ? 'good' : (TYPES[n.type]?.[0] || 'info');
  const typeLabel = n.preview ? t('Preview — only on your device') : (TYPES[n.type]?.[1] || t('Announcement'));
  const badge = n.preview ? typeLabel
    : `${typeLabel}${n.from || n.to ? ' · ' + rangeOf(n) : ''}`;
  const cta = n.cta?.label ? n.cta : null;
  return `
    <div class="notice-card ${type}" data-card="${esc(n.id)}">
      <div class="row" style="align-items:center;gap:12px">
        <div class="n-emoji">${esc(n.emoji || '📣')}</div>
        <div style="min-width:0;flex:1">
          <div class="n-title">${esc(n.title)}</div>
          <div class="small" style="color:color-mix(in srgb,var(--nt) 80%,var(--muted));font-weight:700">${esc(badge)}</div>
        </div>
        <button class="icon-btn n-mini n-close" data-id="${esc(n.id)}" title="${esc(t('Close'))}" aria-label="${esc(t('Close'))}">${icon('close')}</button>
      </div>
      <div class="small n-body">${esc(n.body)}</div>
      ${cta ? `<button class="btn primary n-cta mt-10" data-go="${esc(cta.go)}">${esc(cta.label)} →</button>` : ''}
    </div>`;
}

export function mountNoticeCard(node) {
  if (!node) return;
  const list = activeNotices();
  node.classList.toggle('n-stack', !!list.length);
  node.innerHTML = list.map(cardHTML).join('');
  node.querySelectorAll('.n-close').forEach(b => b.addEventListener('click', () => {
    const card = b.closest('.notice-card');
    const id = b.dataset.id;
    const wasPreview = get('noticePreview', null)?.id === id;
    if (wasPreview) clearPreview(); else dismiss(id);
    card.classList.add('leaving');
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px) scale(.97)';
    setTimeout(() => { card.remove(); if (!node.children.length) node.classList.remove('n-stack'); }, 170);
  }));
  node.querySelectorAll('.n-cta').forEach(b => b.addEventListener('click', () => {
    const go = b.dataset.go;
    if (/^https?:/i.test(go)) window.open(go, '_blank', 'noopener');
    else location.hash = `#/${go}`;
  }));
  list.forEach(fireOnce);
}
