// Animated SVG coaches — male & female figures driven by requestAnimationFrame.
// Each pose is a function of time that sets joint angles; SVG nested transforms
// make elbows/knees track their parent joints naturally.

const SKINS = ['#f7c49a', '#e8a877', '#c98a5e', '#8d5a3b', '#f4d3b8'];

let uid = 0;

function skeleton(gender, skin) {
  uid++;
  const f = gender === 'female';
  const torso = f
    ? 'M86 72 Q100 66 114 72 L116.5 90 Q114 99 112 103 Q116 111 113 120 L87 120 Q84 111 88 103 Q86 99 83.5 90 Z'
    : 'M83 72 Q100 65 117 72 L120 95 Q121 111 113 121 L87 121 Q79 111 80 95 Z';
  const hair = f
    ? `<circle cx="100" cy="43" r="6"/><path d="M89 55 Q89 44 100 44 Q111 44 111 55 Q108 48 100 48 Q92 48 89 55 Z"/>`
    : `<path d="M89 55 Q88 44 100 44 Q112 44 111 55 Q109 47 100 47 Q91 47 89 55 Z"/>`;
  const skirt = f ? `<path class="suit" d="M87 108 L113 108 L119 130 Q100 136 81 130 Z"/>` : '';
  const belt = f ? '' : `<path class="suit" d="M84 108 L116 108 L115.5 114 L84.5 114 Z"/>`;

  return `
  <svg class="fig ${gender}" viewBox="0 0 200 200" style="--skin:${skin}">
    <ellipse class="fig-shadow" cx="100" cy="193" rx="30" ry="4.5"/>
    <g class="fig-root">
      <g class="fig-whole">
        <g class="fig-breathe">
          <!-- legs (behind torso) -->
          <g transform="translate(90 122)"><g class="j-thighL">
            <path class="limb skin" stroke-width="10" d="M0 0 L-3 33"/>
            <g transform="translate(-3 33)"><g class="j-shinL">
              <path class="limb skin" stroke-width="8.5" d="M0 0 L-2 32"/>
              <ellipse class="foot" cx="-3" cy="33" rx="6.5" ry="3.2"/>
            </g></g>
          </g></g>
          <g transform="translate(110 122)"><g class="j-thighR">
            <path class="limb skin" stroke-width="10" d="M0 0 L3 33"/>
            <g transform="translate(3 33)"><g class="j-shinR">
              <path class="limb skin" stroke-width="8.5" d="M0 0 L2 32"/>
              <ellipse class="foot" cx="3" cy="33" rx="6.5" ry="3.2"/>
            </g></g>
          </g></g>
          <!-- torso + head -->
          <g class="fig-torso">
            ${skirt}${belt}
            <path class="torso" d="${torso}"/>
            <circle class="head-fill" cx="100" cy="56" r="11"/>
            <g class="hair">${hair}</g>
            <circle class="eye" cx="96.4" cy="55.5" r="1.15"/>
            <circle class="eye" cx="103.6" cy="55.5" r="1.15"/>
            <path class="smile" d="M97 59.5 Q100 62 103 59.5"/>
          </g>
          <!-- arms (in front) -->
          <g transform="translate(84 79)"><g class="j-armL">
            <path class="limb skin" stroke-width="9" d="M0 0 L-4 27"/>
            <g transform="translate(-4 27)"><g class="j-foreL">
              <path class="limb skin" stroke-width="7.5" d="M0 0 L-2 25"/>
              <circle class="hand" cx="-2" cy="26" r="3.6"/>
            </g></g>
          </g></g>
          <g transform="translate(116 79)"><g class="j-armR">
            <path class="limb skin" stroke-width="9" d="M0 0 L4 27"/>
            <g transform="translate(4 27)"><g class="j-foreR">
              <path class="limb skin" stroke-width="7.5" d="M0 0 L2 25"/>
              <circle class="hand" cx="2" cy="26" r="3.6"/>
            </g></g>
          </g></g>
        </g>
      </g>
    </g>
  </svg>`;
}

// ---------- pose library ----------
// p: {armL, armR, foreL, foreR, thighL, thighR, shinL, shinR, y, x, rot, breathe}
const base = p => ({ armL: 8, armR: -8, foreL: 0, foreR: 0, thighL: 0, thighR: 0, shinL: 0, shinR: 0, y: 0, x: 0, rot: 0, breathe: 0, ...p });
const sin = (t, w = 1) => Math.sin(t * w);
const pulse = (t, w = 1) => Math.max(0, sin(t, w));

