// Mind Studio — meditation, breathwork, sleep sounds, SOS calm.
import { el, icon, toast } from '../ui/dom.js';
import { MEDITATIONS, SOUNDS, BREATH_PATTERNS, SOS_STEPS } from '../data/content.js';
import { playAmbient, stopAmbient, chime, beep } from '../modules/audio.js';
import { addSession, addXP, bumpStat, getSettings } from '../modules/storage.js';
import { playWorkout } from '../modules/player.js';
import { bySection } from '../data/exercises.js';

let tab = 'meditate';
let session = null; // active meditation/breath timer state

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('mind')} Mind Studio</div></div>
    <div class="chips" id="mtabs">
      ${[['meditate', '🧘 Meditate'], ['breathe', '🌬️ Breathe'], ['sleep', '🌙 Sleep Sounds'], ['sos', '🆘 SOS Calm']]
        .map(([id, l]) => `<button class="chip ${tab === id ? 'on' : ''}" data-t="${id}">${l}</button>`).join('')}
    </div>
    <div id="mtab"></div>
  `;
  view.querySelector('#mtabs').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    stopSession();
    tab = b.dataset.t;
    view.querySelectorAll('#mtabs .chip').forEach(c => c.classList.toggle('on', c === b));
    drawTab(view);
  });
  drawTab(view);
}

function drawTab(view) {
  const box = view.querySelector('#mtab');
  box.innerHTML = '';
  if (tab === 'meditate') drawMeditate(box);
  if (tab === 'breathe') drawBreathe(box);
  if (tab === 'sleep') drawSleep(box);
  if (tab === 'sos') drawSOS(box);
}

/* ---------------- Meditate ---------------- */
function drawMeditate(box) {
  box.innerHTML = `
    <div id="med-player" class="card" style="display:none">
      <div class="center">
        <div class="breath-stage"><div class="breath-circle" id="med-circle">Ready</div></div>
        <div class="big" id="med-name"></div>
        <div class="small muted" id="med-sound"></div>
        <div class="ring mt-14" style="width:150px;height:150px">
          <svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52"/>
          <circle class="prog" id="med-prog" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="326.7"/></svg>
          <div class="time"><b id="med-time"></b></div>
        </div>
        <div class="small muted mt-8" id="med-line"></div>
        <button class="btn danger wide mt-14" id="med-stop">End session</button>
      </div>
    </div>
    <div class="stack mt-14" id="med-list">
      ${MEDITATIONS.map(m => `
        <div class="card tap" data-med="${m.id}">
          <div class="row">
            <div class="e" style="font-size:30px">${m.e}</div>
            <div><div style="font-weight:800">${m.name}</div><div class="small muted">${m.mins} min · ${SOUNDS.find(s => s.id === m.sound)?.name}</div></div>
            <span class="go" style="margin-left:auto">${icon('play')}</span>
          </div>
        </div>`).join('')}
    </div>
    <div class="card mt-14" style="border-color:rgba(157,123,255,.35)">
      <div class="card-title">Gentle movement for heavy days</div>
      <div class="small muted mb-8">When depression makes everything heavy, start tiny. These take under 10 minutes.</div>
      <button class="btn wide" id="med-move">🚶 Try the Heavy Day Lifter</button>
    </div>
    <div class="small muted center mt-14">BiggerBody supports your wellbeing, but it is not medical care. If you are struggling, please reach out to someone you trust or a local professional. You matter. 💛</div>
  `;

  box.querySelector('#med-list').addEventListener('click', e => {
    const card = e.target.closest('[data-med]');
    if (card) startMeditation(MEDITATIONS.find(m => m.id === card.dataset.med));
  });
  box.querySelector('#med-move').addEventListener('click', () => {
    playWorkout('Heavy Day Lifter', bySection('mind'));
  });
  box.querySelector('#med-stop').addEventListener('click', () => stopSession());
}

function startMeditation(m) {
  stopSession();
  const player = document.querySelector('#med-player');
  const list = document.querySelector('#med-list');
  if (!player) return;
  player.style.display = 'block';
  list.style.display = 'none';
  document.querySelector('#med-name').textContent = `${m.e} ${m.name}`;
  document.querySelector('#med-sound').textContent = `Sound: ${SOUNDS.find(s => s.id === m.sound)?.name}`;
  playAmbient(m.sound, 0.5);

  const total = m.mins * 60;
  let left = total, step = 0;
  const circle = document.querySelector('#med-circle');
  const lineEl = document.querySelector('#med-line');
  const timeEl = document.querySelector('#med-time');
  const prog = document.querySelector('#med-prog');
  lineEl.textContent = m.script[0];

  let phaseT = 0;
  session = setInterval(() => {
    left--;
    timeEl.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    prog.style.strokeDashoffset = `${326.7 * (left / total)}`;
    // breathing guide: 4s in, 4s out
    phaseT = (phaseT + 1) % 8;
    if (phaseT < 4) { circle.classList.add('grow'); circle.classList.remove('shrink'); circle.textContent = 'Breathe in'; }
    else { circle.classList.add('shrink'); circle.classList.remove('grow'); circle.textContent = 'Breathe out'; }
    const stepIdx = Math.min(m.script.length - 1, Math.floor(((total - left) / total) * m.script.length));
    if (stepIdx !== step) { step = stepIdx; lineEl.textContent = m.script[step]; beep(740, .1, .08); }
    if (left <= 0) {
      chime();
      addSession('mind', m.mins, 0);
      bumpStat('meditations');
      addXP(30);
      toast('Meditation complete · +30 XP 🧘');
      stopSession();
    }
  }, 1000);
  session.left = left;
}

export function stopSession() {
  if (session) { clearInterval(session); session = null; }
  stopAmbient();
  const player = document.querySelector('#med-player');
  const list = document.querySelector('#med-list');
  if (player) player.style.display = 'none';
  if (list) list.style.display = '';
}

/* ---------------- Breathe ---------------- */
function drawBreathe(box) {
  box.innerHTML = `
    <div class="stack" id="bp-list">
      ${BREATH_PATTERNS.map(p => `
        <div class="card tap" data-bp="${p.id}">
          <div style="font-weight:800">${p.name}</div>
          <div class="small muted mt-8">${p.d}</div>
          <div class="small muted">${p.phases.map(x => x.join('s ')).join(' · ')}</div>
        </div>`).join('')}
    </div>
    <div id="bp-player" class="card mt-14" style="display:none">
      <div class="breath-stage"><div class="breath-circle" id="bp-circle">Ready</div></div>
      <div class="center big" id="bp-name"></div>
      <div class="center small muted" id="bp-count">cycles: 0</div>
      <button class="btn danger wide mt-14" id="bp-stop">Stop</button>
    </div>
  `;
  box.querySelector('#bp-list').addEventListener('click', e => {
    const card = e.target.closest('[data-bp]');
    if (!card) return;
    const p = BREATH_PATTERNS.find(x => x.id === card.dataset.bp);
    startBreath(p);
  });
  box.querySelector('#bp-stop')?.addEventListener('click', () => stopSession());
}

function startBreath(p) {
  stopSession();
  document.querySelector('#bp-list').style.display = 'none';
  const player = document.querySelector('#bp-player');
  player.style.display = 'block';
  document.querySelector('#bp-name').textContent = p.name;
  const circle = document.querySelector('#bp-circle');
  const countEl = document.querySelector('#bp-count');
  let cycles = 0, pi = 0, left = p.phases[0][1];
  const setUI = () => {
    const [label, secs] = p.phases[pi];
    circle.textContent = `${label} · ${left}`;
    circle.classList.toggle('grow', label.includes('in'));
    circle.classList.toggle('shrink', label.includes('out'));
  };
  setUI();
  session = setInterval(() => {
    left--;
    if (left <= 0) {
      pi = (pi + 1) % p.phases.length;
      if (pi === 0) { cycles++; countEl.textContent = `cycles: ${cycles}`; beep(660, .08, .08); }
      left = p.phases[pi][1];
      beep(pi === 0 ? 740 : 520, .1, .1);
    }
    setUI();
  }, 1000);
}

/* ---------------- Sleep ---------------- */
function drawSleep(box) {
  box.innerHTML = `
    <div class="stack" id="sound-list">
      ${SOUNDS.map(s => `
        <div class="sound-btn" data-sound="${s.id}">
          <div class="e">${s.e}</div>
          <div><div class="t">${s.name}</div><div class="d">${s.d}</div></div>
          <div class="eq"><i></i><i></i><i></i></div>
        </div>`).join('')}
    </div>
    <div class="card mt-14">
      <div class="card-title">Sleep timer</div>
      <div class="chips" id="sleep-timer">
        ${[15, 30, 60].map(m => `<button class="chip" data-min="${m}">${m} min</button>`).join('')}
        <button class="chip on" data-min="0">No limit</button>
      </div>
      <div class="small muted mt-8">Sound fades out gently when the timer ends.</div>
    </div>
    <div class="small muted center mt-14">Every sound is generated live on your device — infinite, free and offline. 🎧</div>
  `;
  let sleepTimeout = null;
  box.querySelector('#sound-list').addEventListener('click', e => {
    const btn = e.target.closest('[data-sound]');
    if (!btn) return;
    const id = btn.dataset.sound;
    const wasOn = btn.classList.contains('on');
    box.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('on'));
    stopAmbient();
    if (!wasOn) {
      btn.classList.add('on');
      playAmbient(id, 0.55);
    }
  });
  box.querySelector('#sleep-timer').addEventListener('click', e => {
    const b = e.target.closest('[data-min]');
    if (!b) return;
    box.querySelectorAll('#sleep-timer .chip').forEach(c => c.classList.toggle('on', c === b));
    clearTimeout(sleepTimeout);
    const min = +b.dataset.min;
    if (min > 0) {
      sleepTimeout = setTimeout(() => { stopAmbient(); toast('Sleep timer ended — sweet dreams 🌙'); }, min * 60000);
      toast(`Sound stops in ${min} minutes`);
    }
  });
}

/* ---------------- SOS ---------------- */
function drawSOS(box) {
  box.innerHTML = `
    <div class="card" style="border-color:rgba(157,123,255,.4)">
      <div style="font-weight:800;font-size:17px">🆘 Panic or anxiety right now?</div>
      <div class="small muted mt-8">You are safe. Follow the steps below slowly. Nothing else matters for the next minute.</div>
      <button class="btn primary wide mt-14" id="sos-start">Start 60-second calm</button>
    </div>
    <div class="card mt-14">
      <div class="card-title">The 5-4-3-2-1 grounding</div>
      ${SOS_STEPS.map((s, i) => `<div class="row mt-8" style="align-items:flex-start"><b style="color:var(--mind-2)">${i + 1}.</b><span class="small">${s}</span></div>`).join('')}
    </div>
    <div class="card mt-14" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">For heavy days 💛</div>
      <div class="small">Low mood lies to you. It says "stay down, stay alone." Movement — even 2 minutes — is the kindest counterargument. Try the Heavy Day Lifter above, text a friend, or step into sunlight for 5 minutes.</div>
    </div>
    <div id="sos-player" class="card mt-14" style="display:none">
      <div class="breath-stage"><div class="breath-circle" id="sos-circle">Ready</div></div>
      <div class="center big" id="sos-step"></div>
      <div class="center small muted" id="sos-timer"></div>
      <button class="btn danger wide mt-14" id="sos-stop">I'm okay — stop</button>
    </div>
  `;
  box.querySelector('#sos-start').addEventListener('click', () => {
    stopSession();
    document.querySelector('#sos-player').style.display = 'block';
    playAmbient('ocean', 0.4);
    let step = 0, left = 8;
    const stepEl = document.querySelector('#sos-step');
    const timerEl = document.querySelector('#sos-timer');
    const circle = document.querySelector('#sos-circle');
    const show = () => {
      stepEl.textContent = SOS_STEPS[step] || 'Breathe with the circle.';
      circle.textContent = 'Breathe';
    };
    show();
    session = setInterval(() => {
      left--;
      timerEl.textContent = `${left}s`;
      circle.classList.toggle('grow', left % 8 < 4);
      circle.classList.toggle('shrink', left % 8 >= 4);
      if (left <= 0) {
        step++;
        left = 8;
        beep(600, .12, .1);
        if (step >= SOS_STEPS.length) {
          chime();
          toast('Well done. You handled that. 💛');
          stopSession();
          return;
        }
        show();
      }
    }, 1000);
  });
  box.querySelector('#sos-stop').addEventListener('click', () => stopSession());
}
