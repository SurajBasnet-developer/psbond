import { el, icon, toast, esc } from '../ui/dom.js';
import { MEDITATIONS, SOUNDS, BREATH_PATTERNS, SOS_STEPS } from '../data/content.js';
import { playAmbient, stopAmbient, chime, beep } from '../modules/audio.js';
import { addSession, addXP, bumpStat, getSettings, isMantraDone, setMantraDone, addChantSession, get, set, getCustomMantras, addCustomMantra, removeCustomMantra } from '../modules/storage.js';
import { playWorkout } from '../modules/player.js';
import { bySection } from '../data/exercises.js';
import { renderDateConverter } from '../ui/dateConverter.js';

let tab = 'meditate';
let session = null;
let malaCount = 0;
const CIRC = 2 * Math.PI * 60;

const DEFAULT_MANTRAS = [
  'ॐ गं गणपतये नमः॥',
  'ॐ ऐं सरस्वत्यै नमः॥',
  'ॐ श्रीं महालक्ष्म्यै नमः॥',
  'ॐ नमो भगवते वासुदेवाय॥',
  'ॐ कृष्णाय नमः॥',
  'ॐ नमः शिवाय॥',
  'ॐ मणिपद्मे हूँ॥',
  'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
  'ॐ दुं दुर्गायै नमः॥',
  'ॐ घृणिः सूर्याय नमः॥',
  'ॐ नमो भगवते वासुदेवाय राधाकृष्णाय नमः॥',
];

function getMalaPrefs() {
  return get('malaPrefs', { mantra: DEFAULT_MANTRAS[0], target: 108 });
}
function setMalaPrefs(p) {
  set('malaPrefs', { ...getMalaPrefs(), ...p });
}

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('mind')} Mind Studio</div></div>
    <div class="chips" id="mtabs">
      ${[['meditate', '🧘 Meditate'], ['breathe', '🌬️ Breathe'], ['sleep', '🌙 Sleep Sounds'], ['sos', '🆘 SOS Calm'], ['mantra', 'LECTURE Mantra'], ['dates', '📅 Dates']]
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
  if (tab === 'mantra') drawMantra(box);
  if (tab === 'dates') drawDateConverter(box);
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

/* ---------------- Mantra ---------------- */
function drawMantra(box) {
  const done = isMantraDone();
  const prefs = getMalaPrefs();
  const target = prefs.target || 108;
  const mantraText = prefs.mantra || DEFAULT_MANTRAS[0];
  const customMantras = getCustomMantras();
  const allMantras = [...DEFAULT_MANTRAS, ...customMantras];

  box.innerHTML = `
    <style>
      .mantra-sanskrit { font-size: 34px; line-height: 1.75; text-align: center; margin: 16px 0; font-family: serif; font-weight: 700; }
      .mala-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 7px; margin: 14px 0; }
      .mala-bead { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #cbd5e1; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: all .15s; }
      .mala-bead.on { background: #4f46e5; border-color: #4f46e5; color: #fff; }
      .mala-bead:active { transform: scale(0.9); }
      .mala-prog-wrap { position: relative; width: 150px; height: 150px; margin: 0 auto; }
      .mala-prog-svg { transform: rotate(-90deg); }
      .mala-prog-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 28px; font-weight: 900; }
      .mantra-select { width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; font-size: 14px; margin-top: 6px; }
      .target-input { width: 100px; padding: 6px 8px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700; }
    </style>
    <div class="card" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">Morning Mantra —  दर्शनम्</div>
      <div class="mantra-sanskrit">
        कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती।<br>
        करमूले तु गोविन्दः प्रभाते करदर्शनम्।।
        </div>
        <div class="mantra-sanskrit">
       समुद्रवसने देवि पर्वतस्तनमण्डले।<br>
       विष्णुपत्नि नमस्तुभ्यं पादस्पर्शं क्षमस्व मे॥
        </div>

        <div class="mantra-sanskrit">
        वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ।<br>
        निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
        </div>
      <div class="center mt-14">
        <button class="btn ${done ? 'secondary' : 'primary'} wide" id="mantra-done">${done ? 'Marked done today ✅' : 'I chanted this morning'}</button>
      </div>
      <div class="small muted center mt-8">${done ? 'May your day be blessed 🙏' : 'Traditionally chanted upon waking, looking at your palms.'}</div>
    </div>
    
    <div class="card mt-14" style="border-color:rgba(157,123,255,.35)" id="mala-card">
      <div class="row between" style="align-items:center; margin-bottom:10px">
        <div>
          <div style="font-weight:800">Japa Mala</div>
          <div class="small muted">Choose mantra & target · Tap anywhere to chant</div>
        </div>
        <div class="big" id="mala-count" style="font-size:32px;font-weight:900">${malaCount}</div>
      </div>

      <div class="row mt-8" style="gap:8px; align-items:center">
        <select class="mantra-select" id="mantra-select">
          ${allMantras.map(m => `<option value="${esc(m)}" ${m === mantraText ? 'selected' : ''}>${esc(m)}</option>`).join('')}
        </select>
        <input type="number" class="target-input" id="target-input" value="${target}" min="1" max="100000" step="1">
      </div>
      <div class="small muted mt-4">Target: <b id="target-display">${target}</b> chants</div>

      <div class="row mt-8" style="gap:8px; align-items:center">
        <input type="text" id="new-mantra" placeholder="Add custom mantra..." class="target-input" style="flex:1">
        <button class="btn primary wide" id="add-mantra">Add</button>
      </div>
      <div class="small muted mt-2">Custom mantras</div>
      <div id="custom-mantra-list" class="stack mt-4">
        ${customMantras.map(m => `
          <div class="row between" style="align-items:center">
            <span class="small">${esc(m)}</span>
            <button class="btn danger" style="padding:4px 8px;font-size:12px" data-remove="${esc(m)}">×</button>
          </div>`).join('')}
      </div>

      <div class="mala-prog-wrap mt-10">
        <svg class="mala-prog-svg" viewBox="0 0 120 120">
          <circle class="track" cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" stroke-width="8"/>
          <circle class="prog" id="mala-prog" cx="60" cy="60" r="52" fill="none" stroke="#4f46e5" stroke-width="8"
                  stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/>
        </svg>
        <div class="mala-prog-text" id="mala-prog-text">0</div>
      </div>
      <div class="mala-grid" id="mala-grid"></div>
      <div class="center mt-12">
        <button class="btn primary wide" id="mala-tap">Tap anywhere to chant</button>
        <button class="btn secondary wide mt-8" id="mala-reset">Reset Mala</button>
        <button class="btn ${malaCount >= target ? 'primary' : 'secondary'} wide mt-8" id="mala-save">${malaCount >= target ? 'Save Session' : 'Save Session'}</button>
      </div>
      <div id="mala-msg" class="center small mt-8" style="color:var(--mind-2,#7c3aed);font-weight:700">${malaCount >= target ? 'Target reached! 🕉️' : ''}</div>
    </div>
  `;

  renderMalaGrid(target);
  updateMalaUI(target);

  const malaCard = box.querySelector('#mala-card');
  if (malaCard) {
    malaCard.addEventListener('click', e => {
      if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
      incrementMala();
    });
  }

  const tapBtn = box.querySelector('#mala-tap');
  if (tapBtn) {
    tapBtn.addEventListener('click', e => {
      e.stopPropagation();
      incrementMala();
    });
  }

  const mantraSelect = box.querySelector('#mantra-select');
  if (mantraSelect) {
    mantraSelect.addEventListener('change', () => {
      setMalaPrefs({ mantra: mantraSelect.value });
      drawMantra(box);
    });
  }

  const targetInput = box.querySelector('#target-input');
  if (targetInput) {
    targetInput.addEventListener('change', () => {
      let v = parseInt(targetInput.value, 10);
      if (isNaN(v) || v < 1) v = 108;
      if (v > 100000) v = 100000;
      targetInput.value = v;
      setMalaPrefs({ target: v });
      drawMantra(box);
    });
  }

  const addMantraBtn = box.querySelector('#add-mantra');
  const newMantraInput = box.querySelector('#new-mantra');
  if (addMantraBtn && newMantraInput) {
    const addCustom = () => {
      const val = newMantraInput.value.trim();
      if (!val) return;
      addCustomMantra(val);
      newMantraInput.value = '';
      drawMantra(box);
    };
    addMantraBtn.addEventListener('click', addCustom);
    newMantraInput.addEventListener('keydown', e => { if (e.key === 'Enter') addCustom(); });
  }

  const customList = box.querySelector('#custom-mantra-list');
  if (customList) {
    customList.addEventListener('click', e => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      removeCustomMantra(btn.dataset.remove);
      drawMantra(box);
    });
  }

  const doneBtn = box.querySelector('#mantra-done');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      setMantraDone(true);
      toast('Mantra marked complete for today 🕉️');
      drawMantra(box);
    });
  }

  const resetBtn = box.querySelector('#mala-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      malaCount = 0;
      renderMalaGrid(getMalaPrefs().target || 108);
      updateMalaUI(getMalaPrefs().target || 108);
    });
  }

  const saveBtn = box.querySelector('#mala-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (malaCount === 0) { toast('Nothing to save yet'); return; }
      const prefs = getMalaPrefs();
      addChantSession(malaCount, prefs.mantra || DEFAULT_MANTRAS[0]);
      toast(`Saved ${malaCount} chants of "${prefs.mantra || DEFAULT_MANTRAS[0]}"`);
      malaCount = 0;
      renderMalaGrid(prefs.target || 108);
      updateMalaUI(prefs.target || 108);
    });
  }
}

