// Web Audio engine — beeps, chimes, voice cues and fully generated ambient soundscapes.
// Everything is synthesized on-device, so it works offline with zero downloads.

let ctx = null;
export function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function unlockAudio() { try { ac(); } catch { /* noop */ } }

// ---------- short sounds ----------
export function beep(freq = 880, dur = 0.12, vol = 0.22) {
  try {
    const c = ac();
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  } catch { /* noop */ }
}

export function tick() { beep(660, 0.06, 0.1); }
export function beepWork() { beep(880, 0.16, 0.25); setTimeout(() => beep(1100, 0.2, 0.25), 140); }
export function beepRest() { beep(520, 0.22, 0.2); }
export function chime() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => beep(f, 0.7, 0.16), i * 130));
}

// ---------- voice cues ----------
export function speak(text, enabled) {
  if (!enabled || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02; u.pitch = 1.05; u.volume = 0.9;
    speechSynthesis.speak(u);
  } catch { /* noop */ }
}

// ---------- ambient soundscapes ----------
let amb = null; // { nodes: [], gain }

function noiseBuffer(c, seconds = 2) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function loopNoise(c, dest, { type = 'lowpass', freq = 800, q = 0.8 } = {}) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c); src.loop = true;
  const f = c.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  src.connect(f).connect(dest);
  src.start();
  return src;
}

function lfo(c, target, rate, depth, base) {
  const o = c.createOscillator(), g = c.createGain();
  o.frequency.value = rate; g.gain.value = depth;
  o.connect(g).connect(target);
  o.start();
  if (base !== undefined) target.value = base;
  return o;
}

function tone(c, dest, freq, { vol = 0.12, tremolo = 0 } = {}) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g).connect(dest);
  o.start();
  if (tremolo) lfo(c, g.gain, tremolo, vol * 0.5, vol);
  return [o, g];
}

export function playAmbient(id, volume = 0.6) {
  stopAmbient(0.4);
  const c = ac();
  const master = c.createGain();
  master.gain.value = 0;
  master.gain.linearRampToValueAtTime(volume, c.currentTime + 1.2);
  master.connect(c.destination);
  const nodes = [];

  if (id === 'rain') {
    nodes.push(loopNoise(c, master, { type: 'lowpass', freq: 1400 }));
    nodes.push(loopNoise(c, master, { type: 'bandpass', freq: 4500, q: 0.4 }));
  } else if (id === 'ocean') {
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700;
    f.connect(master);
    nodes.push(loopNoise(c, f, { type: 'lowpass', freq: 900 }));
    const g = c.createGain(); g.gain.value = 0.9; g.connect(f.frequency);
    lfo(c, g.gain, 0.08, 420, 0); // slow wave swell
  } else if (id === 'bowl') {
    [196, 392, 587.3, 784].forEach((f, i) => nodes.push(tone(c, master, f, { vol: 0.1 / (i + 1), tremolo: 0.15 + i * 0.05 })));
  } else if (id === 'om') {
    nodes.push(tone(c, master, 136.1, { vol: 0.16, tremolo: 0.1 }));
    nodes.push(tone(c, master, 272.2, { vol: 0.07, tremolo: 0.13 }));
    nodes.push(tone(c, master, 408.3, { vol: 0.035 }));
  } else if (id === 'night') {
    nodes.push(loopNoise(c, master, { type: 'lowpass', freq: 300 }));
    // cricket chirps: fast tremolo on high tone
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = 4200; g.gain.value = 0;
    const tg = c.createGain(); tg.gain.value = 0.012;
    lfo(c, tg.gain, 6, 0.012, 0);
    lfo(c, tg.gain, 0.5, 0.008, 0);
    o.connect(tg).connect(master); o.start();
    nodes.push(o, tg);
  }

  amb = { nodes, master };
  return () => stopAmbient();
}

export function stopAmbient(fade = 0.8) {
  if (!amb) return;
  const { master, nodes } = amb;
  amb = null;
  try {
    const c = ac();
    master.gain.setValueAtTime(master.gain.value, c.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, c.currentTime + fade);
    setTimeout(() => { nodes.forEach(n => { try { n.stop?.(); } catch { } }); try { master.disconnect(); } catch { } }, fade * 1000 + 100);
  } catch { /* noop */ }
}

// ---------- dance beat engine ----------
let beat = null;

export function playBeat(tempo = 110, style = 'house') {
  stopBeat();
  const c = ac();
  const master = c.createGain();
  master.gain.value = 0.5; master.connect(c.destination);
  const step = 60 / tempo / 2; // 8th notes
  let i = 0;
  const scales = {
    house: [0, 3, 7, 10], lofi: [0, 3, 5, 10], afro: [0, 2, 4, 7, 9],
  };
  const scale = scales[style] || scales.house;
  const root = style === 'lofi' ? 110 : 146.8;

  const timer = setInterval(() => {
    const t = c.currentTime + 0.05;
    const s = i % 8;
    // kick on 0 and 4
    if (s === 0 || s === 4) {
      const o = c.createOscillator(), g = c.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(48, t + 0.12);
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.25);
    }
    // hat on odd steps
    if (s % 2 === 1) {
      const src = c.createBufferSource(); src.buffer = noiseBuffer(c, 0.05);
      const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
      const g = c.createGain();
      g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + 0.06);
    }
    // bass / arp
    if (s === 0 || s === 3 || s === 6) {
      const semi = scale[(i / 2 | 0) % scale.length];
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = root * Math.pow(2, semi / 12);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + step * 1.8);
      o.connect(g).connect(master); o.start(t); o.stop(t + step * 2);
    }
    i++;
  }, step * 1000);

  beat = { timer, master };
}

export function stopBeat() {
  if (!beat) return;
  clearInterval(beat.timer);
  try { beat.master.gain.linearRampToValueAtTime(0.0001, ac().currentTime + 0.15); } catch { }
  const b = beat; beat = null;
  setTimeout(() => { try { b.master.disconnect(); } catch { } }, 400);
}

export function isBeatPlaying() { return !!beat; }
