// 🛡️ Hidden admin — Announcements. This page exists ONLY at the unique
// secret link (see data/notices.js → ADMIN_ROUTE); no nav entry, no menu,
// no database, no server. Workflow: compose → 👁 preview on your device →
// 📋 copy the code snippet → paste it inside NOTICES in src/data/notices.js
// → rebuild. Every user then gets a beautiful card on Home + a one-time
// device notification.
import { esc, icon, toast } from '../ui/dom.js';
import { t } from '../i18n.js';
import { NOTICES, ADMIN_ROUTE } from '../data/notices.js';
import { TYPES, statusOf, rangeOf, previewNotice, setPreview, clearPreview, fireTest, cardHTML } from '../modules/notice.js';

const rid = () => 'n-' + new Date().toISOString().slice(0, 10) + '-' + Math.random().toString(36).slice(2, 7);

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove();
    return ok;
  }
}

function snippet(n) {
  const q = JSON.stringify;
  return [
    `  {`,
    `    id: ${q(rid())},`,
    `    emoji: ${q(n.emoji || '📣')},`,
    `    type: ${q(n.type || 'info')},`,
    `    title: ${q(n.title || '')},`,
    `    body: ${q(n.body || '')},`,
    `    from: ${n.from ? q(n.from) : "''"},`,
    `    to: ${n.to ? q(n.to) : "''"},`,
    n.ctaLabel ? `    cta: { label: ${q(n.ctaLabel)}, go: ${q(n.ctaGo || '')} },` : `    cta: null,`,
    `  },`,
  ].join('\n');
}

const draft = f => ({
  id: 'draft',
  emoji: f.querySelector('#a-emoji').value.trim(),
  type: f.querySelector('#a-type').value,
  title: f.querySelector('#a-title').value.trim(),
  body: f.querySelector('#a-body').value.trim().slice(0, 280),
  from: f.querySelector('#a-from').value || '',
  to: f.querySelector('#a-to').value || '',
  ctaLabel: f.querySelector('#a-cta-label').value.trim(),
  ctaGo: f.querySelector('#a-cta-go').value.trim(),
});
const withCta = d => d.cta && d.ctaGo ? { label: d.ctaLabel, go: d.ctaGo } : null;

