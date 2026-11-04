// Care — daily relationship wisdom + gratitude journal.
import { el, icon, toast } from '../ui/dom.js';
import { RELATIONSHIP } from '../data/content.js';
import { getGratitude, addGratitude, dayKey, addXP } from '../modules/storage.js';

let tab = 'love';

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('heart')} Care</div></div>
    <div class="chips" id="ctabs">
      <button class="chip ${tab === 'love' ? 'on' : ''}" data-t="love">💞 Relationship wisdom</button>
      <button class="chip ${tab === 'gratitude' ? 'on' : ''}" data-t="gratitude">🙏 Gratitude journal</button>
    </div>
    <div id="ctab"></div>
  `;
  view.querySelector('#ctabs').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    tab = b.dataset.t;
    view.querySelectorAll('#ctabs .chip').forEach(c => c.classList.toggle('on', c === b));
    drawTab(view);
  });
  drawTab(view);
}

function drawTab(view) {
  const box = view.querySelector('#ctab');
  if (tab === 'love') drawLove(box);
  else drawGratitude(box);
}

function drawLove(box) {
  const seed = Math.abs([...dayKey()].reduce((a, c) => a + c.charCodeAt(0), 0));
  const daily = RELATIONSHIP[seed % RELATIONSHIP.length];
  let idx = seed % RELATIONSHIP.length;

  box.innerHTML = `
    <div class="card quote-card" style="border-color:rgba(255,111,165,.35)">
      <div class="card-title">Today's relationship insight</div>
      <div style="font-weight:800;font-size:17px" id="ri-title">${daily.t}</div>
      <div class="small mt-8" style="line-height:1.6" id="ri-body">${daily.d}</div>
      <div class="row mt-14 between">
        <span class="tag female" style="position:static">${daily.cat}</span>
        <button class="btn" id="ri-next">${icon('refresh')} Another one</button>
      </div>
    </div>

    <div class="section-title">Browse by theme</div>
    <div class="stack" id="ri-list">
      ${RELATIONSHIP.map(r => `
        <div class="card">
          <div class="row between">
            <div style="font-weight:800;font-size:14.5px">${r.t}</div>
            <span class="tag female" style="position:static;font-size:9.5px">${r.cat}</span>
          </div>
          <div class="small muted mt-8" style="line-height:1.55">${r.d}</div>
        </div>`).join('')}
    </div>

    <div class="card mt-14" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">Daily bonding ritual</div>
      <div class="small">Pick one tonight: a 6-second hug · one genuine compliment · a 10-minute phone-free chat · say thank you for something small. Small deposits, unshakeable bond. 💞</div>
    </div>
  `;

  box.querySelector('#ri-next').addEventListener('click', () => {
    idx = (idx + 7) % RELATIONSHIP.length;
    const r = RELATIONSHIP[idx];
    box.querySelector('#ri-title').textContent = r.t;
    box.querySelector('#ri-body').textContent = r.d;
    box.querySelector('.tag').textContent = r.cat;
  });
}

function drawGratitude(box) {
  const entries = getGratitude();
  const today = entries.filter(e => e.date === dayKey());
  box.innerHTML = `
    <div class="card">
      <div class="card-title">Three good things</div>
      <div class="small muted">Write what went well today. Research says this alone lifts mood within 21 days.</div>
      <div class="field mt-14"><textarea id="grat-input" placeholder="Today I am grateful for…"></textarea></div>
      <button class="btn primary wide" id="grat-add">${icon('plus')} Save today's gratitude</button>
      ${today.length ? `<div class="small muted center mt-8">${today.length} saved today · +10 XP each</div>` : ''}
    </div>
    <div class="section-title">Your entries (${entries.length})</div>
    <div class="stack" id="grat-list">
      ${entries.length ? entries.slice(0, 30).map(e => `
        <div class="card" style="padding:14px">
          <div class="small muted">${e.date}</div>
          <div style="font-size:14px;margin-top:4px">${e.text.replace(/</g, '&lt;')}</div>
        </div>`).join('') : `<div class="empty"><div class="e">🌱</div>Nothing yet — today is a great day to start.</div>`}
    </div>
  `;
  box.querySelector('#grat-add').addEventListener('click', () => {
    const input = box.querySelector('#grat-input');
    const text = input.value.trim();
    if (!text) return toast('Write something first 💛');
    addGratitude(text);
    addXP(10);
    toast('Gratitude saved · +10 XP 🙏');
    drawTab(view.closest('#view') || view);
  });
}
