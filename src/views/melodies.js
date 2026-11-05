// Divine Melodies — generated ambient melodies for meditation, breathwork and sleep.
import { icon, toast } from '../ui/dom.js';
import { MELODIES } from '../data/melodies.js';
import { playMelody, stopMelody, isMelodyPlaying, setMelodyVolume } from '../modules/audio.js';
import { get, set } from '../modules/storage.js';

export function render(view) {
  let volume = Math.max(0.1, Math.min(0.9, Number(get('melodyVolume', 0.55)) || 0.55));
  let current = MELODIES[0].id;
  let playing = isMelodyPlaying();

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('music')} Divine Melodies</div></div>

    <div class="melody-hero" id="melody-hero">
      <div class="melody-halo"></div>
      <div class="row between" style="align-items:flex-start;gap:14px">
        <div style="min-width:0">
          <div class="melody-eyebrow">Meditation soundscape</div>
          <h1 id="melody-name"></h1>
          <div class="melody-ne" id="melody-ne"></div>
          <p id="melody-desc"></p>
        </div>
        <div class="melody-orb" id="melody-orb"></div>
      </div>

      <div class="melody-eq" id="melody-eq"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>

      <div class="melody-controls">
        <button class="btn primary wide" id="melody-toggle">${icon('play')} <span>Play melody</span></button>
      </div>
      <div class="mt-14">
        <div class="row between small muted"><span>Volume</span><b id="melody-vol-label" style="color:var(--text)">${Math.round(volume * 100)}%</b></div>
        <input type="range" id="melody-volume" min="10" max="90" value="${Math.round(volume * 100)}" style="width:100%;accent-color:var(--accent-2)">
      </div>
      <div class="melody-tip">🎧 Headphones recommended · every note is generated live on your device — no downloads, fully offline.</div>
    </div>

    <div class="section-title">Choose a melody <span class="small muted">8 soundscapes</span></div>
    <div class="melody-list" id="melody-list">
      ${MELODIES.map(m => `
        <button class="melody-card" data-melody="${m.id}" style="--melody-grad:${m.gradient}">
          <span class="melody-emoji">${m.emoji}</span>
          <span class="melody-card-info">
            <b>${m.name}</b>
            <small>${m.ne} · ${m.desc}</small>
          </span>
          <span class="melody-play" data-play="${m.id}">${icon('play')}</span>
        </button>`).join('')}
    </div>

    <div class="card mt-20 melody-note">
      <div class="card-title">Make it a ritual</div>
      <div class="small">
        Sit comfortably, close your eyes and let the melody carry your attention. Follow the breath in for 4, hold for 4, out for 6. Even 5 minutes a day calms the nervous system and trains focus.
      </div>
      <button class="btn ghost mt-14" id="melody-mind">${icon('mind')} Open Mind Studio</button>
    </div>
  `;

  const hero = view.querySelector('#melody-hero');
  const nameEl = view.querySelector('#melody-name');
  const neEl = view.querySelector('#melody-ne');
  const descEl = view.querySelector('#melody-desc');
  const orb = view.querySelector('#melody-orb');
  const eq = view.querySelector('#melody-eq');
  const toggle = view.querySelector('#melody-toggle');

  const track = () => MELODIES.find(m => m.id === current) || MELODIES[0];

  const paint = () => {
    const t = track();
    hero.style.background = t.gradient;
    nameEl.textContent = t.name;
    neEl.textContent = t.ne;
    descEl.textContent = t.desc;
    orb.textContent = t.emoji;
    eq.classList.toggle('on', playing);
    toggle.innerHTML = playing
      ? `${icon('pause')} <span>Pause melody</span>`
      : `${icon('play')} <span>Play melody</span>`;
    view.querySelectorAll('[data-melody]').forEach(c => {
      c.classList.toggle('on', c.dataset.melody === current);
      const p = c.querySelector('[data-play]');
      if (p) p.innerHTML = c.dataset.melody === current && playing ? icon('pause') : icon('play');
    });
  };

  const start = (id) => {
    current = id;
    playMelody(track(), volume);
    playing = true;
    set('melodyVolume', volume);
    paint();
  };

  toggle.addEventListener('click', () => {
    if (playing) {
      stopMelody();
      playing = false;
      paint();
    } else {
      start(current);
    }
  });

  view.querySelector('#melody-list').addEventListener('click', e => {
    const card = e.target.closest('[data-melody]');
    if (!card) return;
    start(card.dataset.melody);
  });

  view.querySelector('#melody-volume').addEventListener('input', e => {
    volume = +e.target.value / 100;
    view.querySelector('#melody-vol-label').textContent = `${e.target.value}%`;
    setMelodyVolume(volume);
    set('melodyVolume', volume);
  });

  view.querySelector('#melody-mind').addEventListener('click', () => { location.hash = '#/mind'; });

  if (playing) toast('Melody resumed 🎵');
  paint();
}
