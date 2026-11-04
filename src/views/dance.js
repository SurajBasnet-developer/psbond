// Dance — programs plus a live beat engine for freestyle cardio.
import { el, icon, toast } from '../ui/dom.js';
import { createFigure } from '../ui/figure.js';
import { PROGRAMS } from '../data/content.js';
import { byId } from '../data/exercises.js';
import { playWorkout } from '../modules/player.js';
import { playBeat, stopBeat, isBeatPlaying } from '../modules/audio.js';
import { addSession, addXP, bumpStat } from '../modules/storage.js';

export function render(view) {
  view.innerHTML = `
    <div class="header"><div class="brand">${icon('music')} Dance</div></div>
    <div class="hero" style="padding:16px">
      <div class="row between">
        <div>
          <h1 style="font-size:20px">Beat Studio 🎧</h1>
          <p>Cardio disguised as fun. Press play and move.</p>
        </div>
        <div id="dance-fig" style="width:90px;height:90px;flex:none"></div>
      </div>
      <div class="row mt-14">
        <button class="btn primary" id="beat-btn">${icon('play')} Play beat</button>
        <button class="btn" id="free-btn">Freestyle 60s</button>
      </div>
      <div class="mt-14">
        <div class="row between small muted"><span>Tempo</span><b id="bpm-label" style="color:var(--text)">110 BPM</b></div>
        <input type="range" id="bpm" min="80" max="140" value="110" style="width:100%;accent-color:var(--accent-2)">
        <div class="chips mt-8" id="styles">
          <button class="chip on" data-s="house">House</button>
          <button class="chip" data-s="lofi">Lo-fi</button>
          <button class="chip" data-s="afro">Afro</button>
        </div>
      </div>
    </div>
    <div class="section-title">Dance workouts</div>
    <div class="stack" id="dance-list"></div>
  `;

  const fig = createFigure(view.querySelector('#dance-fig'), { gender: 'female', pose: 'dance', speed: 1.1 });
  view._figs = [fig];

  let style = 'house', bpm = 110;
  const beatBtn = view.querySelector('#beat-btn');

  beatBtn.addEventListener('click', () => {
    if (isBeatPlaying()) {
      stopBeat();
      beatBtn.innerHTML = `${icon('play')} Play beat`;
    } else {
      playBeat(bpm, style);
      beatBtn.innerHTML = `${icon('pause')} Stop beat`;
    }
  });
  view.querySelector('#bpm').addEventListener('input', e => {
    bpm = +e.target.value;
    view.querySelector('#bpm-label').textContent = `${bpm} BPM`;
    if (isBeatPlaying()) playBeat(bpm, style);
  });
  view.querySelector('#styles').addEventListener('click', e => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    style = b.dataset.s;
    view.querySelectorAll('#styles .chip').forEach(c => c.classList.toggle('on', c === b));
    if (isBeatPlaying()) playBeat(bpm, style);
  });

  view.querySelector('#free-btn').addEventListener('click', () => {
    const ex = byId('freestyle');
    playBeat(bpm, style);
    playWorkout('Freestyle Session', [{ ...ex, secs: 60 }], { kind: 'dance' });
    setTimeout(stopBeat, 61000);
  });

  const list = view.querySelector('#dance-list');
  PROGRAMS.filter(p => p.section === 'dance').forEach(p => {
    const ex = byId(p.items[0]);
    const card = el(`
      <div class="program" style="min-width:0">
        <span class="tag dance">${p.cat}</span>
        <div class="fig-wrap" style="height:110px"></div>
        <h3>${p.name}</h3>
        <div class="meta">${p.mins} min · ${p.items.length} moves</div>
        <div class="small muted mt-8">${p.desc}</div>
      </div>`);
    if (ex) {
      const f = createFigure(card.querySelector('.fig-wrap'), { gender: Math.random() > .5 ? 'female' : 'male', pose: ex.pose, speed: 1 });
      view._figs.push(f);
    }
    card.addEventListener('click', () => {
      const exs = p.items.map(byId).filter(Boolean);
      playBeat(bpm, style);
      playWorkout(p.name, exs, { kind: 'dance' });
      setTimeout(stopBeat, (exs.reduce((a, e) => a + e.secs + 15, 0) + 6) * 1000);
    });
    list.appendChild(card);
  });
}