function incrementMala() {
  const prefs = getMalaPrefs();
  const target = prefs.target || 108;
  if (malaCount >= target) return;
  malaCount++;
  beep(600, 0.05, 0.1);
  renderMalaGrid(target);
  updateMalaUI(target);
  if (malaCount >= target) {
    chime();
    toast('Target reached! 🕉️');
  }
}

function renderMalaGrid(target = 108) {
  const grid = document.querySelector('#mala-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const beadsToShow = Math.min(108, target);
  for (let i = 0; i < beadsToShow; i++) {
    const b = el(`<div class="mala-bead${i < malaCount ? ' on' : ''}" data-i="${i}"></div>`);
    grid.appendChild(b);
  }
}

function updateMalaUI(target = 108) {
  const countEl = document.querySelector('#mala-count');
  const progEl = document.querySelector('#mala-prog');
  const progText = document.querySelector('#mala-prog-text');
  const msgEl = document.querySelector('#mala-msg');
  const saveBtn = document.querySelector('#mala-save');
  if (countEl) countEl.textContent = malaCount;
  if (progEl) {
    const offset = CIRC * (1 - Math.min(malaCount, target) / target);
    progEl.style.strokeDashoffset = offset;
  }
  if (progText) progText.textContent = `${malaCount} / ${target}`;
  if (msgEl) msgEl.textContent = malaCount >= target ? 'Target reached! 🕉️' : '';
  if (saveBtn) {
    saveBtn.textContent = malaCount >= target ? 'Save Completed Session' : 'Save Session';
    saveBtn.classList.toggle('primary', malaCount >= target);
    saveBtn.classList.toggle('secondary', malaCount < target);
  }
}

/* ---------------- Date Converter ---------------- */
function drawDateConverter(box) {
  renderDateConverter(box);
}
