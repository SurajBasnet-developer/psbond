// Motivation — daily quote, affirmation board, shareable positivity.
import { el, icon, toast } from '../ui/dom.js';
import { getDailyQuote, randomQuote } from '../modules/quotes.js';
import { AFFIRMATIONS, VIBES } from '../data/content.js';

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('sparkle')} Motivation</div></div>

    <div class="card quote-card" id="mq-card">
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

  view.querySelector('#mq-new').addEventListener('click', async () => {
    const q = Math.random() < .5 ? randomQuote() : await getDailyQuote(true);
    currentQ = q;
    view.querySelector('#mq-body').innerHTML = `<blockquote>${q.q}</blockquote><cite>— ${q.a}</cite>`;
  });

  view.querySelector('#mq-share').addEventListener('click', async () => {
    if (!currentQ) return;
    const text = `"${currentQ.q}" — ${currentQ.a}\n\nvia BiggerBody 💪❤️`;
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