const POSES = {
  idle(t) {
    return base({ armL: 8 + 3 * sin(t, .9), armR: -8 - 3 * sin(t, .9), breathe: .5 + .5 * sin(t, 1.4) });
  },
  curl(t) {
    const s = .5 + .5 * sin(t, 2.2);
    return base({ armL: -6, armR: 6, foreL: -12 - 150 * s, foreR: 12 + 150 * s, breathe: .5 + .5 * sin(t, 1.2) });
  },
  triceps(t) {
    const s = .5 + .5 * sin(t, 1.8);
    return base({ armL: 168, armR: -168, foreL: -18 - 118 * s, foreR: 18 + 118 * s, breathe: .5 + .5 * sin(t, 1.1) });
  },
  press(t) {
    const s = .5 + .5 * sin(t, 1.8);
    return base({ armL: 18 + 148 * s, armR: -18 - 148 * s, foreL: 26 * (1 - s), foreR: -26 * (1 - s), y: -2 * s, breathe: .5 + .5 * sin(t, 1.1) });
  },
  raise(t) {
    const s = .5 + .5 * sin(t, 1.7);
    return base({ armL: 10 + 78 * s, armR: -10 - 78 * s, breathe: .5 + .5 * sin(t, 1.2) });
  },
  pushup(t) {
    const s = .5 + .5 * sin(t, 1.9);
    return base({ rot: 72, y: 26 + 9 * s, armL: 6, armR: -6, foreL: -8 - 55 * s, foreR: 8 + 55 * s, breathe: .5 + .5 * sin(t, 1.5) });
  },
  plank(t) {
    return base({ rot: 72, y: 30, armL: 6, armR: -6, breathe: .5 + .5 * sin(t, 1.2) });
  },
  pike(t) {
    const s = .5 + .5 * sin(t, 1.6);
    return base({ rot: 52, y: 20 + 6 * s, armL: 10, armR: -10, breathe: .5 + .5 * sin(t, 1.2) });
  },
  squat(t) {
    const s = .5 + .5 * sin(t, 1.5);
    return base({ y: 15 * s, thighL: 24 * s, thighR: -24 * s, shinL: -14 * s, shinR: 14 * s, armL: 6 - 30 * s, armR: -6 + 30 * s, breathe: .5 + .5 * sin(t, 1.1) });
  },
  lunge(t) {
    const s = sin(t, 1.4);
    const a = Math.max(0, s), b = Math.max(0, -s);
    return base({ y: 12 * a + 12 * b, thighL: 40 * a - 8 * b, thighR: -8 * a + 40 * b, shinL: -18 * a + 4 * b, shinR: 4 * a - 18 * b, armL: 10 + 25 * a, armR: -10 - 25 * b, breathe: .5 + .5 * sin(t, 1.1) });
  },
  jacks(t) {
    const s = .5 + .5 * sin(t, 3.4);
    return base({ armL: 12 + 145 * s, armR: -12 - 145 * s, thighL: 24 * s, thighR: -24 * s, y: -5 * s, breathe: .5 + .5 * sin(t, 3.4) });
  },
  run(t, sp = 1) {
    const w = 2 * Math.PI * 2.6 * sp * t;
    return base({
      thighL: 55 * pulse(t, 5.2 * sp), thighR: 55 * pulse(t + Math.PI / (5.2 * sp), 5.2 * sp),
      shinL: -50 * pulse(t, 5.2 * sp), shinR: -50 * pulse(t + Math.PI / (5.2 * sp), 5.2 * sp),
      armL: 28 * sin(t, 5.2 * sp), armR: -28 * sin(t, 5.2 * sp),
      y: -3 * Math.abs(sin(t, 5.2 * sp)), breathe: .5 + .5 * sin(t, 2.2),
    });
  },
  crunch(t) {
    const s = .5 + .5 * sin(t, 1.6);
    return base({ rot: 38 * s + 4, armL: 30, armR: -30, foreL: -110, foreR: 110, breathe: .5 + .5 * sin(t, 1.2) });
  },
  climber(t) {
    const w = 5.5;
    return base({ rot: 72, y: 30, armL: 6, armR: -6, thighL: 48 * pulse(t, w), thighR: 48 * pulse(t + Math.PI / w, w), breathe: .5 + .5 * sin(t, 2) });
  },
  burpee(t) {
    const T = 2.4, ph = (t % T) / T; // 0..1
    let y = 0, arm = 8, thigh = 0, shin = 0;
    if (ph < .3) { const s = ph / .3; y = 16 * s; thigh = 24 * s; shin = -14 * s; arm = 8 + 20 * s; }
    else if (ph < .5) { const s = (ph - .3) / .2; y = 16 - 26 * s; arm = 28 + 132 * s; thigh = 24 - 24 * s; shin = -14 + 14 * s; }
    else if (ph < .62) { y = -10; arm = 160; }
    else if (ph < .82) { const s = (ph - .62) / .2; y = -10 + 26 * s; arm = 160 - 132 * s; thigh = 24 * s; shin = -14 * s; }
    else { const s = (ph - .82) / .18; y = 16 * (1 - s); thigh = 24 * (1 - s); shin = -14 * (1 - s); arm = 28 - 20 * s; }
    return base({ y, armL: arm, armR: -arm, thighL: thigh, thighR: -thigh, shinL: shin, shinR: -shin, breathe: .5 + .5 * sin(t, 1.5) });
  },
  boxing(t) {
    const w = 4.6;
    const a = pulse(t, w), b = pulse(t + Math.PI / w, w);
    return base({ armL: 12 - 82 * a, armR: -12 + 82 * b, foreL: -18 * a, foreR: 18 * b, thighL: 6 * sin(t, w), thighR: -6 * sin(t, w), y: 2 * Math.abs(sin(t, w)), breathe: .5 + .5 * sin(t, 2) });
  },
  dance(t) {
    return base({
      rot: 5 * sin(t, 1.8), x: 6 * sin(t, .9),
      armL: 40 + 38 * sin(t, 1.8), armR: -40 + 38 * sin(t + Math.PI / 1.8, 1.8),
      foreL: -30 + 20 * sin(t, 1.8), foreR: 30 + 20 * sin(t + Math.PI / 1.8, 1.8),
      thighL: 16 * sin(t, 1.8), thighR: -16 * sin(t, 1.8),
      y: -4 * Math.abs(sin(t, 3.6)), breathe: .5 + .5 * sin(t, 2),
    });
  },
  step(t) {
    const w = 2.4;
    return base({ x: 9 * sin(t, w), thighL: 20 * pulse(t, w), thighR: -20 * pulse(t + Math.PI / w, w), armL: 18 * sin(t, w), armR: -18 * sin(t, w), breathe: .5 + .5 * sin(t, 1.2) });
  },
  stretch(t) {
    return base({ armL: 160 + 12 * sin(t, .7), armR: -160 - 12 * sin(t, .7), y: -2 * sin(t, .7), breathe: .5 + .5 * sin(t, .9) });
  },
  sidebend(t) {
    const s = sin(t, .8);
    return base({ rot: 14 * s, armL: 165, armR: -165, breathe: .5 + .5 * sin(t, .9) });
  },
  meditate(t) {
    return base({ armL: 30, armR: -30, foreL: -115, foreR: 115, breathe: .5 + .5 * sin(t, .8), y: 2 + sin(t, .8) });
  },
  calf(t) {
    const s = .5 + .5 * sin(t, 2.4);
    return base({ y: -5 * s, armL: 8, armR: -8, breathe: .5 + .5 * sin(t, 1.4) });
  },
  kick(t) {
    const w = 1.6;
    return base({ thighL: 45 * pulse(t, w), thighR: -45 * pulse(t + Math.PI / w, w), shinL: -10 * pulse(t, w), shinR: 10 * pulse(t + Math.PI / w, w), rot: -6 * sin(t, w), armL: 15 * sin(t, w), armR: -15 * sin(t, w), breathe: .5 + .5 * sin(t, 1.2) });
  },
  kickback(t) {
    const s = .5 + .5 * sin(t, 1.7);
    return base({ rot: 12, thighR: -38 * s, shinR: 6 * s, thighL: 4, armL: 30, armR: -30, breathe: .5 + .5 * sin(t, 1.1) });
  },
  row(t) {
    const s = .5 + .5 * sin(t, 1.8);
    return base({ rot: 26, armL: -55, armR: 55, foreL: -14 - 86 * s, foreR: 14 + 86 * s, breathe: .5 + .5 * sin(t, 1.2) });
  },
  hinge(t) {
    const s = .5 + .5 * sin(t, 1.1);
    return base({ rot: 52 * s, armL: 5, armR: -5, breathe: .5 + .5 * sin(t, .9) });
  },
  superman(t) {
    const s = .5 + .5 * sin(t, 1.3);
    return base({ rot: -72, y: 22 + 8 * s, armL: 150, armR: -150, thighL: 8 * s, thighR: -8 * s, breathe: .5 + .5 * sin(t, 1.2) });
  },
  birddog(t) {
    const w = 1.1;
    const a = .5 + .5 * sin(t, w);
    return base({ rot: -72, y: 26, armL: 8 + 140 * a, armR: -8 - 140 * (1 - a), thighR: -8 - 38 * (1 - a), thighL: 8 + 38 * a, breathe: .5 + .5 * sin(t, 1.2) });
  },
  catcow(t) {
    const s = .5 + .5 * sin(t, 1.2);
    return base({ rot: -72, y: 34 + 6 * s, armL: 10, armR: -10, breathe: s, y2: 0 });
  },
  sunsal(t) {
    const s = .5 + .5 * sin(t, .9); // 0 stand -> 1 folded
    return base({ rot: 58 * s, armL: 10 + 155 * (1 - s), armR: -10 - 155 * (1 - s), breathe: .5 + .5 * sin(t, .9) });
  },
  wallsit(t) {
    const tr = Math.sin(t * 8) * 1.5;
    return base({ y: 16, thighL: 26 + tr, thighR: -26 - tr, shinL: -20, shinR: 20, armL: -85, armR: 85, breathe: .5 + .5 * sin(t, 1.1) });
  },
  bridge(t) {
    const s = .5 + .5 * sin(t, 1.4);
    return base({ rot: 72, y: 24 - 12 * s, thighL: 22, thighR: -22, shinL: -18, shinR: 18, breathe: .5 + .5 * sin(t, 1.2) });
  },
  legraise(t) {
    const s = .5 + .5 * sin(t, 1.5);
    return base({ rot: 72, y: 28, armL: 20, armR: -20, thighL: 55 * s, thighR: 55 * s, breathe: .5 + .5 * sin(t, 1.1) });
  },
  bicycle(t) {
    const w = 3.2;
    return base({ rot: 72, y: 28, armL: 25, armR: -25, foreL: -60 * pulse(t, w), foreR: 60 * pulse(t + Math.PI / w, w), thighL: 40 * pulse(t, w), thighR: 40 * pulse(t + Math.PI / w, w), breathe: .5 + .5 * sin(t, 1.5) });
  },
  twist(t) {
    return base({ rot: 14 * sin(t, 1.6), armL: 75, armR: -75, foreL: -70, foreR: 70, thighL: 5 * sin(t, 1.6), thighR: -5 * sin(t, 1.6), breathe: .5 + .5 * sin(t, 1.2) });
  },
};

