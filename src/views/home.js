// Home — greeting, streak, quote of the day, daily challenge, quick programs, water.
import { el, icon, toast } from '../ui/dom.js';
import { createFigure } from '../ui/figure.js';
import { getSettings, getStreak, getXP, levelInfo, todayLog, getWater, setWater, getChallengeState, completeChallenge, getStats } from '../modules/storage.js';
import { getDailyQuote } from '../modules/quotes.js';
import { PROGRAMS, CHALLENGES } from '../data/content.js';
import { dayKey } from '../modules/storage.js';
import { playWorkout } from '../modules/player.js';
import { byId } from '../data/exercises.js';

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
          <h1>${greet},<br>${name} 👋</h1>
          <p>${streak > 0 ? `🔥 ${streak}-day streak — keep the fire alive!` : 'Your body is ready. Let\u2019s begin today.'}</p>
        </div>
        <div id="home-fig" style="width:92px;height:92px;flex:none"></div>
      </div>
      <div class="mt-14">
        <div class="row between small muted"><span>Level: <b style="color:var(--text)">${lvl.name}</b></span><span>${lvl.xp} XP</span></div>
        <div class="bar mt-8"><i style="width:${lvl.pct}%"></i></div>
      </div>
    </div>

    <div class="grid-3 mt-14">
      <div class="stat"><div class="v">${stats.workouts}</div><div class="l">Workouts</div></div>
      <div class="stat"><div class="v">${log.min ? Math.round(log.min) : 0}</div><div class="l">Min today</div></div>
      <div class="stat"><div class="v">${log.cal || 0}</div><div class="l">Kcal today</div></div>
    </div>

    <div class="card quote-card mt-14" id="quote-card">
      <div class="mark">"</div>
      <div class="card-title">Quote of the day</div>
      <div id="quote-body"><div class="muted small">Loading…</div></div>
    </div>

    <div class="card tap mt-14" id="challenge-card" style="border-color:${chDone ? 'rgba(74,222,128,.4)' : 'rgba(255,154,107,.35)'}">
      <div class="row between">
        <div>
          <div class="card-title">Today's challenge ${chDone ? '· done ✅' : ''}</div>
          <div style="font-weight:800;font-size:15.5px">${challenge.t}</div>
          <div class="small muted mt-8">+${challenge.xp} XP when complete</div>
        </div>
        <button class="btn ${chDone ? '' : 'primary'}" id="ch-btn" ${chDone ? 'disabled' : ''}>${chDone ? 'Done' : 'Mark done'}</button>
      </div>
    </div>

    <div class="section-title">Quick start <span class="see-all" data-go="workouts">See all →</span></div>
    <div class="hscroll" id="quick"></div>

    <div class="section-title">Water tracker</div>
    <div class="card">
      <div class="row between">
        <div>
          <div style="font-weight:800">${water}/8 glasses</div>
          <div class="small muted">${water >= 8 ? 'Hydration hero! 💧' : 'Small sips, big energy.'}</div>
        </div>
        <button class="btn" id="water-add">${icon('plus')} Add</button>
      </div>
      <div class="glasses">
        ${Array.from({ length: 8 }, (_, i) => `<div class="glass ${i < water ? 'full' : ''}" data-i="${i}"></div>`).join('')}
      </div>
    </div>

    <div class="grid-2 mt-14">
      <div class="card tap" data-go="mind"><div class="e" style="font-size:26px">🧘</div><div style="font-weight:800" class="mt-8">Mind Studio</div><div class="small muted">Meditate · breathe · sleep</div></div>
      <div class="card tap" data-go="motivation"><div class="e" style="font-size:26px">💫</div><div style="font-weight:800" class="mt-8">Motivation</div><div class="small muted">Quotes & affirmations</div></div>
      <div class="card tap" data-go="dance"><div class="e" style="font-size:26px">💃</div><div style="font-weight:800" class="mt-8">Dance</div><div class="small muted">Cardio disguised as fun</div></div>
      <div class="card tap" data-go="care"><div class="e" style="font-size:26px">💞</div><div style="font-weight:800" class="mt-8">Relationships</div><div class="small muted">Daily bonding wisdom</div></div>
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
    if (completeChallenge(challenge.xp)) toast(`Challenge complete! +${challenge.xp} XP ⚡`);
    view._rerender?.();
  });

  // water
  const waterAdd = view.querySelector('#water-add');
  waterAdd.addEventListener('click', () => { setWater(getWater() + 1); view._rerender?.(); });
  view.querySelectorAll('.glass').forEach(g => g.addEventListener('click', () => {
    const i = +g.dataset.i;
    setWater(getWater() === i + 1 ? i : i + 1);
    view._rerender?.();
  }));

  view.querySelectorAll('[data-go]').forEach(n => n.addEventListener('click', () => {
    location.hash = `#/${n.dataset.go}`;
  }));
}