export function render(view) {
  const rows = NOTICES.map(n => {
    const st = statusOf(n);
    return `
      <div class="row setting-row" style="gap:12px;padding:11px 2px">
        <div style="font-size:22px;flex:none">${esc(n.emoji)}</div>
        <div style="min-width:0;flex:1">
          <div class="t">${esc(n.title)}</div>
          <div class="d">${esc(rangeOf(n))}</div>
        </div>
        <span class="chip" style="flex:none;border:none;padding:5px 10px;background:${st.cls === 'good' ? 'rgba(74,222,128,.15)' : 'rgba(251,191,36,.15)'}">${esc(st.label)}</span>
      </div>`;
  }).join('');

  const pv = previewNotice();
  const adminLink = `${location.origin}${location.pathname}#/${ADMIN_ROUTE}`;

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('sparkle')} ${esc(t('Admin — Announcements'))}</div></div>

    <div class="card" style="border-color:rgba(120,180,255,.45)">
      <div class="card-title">🔒 ${esc(t('Admin only — no server, no database'))}</div>
      <div class="small muted mt-8">${esc(t('Nobody sees this screen: no menu entry anywhere. Notices live inside the app code (src/data/notices.js). When you update the app, every user gets your notice as a beautiful card on Home plus a one-time device notification.'))}</div>
      <div class="row mt-10" style="gap:8px">
        <span class="small muted" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">🔗 ${esc(adminLink)}</span>
        <button class="btn" id="a-link" style="flex:none">📋 ${esc(t('Copy link'))}</button>
      </div>
    </div>

    <div class="card mt-14">
      <div class="row between"><div class="card-title">📬 ${esc(t('Current notices'))}</div>
        <span class="chip">📕 ${NOTICES.length}</span></div>
      <div>${rows || `<div class="small muted">${esc(t('No notices shipped yet — compose your first one below.'))}</div>`}</div>
      ${pv ? `
      <div class="setting-row" style="border-top:1px solid var(--border)">
        <div><div class="t">👁 ${esc(pv.title)}</div><div class="d">${esc(t('Previewing on your device right now — visible on Home'))}</div></div>
        <button class="btn" id="a-clear" style="flex:none">🧹 ${esc(t('Clear preview'))}</button>
      </div>` : ''}
    </div>

    <div class="card mt-14">
      <div class="card-title">✍️ ${esc(t('Compose a notice'))}</div>
      <div class="row mt-10" style="gap:8px">
        <div class="field" style="width:88px;flex:none"><label>${esc(t('Emoji'))}</label><input id="a-emoji" value="📣" maxlength="4"></div>
        <div class="field" style="flex:1"><label>${esc(t('Type'))}</label>
          <select id="a-type">
            ${Object.values(TYPES).map(([v, l]) => `<option value="${v}" ${v === 'good' ? 'selected' : ''}>${esc(l)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field"><label>${esc(t('Title'))}</label><input id="a-title" placeholder="${esc(t('Short and exciting'))}"></div>
      <div class="field"><label>${esc(t('Body'))}</label><textarea id="a-body" maxlength="280" rows="3" placeholder="${esc(t('max 280 letters'))}"></textarea>
        <div class="small muted" id="a-body-count">0 / 280</div></div>
      <div class="row" style="gap:8px">
        <div class="field" style="flex:1"><label>${esc(t('Show from (optional)'))}</label><input id="a-from" type="date"></div>
        <div class="field" style="flex:1"><label>${esc(t('Until (optional)'))}</label><input id="a-to" type="date"></div>
      </div>
      <div class="row" style="gap:8px">
        <div class="field" style="flex:1"><label>${esc(t('Button label (optional)'))}</label><input id="a-cta-label" placeholder="${esc(t('e.g. Try it now'))}"></div>
        <div class="field" style="flex:1"><label>${esc(t('Button target'))}</label><input id="a-cta-go" value="settings" placeholder="${esc(t('route name or https:// link'))}"></div>
      </div>
      <div class="row mt-10" style="gap:8px">
        <button class="btn primary" id="a-preview-btn">👁 ${esc(t('Preview on my device'))}</button>
        <button class="btn" id="a-snippet-btn">📋 ${esc(t('Copy code'))}</button>
      </div>
      <div class="row mt-10" style="gap:8px">
        <button class="btn" id="a-test-btn">🔔 ${esc(t('Fire device notification now'))}</button>
      </div>
      <div class="small muted mt-8">${esc(t('Flow: preview here → copy the code → paste it inside NOTICES in src/data/notices.js → build. The code itself carries the news — nothing else to run. 🚀'))}</div>
    </div>

    <div class="card mt-14">
      <div class="card-title">🎬 ${esc(t('Live preview'))}</div>
      <div id="a-preview" style="margin-top:12px"></div>
    </div>

    <button class="btn wide mt-14" id="a-home">🏠 ${esc(t('Back to the app'))}</button>
    <div class="small muted center mt-8 mb-8">🛡️ BiggerBody admin tools</div>
  `;

  view.querySelector('#a-link').addEventListener('click', () => copy(adminLink).then(ok => toast(ok ? t('Admin link copied 🔗') : t('Copy failed — select the link manually'))));
  view.querySelector('#a-home').addEventListener('click', () => { location.hash = '#/home'; });

  const bodyEl = view.querySelector('#a-body');
  const count = view.querySelector('#a-body-count');
  const refreshCount = () => { count.textContent = `${bodyEl.value.length} / 280`; };
  bodyEl.addEventListener('input', refreshCount);
  refreshCount();

  const paintPrev = () => {
    const d = draft(view);
    const holder = view.querySelector('#a-preview');
    if (!d.title && !d.body) holder.innerHTML = `<div class="small muted">${esc(t('Type a title — your card renders here live.'))}</div>`;
    else holder.innerHTML = cardHTML({ ...d, preview: true, cta: withCta(d) });
  };
  view.addEventListener('input', paintPrev);
  view.addEventListener('change', paintPrev);
  paintPrev();

  view.querySelector('#a-preview-btn').addEventListener('click', () => {
    const d = draft(view);
    if (!d.title || !d.body) return toast(t('A title and body are needed first'), 2800);
    setPreview({ ...d, id: rid(), cta: withCta(d), preview: true });
    toast(t('Preview is live — opening Home 👀'));
    setTimeout(() => { location.hash = '#/home'; }, 650);
  });

  view.querySelector('#a-snippet-btn').addEventListener('click', async () => {
    const d = draft(view);
    if (!d.title || !d.body) return toast(t('A title and body are needed first'), 2800);
    const ok = await copy(snippet(d));
    toast(ok ? t('Code copied — paste it inside NOTICES in src/data/notices.js ✅') : t('Copy failed — try again'), 3400);
  });

  view.querySelector('#a-test-btn').addEventListener('click', async () => {
    const ok = await fireTest(draft(view));
    toast(ok ? t('Sent! Look at your notification shade 🔔') : t('Permission not granted ❌'), 3200);
  });

  const clr = view.querySelector('#a-clear');
  if (clr) clr.addEventListener('click', () => { clearPreview(); toast(t('Preview cleared 🧹')); render(view); });
}