export const POSE_NAMES = Object.keys(POSES);

export function createFigure(mountEl, { gender = 'male', pose = 'idle', speed = 1 } = {}) {
  const skin = SKINS[Math.floor(Math.random() * SKINS.length)];
  mountEl.innerHTML = skeleton(gender, skin);
  let svg = mountEl.querySelector('svg');
  const j = {};
  ['armL', 'armR', 'foreL', 'foreR', 'thighL', 'thighR', 'shinL', 'shinR'].forEach(k => {
    j[k] = svg.querySelector(`.j-${k}`);
  });
  let whole = svg.querySelector('.fig-whole');
  let breatheEl = svg.querySelector('.fig-breathe');
  let genderLocal = gender;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, t0 = performance.now(), current = pose, spd = speed, visible = true;

  function frame(now) {
    if (!visible) { raf = 0; return; }
    const t = (now - t0) / 1000 * spd;
    const p = (POSES[current] || POSES.idle)(t);
    const set = (k, v) => j[k]?.setAttribute('transform', `rotate(${v})`);
    set('armL', p.armL); set('armR', p.armR);
    set('foreL', p.foreL); set('foreR', p.foreR);
    set('thighL', p.thighL); set('thighR', p.thighR);
    set('shinL', p.shinL); set('shinR', p.shinR);
    whole.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.rot} 100 100)`);
    const b = 1 + p.breathe * 0.028;
    breatheEl.setAttribute('transform', `translate(100 120) scale(${b}) translate(-100 -120)`);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || reduced) return;
    t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: 0.05 });
  io.observe(svg);

  if (reduced) {
    // render a single static mid-pose frame
    const p = (POSES[current] || POSES.idle)(0.4);
    Object.entries(j).forEach(([k, node]) => node.setAttribute('transform', `rotate(${p[k] ?? 0})`));
    whole.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.rot} 100 100)`);
  } else start();

  return {
    get el() { return svg; },
    setPose(p, s) { current = p; if (s) spd = s; },
    setGender(g) {
      if (g === genderLocal) return;
      genderLocal = g;
      const wasVisible = visible;
      mountEl.innerHTML = skeleton(genderLocal, skin);
      svg = mountEl.querySelector('svg');
      ['armL', 'armR', 'foreL', 'foreR', 'thighL', 'thighR', 'shinL', 'shinR'].forEach(k => {
        j[k] = svg.querySelector(`.j-${k}`);
      });
      whole = svg.querySelector('.fig-whole');
      breatheEl = svg.querySelector('.fig-breathe');
      io.disconnect();
      io.observe(svg);
      visible = wasVisible;
      if (visible) start();
    },
    destroy() { stop(); io.disconnect(); mountEl.innerHTML = ''; },
  };
}
