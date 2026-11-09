// Progress — analytics, streak calendar, achievements, level, water, BMI, export.
import { el, icon, toast } from '../ui/dom.js';
import { barChart, streakCalendar } from '../ui/charts.js';
import { getLog, getStats, getStreak, getXP, levelInfo, getWater, setWater, exportData, getSettings, saveSettings, dayKey, getSteps, stepStats, getStepGoal, stepsToKm } from '../modules/storage.js';
import { waterTarget } from '../modules/weather.js';
import { ACHIEVEMENTS, LEVELS } from '../data/content.js';

export function render(view) {
  const log = getLog();
  const stats = getStats();
  const streak = getStreak();
  const lvl = levelInfo();
  const water = getWater();
  const maxWater = waterTarget();
  const settings = getSettings();
  const fmtInt = n => (n || 0).toLocaleString('en');

  // last 14 days
  const days = [], labels = [], values = [];
  const stepValues = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = dayKey(d);
    days.push(log[k]?.min || 0);
    stepValues.push(getSteps(k));
    labels.push(d.getDate() === today() ? '•' : ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]);
  }
  function today() { return new Date().getDate(); }
  const weekMin = days.slice(-7).reduce((a, b) => a + b, 0);
  const weekSteps = stepValues.slice(-7).reduce((a, b) => a + b, 0);
  const st = stepStats();

  const won = new Set(checkAchievements());
  const nextLevel = LEVELS[lvl.index + 1];

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('chart')} Progress</div></div>

    <div class="grid-2">
      <div class="card center"><div class="flame">${streak > 0 ? '🔥' : '🌱'}</div><div class="big">${streak}</div><div class="small muted">day streak</div></div>
      <div class="card center"><div class="e" style="font-size:30px">⚡</div><div class="big">${lvl.xp}</div><div class="small muted">total XP · ${lvl.name}</div></div>
    </div>

    <div class="card mt-14">
      <div class="row between"><div class="card-title" style="margin:0">Level: ${lvl.name}</div><span class="small muted">${nextLevel ? `${lvl.xp}/${nextLevel.at} XP to ${nextLevel.name}` : 'Max level — legend! 👑'}</span></div>
      <div class="bar mt-8"><i style="width:${lvl.pct}%"></i></div>
    </div>

    <div class="section-title">Last 14 days (minutes)</div>
    <div class="card">${barChart(values, labels)}
      <div class="row between small muted mt-8"><span>This week: <b style="color:var(--text)">${weekMin} min</b></span><span>Total: <b style="color:var(--text)">${stats.min} min</b></span></div>
    </div>

    <div class="section-title">Steps (last 14 days)</div>
    <div class="card">${barChart(stepValues, labels)}
      <div class="row between small muted mt-8">
        <span>This week: <b style="color:var(--text)">${fmtInt(weekSteps)} steps · ~${stepsToKm(weekSteps).toFixed(1)} km</b></span>
        <span>Total: <b style="color:var(--text)">${fmtInt(st.total)}</b> · best day <b style="color:var(--text)">${fmtInt(st.best)}</b></span>
      </div>
      <div class="grid-2 mt-14">
        <div class="field"><label>Daily step goal</label><input id="step-goal" type="number" inputmode="numeric" min="1000" step="500" value="${getStepGoal()}"></div>
        <div class="field"><label>Stride length (m)</label><input id="step-stride" type="number" inputmode="decimal" min="0.3" max="1.2" step="0.05" value="${settings.stride || 0.7}"></div>
      </div>
      <button class="btn wide" id="step-save">Save step settings</button>
      <div class="small muted mt-8 center">Counted live from your phone's motion sensor — see Home.</div>
    </div>

    <div class="section-title">Consistency calendar</div>
    <div class="card">${streakCalendar(log)}
      <div class="small muted mt-8">Each gold square is a day you showed up. ${streak >= 3 ? 'That streak is beautiful. 🔥' : 'One day at a time — you are building something.'}</div>
    </div>

    <div class="grid-3 mt-14">
      <div class="stat"><div class="v">${stats.workouts}</div><div class="l">Workouts</div></div>
      <div class="stat"><div class="v">${stats.kcal}</div><div class="l">Kcal burned</div></div>
      <div class="stat"><div class="v">${stats.meditations}</div><div class="l">Meditations</div></div>
    </div>

    <div class="section-title">Achievements</div>
    <div class="badge-grid">
      ${ACHIEVEMENTS.map(a => `
        <div class="badge ${won.has(a.id) ? 'won' : ''}" title="${a.d}">
          <div class="e">${a.e}</div><div class="n">${a.n}</div>
        </div>`).join('')}
    </div>

    <div class="section-title">Hydration</div>
    <div class="card">
      <div class="row between"><div style="font-weight:800">${maxWater > 8 ? `${water}/${maxWater} glasses today · +2 hot day 🌡️` : `${water}/8 glasses today`}</div><span class="small muted">${(water * 0.25).toFixed(2)} L</span></div>
      <div class="glasses">${Array.from({ length: maxWater }, (_, i) => `<div class="glass ${i < water ? 'full' : ''}" data-i="${i}"></div>`).join('')}</div>
    </div>

    <div class="section-title">BMI calculator</div>
    <div class="card">
      <div class="grid-2">
        <div class="field"><label>Height (cm)</label><input id="bmi-h" type="number" inputmode="decimal" placeholder="170" value="${settings.bmiH || ''}"></div>
        <div class="field"><label>Weight (kg)</label><input id="bmi-w" type="number" inputmode="decimal" placeholder="65" value="${settings.bmiW || ''}"></div>
      </div>
      <button class="btn wide" id="bmi-go">Calculate BMI</button>
      <div class="center mt-14" id="bmi-out"></div>
    </div>

    <div class="mt-20 grid-2">
      <button class="btn" id="export-btn">${icon('download')} Export data</button>
      <a class="btn" href="#/settings">${icon('settings')} Settings</a>
    </div>
  `;

  // water interaction
  view.querySelectorAll('.glass').forEach(g => g.addEventListener('click', () => {
    const i = +g.dataset.i;
    setWater(getWater() === i + 1 ? i : i + 1);
    render(view);
  }));

  // BMI
  view.querySelector('#bmi-go').addEventListener('click', () => {
    const h = +view.querySelector('#bmi-h').value;
    const w = +view.querySelector('#bmi-w').value;
    if (!h || !w) return toast('Enter height and weight first');
    saveSettings({ bmiH: h, bmiW: w });
    const bmi = w / Math.pow(h / 100, 2);
    const cat = bmi < 18.5 ? ['Underweight', 'A little more fuel and strength training will help 💪', '#4f8cff']
      : bmi < 25 ? ['Healthy', 'Right in the healthy zone — keep moving! ✨', '#4ade80']
      : bmi < 30 ? ['Overweight', 'Small daily habits beat big occasional ones. You have got this. 🔥', '#fbbf24']
      : ['Higher range', 'Be kind to yourself, start small, stay consistent. Every walk counts. 💛', '#ff6fa5'];
    view.querySelector('#bmi-out').innerHTML = `
      <div class="big" style="color:${cat[2]}">${bmi.toFixed(1)}</div>
      <div style="font-weight:800">${cat[0]}</div>
      <div class="small muted mt-8">${cat[1]}</div>`;
  });

  view.querySelector('#export-btn').addEventListener('click', () => { exportData(); toast('Backup downloaded 📦'); });

  // step goal & stride
  view.querySelector('#step-save').addEventListener('click', () => {
    const goal = Math.max(1000, Math.min(50000, Math.round(+view.querySelector('#step-goal').value || 8000)));
    const stride = Math.max(0.3, Math.min(1.2, +view.querySelector('#step-stride').value || 0.7));
    saveSettings({ stepGoal: goal, stride });
    toast('Step settings saved ✅');
    render(view);
  });
}

function checkAchievements() {
  const s = getStats();
  const streak = getStreak();
  const xp = getXP();
  const grat = getGratitudeSafe();
  const won = [];
  if (s.workouts >= 1) won.push('first');
  if (streak >= 3) won.push('s3');
  if (streak >= 7) won.push('s7');
  if (streak >= 30) won.push('s30');
  if (s.workouts >= 10) won.push('w10');
  if (s.workouts >= 50) won.push('w50');
  if (s.meditations >= 5) won.push('med5');
  if (s.dances >= 3) won.push('dance3');
  if (grat >= 5) won.push('grat5');
  if (s.waterPerfect >= 7) won.push('water7');
  if (s.kcal >= 1000) won.push('kcal1k');
  if (s.min >= 120) won.push('min120');
  const steps = stepStats();
  if (steps.total >= 1000) won.push('step1k');
  if (steps.best >= 10000) won.push('step10k');
  return won;
}

function getGratitudeSafe() {
  try { return JSON.parse(localStorage.getItem('bb.gratitude') || '[]').length; } catch { return 0; }
}
