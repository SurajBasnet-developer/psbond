// Motivation — daily quote, affirmation board, shareable positivity.
import { el, esc, icon, toast } from '../ui/dom.js';
import { getDailyQuote, getBigQuote, randomQuote } from '../modules/quotes.js';
import { AFFIRMATIONS, VIBES } from '../data/content.js';

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('sparkle')} Motivation</div></div>

    <div class="quote-hero" id="hero-card">
      <div class="qh-glow"></div>
      <div class="qh-sheen"></div>
      <div class="qh-top">
        <span class="qh-chip">${icon('sparkle')} Daily spark</span>
        <span class="qh-num" id="qh-num"></span>
      </div>
      <div class="qh-mark">"</div>
      <div id="qh-body">
        <div class="qh-skeleton w85"></div>
        <div class="qh-skeleton w60"></div>
      </div>
      <div class="qh-actions">
        <button class="qh-btn" id="qh-new">${icon('refresh')} New</button>
        <button class="qh-btn" id="qh-copy">${icon('download')} Copy</button>
        <button class="qh-btn qh-btn-grad" id="qh-share">${icon('share')} Share</button>
      </div>
    </div>

    <div class="card quote-card mt-14" id="mq-card">
      <div class="mark">"</div>
      <div class="card-title">Today's fuel</div>
      <div id="mq-body"><div class="muted small">Loading…</div></div>
      <div class="row mt-14">
        <button class="btn" id="mq-new">${icon('refresh')} New quote</button>
        <button class="btn" id="mq-share">${icon('share')} Share</button>
      </div>
    </div>

    <div class="section-title">Affirmation board</div>
    <div class="card center" id="affirm-card" style="cursor:pointer">
      <div style="font-size:15px;font-weight:700;line-height:1.6" id="affirm-text">Tap for a dose of positive energy ✨</div>
      <div class="small muted mt-8">tap again · again · again</div>
    </div>

    <div class="section-title">Positive vibes</div>
    <div class="grid-2" id="vibes">
      ${VIBES.slice(0, 12).map(v => `<div class="card tap vibe-chip" style="padding:14px"><div style="font-size:13.5px;font-weight:600">${v}</div></div>`).join('')}
    </div>

    <div class="card mt-14" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">Remember</div>
      <div class="small">Motivation is a spark. Discipline is the engine. Show up on the days you don't feel like it — those are the days that count double.</div>
    </div>
  `;

  let currentQ = null;
  getDailyQuote().then(q => {
    currentQ = q;
    const b = view.querySelector('#mq-body');
    if (b) b.innerHTML = `<blockquote>${q.q}</blockquote><cite>— ${q.a}${q.offline ? ' · offline library' : ''}</cite>`;
  });

  // ---- big awesome hero card (DummyJSON quote of the day) ----
  let heroQ = null;
  const initialsOf = a => a.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  function renderHero(q) {
    heroQ = q;
    const body = view.querySelector('#qh-body');
    if (!body) return;
    body.innerHTML = `
      <blockquote>${esc(q.q)}</blockquote>
      <div class="qh-author">
        <span class="qh-avatar">${esc(initialsOf(q.a))}</span>
        <span class="qh-who">${esc(q.a)}${q.online ? '' : ' · offline library'}</span>
      </div>`;
    view.querySelector('#qh-num').textContent = q.online ? `#${q.n} / ${q.total}` : '★ daily';
    const card = view.querySelector('#hero-card');
    card.style.animation = 'none';
    requestAnimationFrame(() => { card.style.animation = 'fadeUp .5s ease'; });
  }

  getBigQuote().then(renderHero);

  const shareText = q => `"${q.q}" — ${q.a}\n\nvia BiggerBody 💪❤️`;

  view.querySelector('#qh-new').addEventListener('click', async () => {
    renderHero(await getBigQuote(true));
    if (navigator.vibrate) navigator.vibrate(10);
  });

  view.querySelector('#qh-copy').addEventListener('click', async () => {
    if (!heroQ) return;
    try { await navigator.clipboard.writeText(shareText(heroQ)); toast('Copied to clipboard ✨'); }
    catch { toast('Could not copy 😕'); }
  });

  view.querySelector('#qh-share').addEventListener('click', async () => {
    if (!heroQ) return;
    try {
      if (navigator.share) await navigator.share({ title: 'BiggerBody Motivation', text: shareText(heroQ) });
      else { await navigator.clipboard.writeText(shareText(heroQ)); toast('Copied to clipboard ✨'); }
    } catch { /* cancelled */ }
  });

  view.querySelector('#mq-new').addEventListener('click', async () => {
    const q = Math.random() < .5 ? randomQuote() : await getDailyQuote(true);
    currentQ = q;
    view.querySelector('#mq-body').innerHTML = `<blockquote>${q.q}</blockquote><cite>— ${q.a}</cite>`;
  });

  view.querySelector('#mq-share').addEventListener('click', async () => {
    if (!currentQ) return;
    const text = shareText(currentQ);
    try {
      if (navigator.share) await navigator.share({ title: 'BiggerBody Motivation', text });
      else { await navigator.clipboard.writeText(text); toast('Copied to clipboard ✨'); }
    } catch { /* cancelled */ }
  });

  let ai = Math.floor(Math.random() * AFFIRMATIONS.length);
  const aff = view.querySelector('#affirm-text');
  view.querySelector('#affirm-card').addEventListener('click', () => {
    ai = (ai + 1) % AFFIRMATIONS.length;
    aff.textContent = AFFIRMATIONS[ai];
    aff.style.animation = 'none';
    requestAnimationFrame(() => { aff.style.animation = 'fadeUp .4s ease'; });
    if (navigator.vibrate) navigator.vibrate(10);
  });

  view.querySelector('#vibes').addEventListener('click', e => {
    const chip = e.target.closest('.vibe-chip');
    if (chip) toast(chip.textContent.trim());
  });
}
