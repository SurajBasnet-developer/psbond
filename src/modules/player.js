// Full-screen workout player: get-ready → work/rest intervals with animated coach,
// timer ring, positive vibes, beeps, voice cues, wake-lock and haptics.
import { createFigure } from '../ui/figure.js';
import { el, icon, toast } from '../ui/dom.js';
import { beepWork, beepRest, tick, chime, speak, unlockAudio } from './audio.js';
import { addSession, addXP, getSettings, bumpStat, getStats } from './storage.js';
import { VIBES } from '../data/content.js';

const ringHTML = `
  <div class="ring">
    <svg viewBox="0 0 120 120">
      <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffd9a3"/><stop offset=".5" stop-color="#ff9a6b"/><stop offset="1" stop-color="#ff5e7d"/>
      </linearGradient></defs>
      <circle class="track" cx="60" cy="60" r="52"/>
      <circle class="prog" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/>
    </svg>
    <div class="time"><div class="center"><b id="p-time">0:00</b><span id="p-phase">Ready</span></div></div>
  </div>`;

function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

export function playWorkout(title, exList, { kind = 'train' } = {}) {
  unlockAudio();
  const settings = getSettings();
  const items = exList.filter(Boolean);
  if (!items.length) return;

  const totalSecs = items.reduce((a, e) => a + e.secs + 15, 0) + 5;
  const totalKcal = Math.round(items.reduce((a, e) => a + (e.kcal * e.secs) / 60, 0));

  const root = el(`
  <div class="player">
    <div class="top">
      <button class="icon-btn" id="p-quit">${icon('close')}</button>
      <div class="pname">${title}</div>
      <div class="small muted" id="p-count">1/${items.length}</div>
    </div>
    <div class="dots" id="p-dots"></div>
    <div class="stage">
      <div class="fig-wrap" id="p-fig"></div>
      <div class="ex-name" id="p-name">Get Ready</div>
      <div class="next-up" id="p-next"></div>
      ${ringHTML}
      <div class="vibe" id="p-vibe">Let's go — you've got this! 💪</div>
    </div>
    <div class="controls">
      <button class="ctl" id="p-prev">${icon('prev')}</button>
      <button class="ctl main" id="p-pause">${icon('pause')}</button>
      <button class="ctl" id="p-skip">${icon('next')}</button>
    </div>
  </div>`);
  document.body.appendChild(root);

  const fig = createFigure(root.querySelector('#p-fig'), { gender: items[0].section === 'female' ? 'female' : 'male', pose: 'idle' });
  const prog = root.querySelector('.prog');
  const timeEl = root.querySelector('#p-time');
  const phaseEl = root.querySelector('#p-phase');
  const nameEl = root.querySelector('#p-name');
  const nextEl = root.querySelector('#p-next');
  const vibeEl = root.querySelector('#p-vibe');
  const dotsEl = root.querySelector('#p-dots');
  const countEl = root.querySelector('#p-count');

  dotsEl.innerHTML = items.map(() => '<i></i>').join('');
  const dots = [...dotsEl.children];

  let idx = -1;          // current exercise
  let phase = 'ready';   // ready | work | rest | done
  let left = 5, total = 5;
  let paused = false, timer = 0, wakeLock = null;
  let vibeIdx = 0;

  const CIRC = 326.7;
  const setRing = () => {
    prog.style.strokeDashoffset = `${CIRC * (1 - left / Math.max(1, total))}`;
  };
  const vibe = () => { vibeEl.textContent = VIBES[vibeIdx++ % VIBES.length]; };
  const haptic = ms => { if (settings.haptics) navigator.vibrate?.(ms); };

  async function grabWakeLock() {
    if (!settings.keepAwake) return;
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* noop */ }
  }
  const releaseWakeLock = () => { try { wakeLock?.release(); wakeLock = null; } catch { /* noop */ } };

  function setPhaseUI(label) { phaseEl.textContent = label; }

  function startReady() {
    idx = 0;
    phase = 'ready'; total = left = 5;
    fig.setPose('idle');
    nameEl.textContent = 'Get Ready';
    nextEl.textContent = `Up first: ${items[0].name}`;
    setPhaseUI('Ready');
    speak(`Get ready. First up, ${items[0].name}`, settings.voice);
    updateDots();
  }

  function startWork() {
    const ex = items[idx];
    phase = 'work'; total = left = ex.secs;
    fig.setGender(ex.section === 'female' ? 'female' : ex.section === 'mind' ? 'female' : 'male');
    fig.setPose(ex.pose, ex.pose === 'run' || ex.pose === 'jacks' ? 1 : 1);
    nameEl.textContent = ex.name;
    nextEl.textContent = idx + 1 < items.length ? `Next: ${items[idx + 1].name}` : 'Last one — finish strong!';
    setPhaseUI('Work');
    vibe();
    if (settings.sfx) beepWork();
    haptic(60);
    speak(ex.name, settings.voice);
  }

  function startRest() {
    phase = 'rest'; total = left = 15;
    fig.setPose('meditate');
    nameEl.textContent = 'Rest & Breathe';
    nextEl.textContent = idx + 1 < items.length ? `Next: ${items[idx + 1].name}` : 'Almost done!';
    setPhaseUI('Rest');
    vibe();
    if (settings.sfx) beepRest();
    haptic(30);
  }

  function finish() {
    phase = 'done';
    clearInterval(timer);
    fig.setPose('stretch');
    nameEl.textContent = 'Workout complete! 🎉';
    nextEl.textContent = `${totalKcal} kcal · ${Math.round(totalSecs / 60)} min`;
    setPhaseUI('Done');
    timeEl.textContent = '💯';
    prog.style.strokeDashoffset = 0;
    vibeEl.textContent = 'You did it. So proud of you! 💛';
    if (settings.sfx) chime();
    speak('Workout complete. Amazing work!', settings.voice);
    haptic([60, 60, 120]);

    addSession(kind, totalSecs / 60, totalKcal);
    bumpStat(kind === 'dance' ? 'dances' : 'workouts');
    bumpStat('kcal', totalKcal);
    bumpStat('min', Math.round(totalSecs / 60));
    addXP(kind === 'dance' ? 40 : 60 + Math.round(totalSecs / 60));
    releaseWakeLock();

    const stats = getStats();
    setTimeout(() => {
      toast(`+${kind === 'dance' ? 40 : 60 + Math.round(totalSecs / 60)} XP earned ⚡`, 3000);
    }, 600);
    root.querySelector('#p-pause').style.display = 'none';
    root.querySelector('#p-skip').style.display = 'none';
    root.querySelector('#p-prev').style.display = 'none';
  }

  function updateDots() {
    dots.forEach((d, i) => {
      d.className = i < idx ? 'done' : i === idx && phase !== 'done' ? 'now' : '';
    });
    countEl.textContent = `${Math.min(idx + 1, items.length)}/${items.length}`;
  }

  function next() {
    if (phase === 'ready') return startWork();
    if (phase === 'work') {
      if (idx + 1 >= items.length) return finish();
      return startRest();
    }
    if (phase === 'rest') {
      idx++;
      updateDots();
      return startWork();
    }
  }
  function prev() {
    if (phase === 'work' || phase === 'rest') {
      idx = Math.max(0, idx - (phase === 'work' ? 1 : 0));
      updateDots();
      startWork();
    }
  }

  timer = setInterval(() => {
    if (paused || phase === 'done') return;
    left--;
    if (left <= 3 && left > 0 && settings.sfx && phase !== 'ready') tick();
    if (left <= 0) next();
    timeEl.textContent = fmt(Math.max(0, left));
    setRing();
    if (phase === 'work' && left % 12 === 0 && left > 0) vibe();
  }, 1000);

  root.querySelector('#p-pause').addEventListener('click', e => {
    paused = !paused;
    e.currentTarget.innerHTML = paused ? icon('play') : icon('pause');
    if (paused) { vibeEl.textContent = 'Paused — breathe. Resume when ready ⏸️'; } else vibe();
  });
  root.querySelector('#p-skip').addEventListener('click', () => { if (phase !== 'done') next(); });
  root.querySelector('#p-prev').addEventListener('click', prev);
  root.querySelector('#p-quit').addEventListener('click', () => {
    clearInterval(timer);
    releaseWakeLock();
    fig.destroy();
    root.remove();
  });

  startReady();
  grabWakeLock();
  return { close: () => root.querySelector('#p-quit').click() };
}

// Quick single-exercise player
export function playSingle(ex) {
  playWorkout(ex.name, [{ ...ex, secs: Math.max(ex.secs, 30) }], { kind: 'train' });
}
