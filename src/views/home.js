// Home — greeting, streak, quote of the day, daily challenge, quick programs, water.
import { el, icon, toast, esc } from '../ui/dom.js';
import { createFigure } from '../ui/figure.js';
import { getSettings, getStreak, getXP, levelInfo, todayLog, getWater, setWater, getChallengeState, completeChallenge, getStats } from '../modules/storage.js';
import { getDailyQuote } from '../modules/quotes.js';
import { PROGRAMS, CHALLENGES } from '../data/content.js';
import { dayKey } from '../modules/storage.js';
import { playWorkout } from '../modules/player.js';
import { byId } from '../data/exercises.js';
import { todaysFlags } from '../data/fests.js';
import { t } from '../i18n.js';

export function render(view) {
  const settings = getSettings();
  const h = new Date().getHours();
  const greet = h < 5 ? 'Still up' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = settings.name || 'Champion';
  const streak = getStreak();
  const lvl = levelInfo();
  const log = todayLog();
  const stats = getStats();
  const challenge = CHALLENGES[Math.abs([...dayKey()].reduce((a, c) => a + c.charCodeAt(0), 0)) % CHALLENGES.length];
  const chDone = getChallengeState()[dayKey()]?.done;
  const water = getWater();

  const featured = ['m-full', 'f-slim', 'd-latin', 'x-calm-morning'].map(id => PROGRAMS.find(p => p.id === id));

  view.innerHTML = `
    <div class="hero">
      <div class="halo"></div>
      <div class="row between">
        <div>
          <h1>${t(greet)},<br>${name} 👋</h1>
          <p>${streak > 0 ? t('{0}-day streak — keep the fire alive!', streak) : t('Your body is ready. Let\u2019s begin today.')}</p>
        </div>
        <div id="home-fig" style="width:92px;height:92px;flex:none"></div>
      </div>
      <div class="mt-14">
        <div class="row between small muted"><span>${t('Level:')} <b style="color:var(--text)">${lvl.name}</b></span><span>${lvl.xp} XP</span></div>
        <div class="bar mt-8"><i style="width:${lvl.pct}%"></i></div>
      </div>
    </div>

    <div class="grid-3 mt-14">
      <div class="stat"><div class="v">${stats.workouts}</div><div class="l">${t('Workouts')}</div></div>
      <div class="stat"><div class="v">${log.min ? Math.round(log.min) : 0}</div><div class="l">${t('Min today')}</div></div>
      <div class="stat"><div class="v">${log.cal || 0}</div><div class="l">${t('Kcal today')}</div></div>
    </div>

    ${todaysFlags().length ? `
    <div class="card tap mt-14" data-go="fasting" style="border-color:rgba(255,154,107,.4)">
      <div class="row">
        <div style="font-size:26px;flex:none">🙏</div>
        <div>
          <div class="card-title">${t('Today in Nepal')}</div>
          <div style="font-weight:800">${todaysFlags().map(f => `${f.emoji} ${esc(f.title)}`).join(' · ')}</div>
          <div class="small muted mt-8">${t('Tap for fasting-safe training & festival tips')}</div>
        </div>
      </div>
    </div>` : ''}

    <div class="card quote-card mt-14" id="quote-card">
      <div class="mark">"</div>
      <div class="card-title">${t('Quote of the day')}</div>
      <div id="quote-body"><div class="muted small">Loading…</div></div>
    </div>

    <div class="card tap mt-14" id="challenge-card" style="border-color:${chDone ? 'rgba(74,222,128,.4)' : 'rgba(255,154,107,.35)'}">
      <div class="row between">
        <div>
          <div class="card-title">${t("Today's challenge")}${chDone ? t('· done ✅') : ''}</div>
          <div style="font-weight:800;font-size:15.5px">${challenge.t}</div>
          <div class="small muted mt-8">${t('+{0} XP when complete', challenge.xp)}</div>
        </div>
        <button class="btn ${chDone ? '' : 'primary'}" id="ch-btn" ${chDone ? 'disabled' : ''}>${chDone ? t('Done') : t('Mark done')}</button>
      </div>
    </div>

    <div class="section-title">${t('Quick start')} <span class="see-all" data-go="workouts">${t('See all →')}</span></div>
    <div class="hscroll" id="quick"></div>

    <div class="section-title">${t('Water tracker')}</div>
    <div class="card">
      <div class="row between">
        <div>
          <div style="font-weight:800" id="water-count">${t('{0}/8 glasses', water)}</div>
          <div class="small muted" id="water-mood">${water >= 8 ? t('Hydration hero! 💧') : t('Small sips, big energy.')}</div>
        </div>
        <button class="btn" id="water-add">${icon('plus')} ${t('Add')}</button>
      </div>
      <div class="glasses">
        ${Array.from({ length: 8 }, (_, i) => `<div class="glass ${i < water ? 'full' : ''}" data-i="${i}"></div>`).join('')}
      </div>
    </div>

    <div class="grid-2 mt-14">
      <div class="card tap" data-go="mind"><div class="e" style="font-size:26px">🧘</div><div style="font-weight:800" class="mt-8">${t('Mind Studio')}</div><div class="small muted">${t('Meditate · breathe · sleep')}</div></div>
      <div class="card tap" data-go="motivation"><div class="e" style="font-size:26px">💫</div><div style="font-weight:800" class="mt-8">${t('Motivation')}</div><div class="small muted">${t('Quotes & affirmations')}</div></div>
      <div class="card tap" data-go="dance"><div class="e" style="font-size:26px">💃</div><div style="font-weight:800" class="mt-8">${t('Dance')}</div><div class="small muted">${t('Cardio disguised as fun')}</div></div>
      <div class="card tap" data-go="care"><div class="e" style="font-size:26px">💞</div><div style="font-weight:800" class="mt-8">${t('Relationships')}</div><div class="small muted">${t('Daily bonding wisdom')}</div></div>
      <div class="card tap" data-go="ghargym"><div class="e" style="font-size:26px">🏠</div><div style="font-weight:800" class="mt-8">${t('GharGym')}</div><div class="small muted">${t('Strength with bottles & sacks')}</div></div>
      <div class="card tap" data-go="fasting"><div class="e" style="font-size:26px">🙏</div><div style="font-weight:800" class="mt-8">${t('Fast & Fest')}</div><div class="small muted">${t('Fasting & festival fitness')}</div></div>
    </div>

    <div class="center small muted mt-20">Made with ❤️ by <b>Suraj Basnet</b></div>
  `;

  // hero figure
  const fig = createFigure(view.querySelector('#home-fig'), { gender: settings.gender, pose: 'dance', speed: 0.9 });
  view._figs = [fig];

  // quick programs
  const quick = view.querySelector('#quick');
  featured.forEach(p => {
    const ex = byId(p.items[0]);
    const card = el(`
      <div class="program" data-program="${p.id}">
        <span class="tag ${p.section}">${p.section === 'mind' ? 'mind' : p.section}</span>
        <div class="fig-wrap" data-fig="${p.items[0]}"></div>
        <h3>${p.name}</h3>
        <div class="meta">${p.mins} min · ${p.cat}</div>
      </div>`);
    quick.appendChild(card);
    if (ex) {
      const f = createFigure(card.querySelector('[data-fig]'), { gender: ex.section === 'female' ? 'female' : ex.section === 'male' ? 'male' : settings.gender, pose: ex.pose, speed: 0.9 });
      view._figs.push(f);
    }
    card.addEventListener('click', () => {
      import('../views/workouts.js').then(m => m.openProgram(p.id));
    });
  });

  // quote
  getDailyQuote().then(q => {
    const body = view.querySelector('#quote-body');
    if (body) body.innerHTML = `<blockquote>${q.q}</blockquote><cite>— ${q.a}${q.offline ? ' · offline library' : ''}</cite>`;
  });
  view.querySelector('#quote-card').addEventListener('click', async () => {
    const q = await getDailyQuote(true);
    const body = view.querySelector('#quote-body');
    if (body) body.innerHTML = `<blockquote>${q.q}</blockquote><cite>— ${q.a}</cite>`;
  });

  // challenge
  view.querySelector('#ch-btn').addEventListener('click', () => {
    if (completeChallenge(challenge.xp)) toast(t('Challenge complete! +{0} XP ⚡', challenge.xp));
    view._rerender?.();
  });

  // water — paint in place so fast taps can't race the async full re-render
  const waterAdd = view.querySelector('#water-add');
  const waterCount = view.querySelector('#water-count');
  const waterMood = view.querySelector('#water-mood');
  const glasses = [...view.querySelectorAll('.glass')];
  const WATER_MAX = 8;

  const paintWater = w => {
    waterCount.textContent = t('{0}/8 glasses', w);
    waterMood.textContent = w >= WATER_MAX ? t('Hydration hero! 💧') : t('Small sips, big energy.');
    glasses.forEach((g, i) => g.classList.toggle('full', i < w));
  };
  const applyWater = w => { w = Math.max(0, Math.min(WATER_MAX, w)); setWater(w); paintWater(w); };

  let lastTap = { t: 0, i: -1 };
  glasses.forEach(g => g.addEventListener('pointerdown', () => {
    const i = +g.dataset.i;
    const now = Date.now();
    // swallow accidental double-fires on the same glass (they used to flip it back to 0)
    if (now - lastTap.t < 350 && lastTap.i === i) return;
    lastTap = { t: now, i };
    applyWater(getWater() === i + 1 ? i : i + 1); // fill up to it — tap the newest full one to empty it
  }));
  waterAdd.addEventListener('click', () => applyWater(getWater() + 1));

  view.querySelectorAll('[data-go]').forEach(n => n.addEventListener('click', () => {
    location.hash = `#/${n.dataset.go}`;
  }));
}
