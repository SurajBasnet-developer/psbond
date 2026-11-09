// 📅 Top date strip — today's Nepali (Bikram Sambat) + English date, always
// visible at the top of the app on Android, iOS and desktop. Re-painted on
// language change and again right after midnight.
import { todayBs, formatBs, formatAd } from '../data/nepaliCalendar.js';
import { todaysFlags } from '../data/fests.js';
import { t } from '../i18n.js';

export function renderDateStrip(node) {
  const { ad, bs } = todayBs();
  const flags = todaysFlags();
  node.innerHTML = `
    <span class="ds-glyph">🕉️</span>
    <span class="ds-bs">${formatBs(bs)}</span>
    <span class="ds-ad">${formatAd(ad, { weekday: false })}</span>
    ${flags.length ? `<span class="ds-fest" title="${flags.map(f => f.title).join(', ')}">${flags.map(f => `${f.emoji} ${f.title}`).join(' · ')}</span>` : ''}
  `;
}

// one line — used by the daily notification too
export function dateLine() {
  const { ad, bs } = todayBs();
  const flags = todaysFlags();
  return `${formatBs(bs)} · ${formatAd(ad)}` +
    (flags.length ? ` — ${flags.map(f => f.title).join(', ')}` : '');
}

// repaint just after local midnight, or when reopened the next day
export function autoRepaint(node) {
  const paint = () => renderDateStrip(node);
  const next = () => {
    const now = new Date();
    const toMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 10) - now;
    setTimeout(() => { paint(); next(); }, Math.max(60000, toMidnight));
  };
  paint();
  next();
  document.addEventListener('bb-lang', paint);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) paint(); });
}
