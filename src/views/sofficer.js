// Section Officer — Lok Sewa Aayog (शाखा अधिकृत) preparation hub.
// Curriculum tracker · discipline · time management · study hours · motivation.
// Everything offline; progress lives in localStorage under 'bb.so'.
import { el, icon, toast, openModal, esc, haptic } from '../ui/dom.js';
import { getSoState, setSoState, dayKey, addXP } from '../modules/storage.js';
import {
  SO_PAPERS, SO_FACTS, SO_DISCIPLINE, SO_PLANS, SO_HOURS,
  SO_MOTIVATION, SO_AFFIRM, SO_RULES, SO_TIPS,
  SO_OCCUPATIONS, buildJobPlan, buildFreePlan, toMin, toHM,
  SO_TECHNIQUES, SO_TEQ_CATS,
} from '../data/sofficer.js';

const TOPIC_TOTAL = SO_PAPERS.reduce((a, p) => a + p.topics.length, 0);
const fmtHM = min => {
  min = Math.round(min);
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};
const fmtMonth = d => (d / 30.4).toFixed(1);
const fmtH = min => `${(min / 60).toFixed(1).replace(/\.0$/, '')}h`;

// live ticker for the "right now" schedule tracker (one per app lifetime)
let soTicker = null;

const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const inSpan = (n, s, e) => (e > s ? n >= s && n < e : n >= s || n < e);
const activeBlock = (p, n) => {
  const act = p.blocks.filter(b => inSpan(n, b.s, b.e));
  return act.length ? act.reduce((a, b) => (b.w > a.w ? b : a)) : null;
};
const tlCls = k => (k === 'job' ? 'job' : k === 'audio' ? 'move'
  : ['deep', 'micro', 'revise', 'write'].includes(k) ? 'study' : 'free');
const occTimeline = p => {
  const segs = [{ f: 0, t: p.wake, c: 'sleep' }];
  let last = p.wake;
  p.blocks.slice().sort((a, b) => a.s - b.s).forEach(b => {
    if (b.s >= last) {
      if (b.s > last) segs.push({ f: last, t: b.s, c: 'free' });
      segs.push({ f: b.s, t: b.e, c: tlCls(b.k) });
      last = Math.max(last, b.e);
    } else {                       // micro-block nested inside the job block
      segs.push({ f: b.s, t: Math.min(b.e, last), c: tlCls(b.k) });
      if (last > b.e) segs.push({ f: b.e, t: last, c: 'job' });
    }
  });
  if (last < p.bed) segs.push({ f: last, t: p.bed, c: 'free' });
  segs.push({ f: p.bed, t: 1440, c: 'sleep' });
  return segs;
};
const occRow = b => `
  <div class="so-plan-row" data-occ-row>
    <span class="tm">${toHM(b.s)}–${toHM(b.e)}</span>
    <span class="lb">${esc(b.t)}</span>
    <span class="nowb" hidden>NOW</span>
    <span class="du">${fmtHM(b.e - b.s)}</span>
    <i class="prog"></i>
  </div>`;

// small stats derived from the stored state
const todayMin = so => so.hours[dayKey()] || 0;
const totalMin = so => Object.values(so.hours).reduce((a, b) => a + (b || 0), 0);
const daysLogged = so => Object.values(so.hours).filter(v => v > 0).length;
const studyStreak = so => {
  let s = 0;
  const d = new Date();
  const has = k => (so.hours[k] || 0) > 0;
  if (!has(dayKey(d))) d.setDate(d.getDate() - 1);
  while (has(dayKey(d))) { s++; d.setDate(d.getDate() - 1); }
  return s;
};
const prepDays = so => {
  if (!so.started) return 0;
  const a = new Date(`${so.started}T00:00:00`);
  return Math.max(1, Math.floor((Date.now() - a.getTime()) / 864e5) + 1);
};
const examCountdown = so => {
  if (!so.examDate) return null;
  const e = new Date(`${so.examDate}T00:00:00`);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((e - now) / 864e5);
};
const paperDone = (so, p) => p.topics.filter(t => so.topics[t.id]).length;

// celebration — pure CSS confetti burst
function confetti() {
  const wrap = el('<div class="so-confetti"></div>');
  document.body.appendChild(wrap);
  const colors = ['#ff9a6b', '#ff5e7d', '#9d7bff', '#4f8cff', '#2dd4a7', '#ffd9a3'];
  for (let i = 0; i < 30; i++) {
    const p = el('<i></i>');
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--d', `${1 + Math.random() * 0.9}s`);
    p.style.setProperty('--dl', `${Math.random() * 0.4}s`);
    p.style.setProperty('--c', colors[i % colors.length]);
    if (Math.random() < .5) p.style.borderRadius = '50%';
    wrap.appendChild(p);
  }
  setTimeout(() => wrap.remove(), 2200);
}

export function render(view) {
  let so = getSoState();
  const planOf = () => SO_PLANS.find(p => p.id === so.plan) || SO_PLANS[1];
  let qi = Math.floor(Math.random() * SO_MOTIVATION.length);

  const discDay = () => so.disc[dayKey()] || {};

  // ---------- occupation helpers ----------
  const occOf = () => SO_OCCUPATIONS.find(o => o.id === so.occupation) || null;
  const isHoliday = () => {
    const k = dayKey();
    if (so.holiday && k in so.holiday) return so.holiday[k] === true;
    return new Date().getDay() === 6;               // शनिबार — the Nepali day off
  };
  const planForToday = () => {
    const occ = occOf();
    if (!occ) return null;
    if (isHoliday() || !occ.job) return { ...buildFreePlan(), type: 'free' };
    return { ...buildJobPlan(so.workStart, so.workEnd, so.commute, so.lunch), type: 'job' };
  };
  let ap = planForToday();
  const goalMin = () => (ap ? Math.round(ap.min / 15) * 15 : planOf().hours * 60);
  const occWeekH = () => {
    if (!ap) return 0;
    const freeH = buildFreePlan().min / 60;
    return ap.type === 'job' ? (ap.min / 60) * 6 + freeH : freeH * 7;
  };

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('medal')} Section Officer</div></div>

    <!-- ============ hero ============ -->
    <div class="so-hero so-fade">
      <div class="so-halo"></div>
      <div class="row between" style="align-items:flex-start;gap:10px">
        <div style="min-width:0">
          <div class="so-eyebrow">LOK SEWA AAYOG · GAZETTED III</div>
          <h1 class="so-title mt-8">Section Officer</h1>
          <div class="so-ne">शाखा अधिकृत — तपाईंको तयारी हब</div>
        </div>
        <div class="so-flag">🇳🇵</div>
      </div>
      <div class="so-pills">
        <span class="so-pill">🧠 AAT · 100 MCQ</span>
        <span class="so-pill">🏛️ 3 papers × 100</span>
        <span class="so-pill">🎤 Final · 60</span>
        <span class="so-pill">🏆 Merit 360</span>
      </div>
      <div class="so-hero-row">
        <div class="so-ring" id="so-ring" style="--p:0%">
          <div class="in"><b id="so-ring-v">0%</b><small>syllabus</small></div>
        </div>
        <div style="min-width:0">
          <div style="font-weight:800;font-size:15px" id="so-ring-line">0 / ${TOPIC_TOTAL} topics done</div>
          <div class="small muted mt-8">Check topics in the curriculum below — your ring fills as you master them.</div>
        </div>
      </div>
    </div>

    <!-- ============ journey: days, streak, hours, countdown ============ -->
    <div class="card so-fade mt-14" id="so-journey" style="animation-delay:.06s">
      <div class="row between">
        <div>
          <div class="card-title">Your journey</div>
          <div class="row" style="gap:8px;align-items:flex-end">
            <div class="so-days" id="so-days">${so.started ? prepDays(so) : '—'}</div>
            <div style="font-size:12.5px;color:var(--muted);font-weight:700;padding-bottom:6px" id="so-days-label">${so.started ? 'days preparing' : 'not started'}</div>
          </div>
        </div>
        <div id="so-jact" class="row" style="gap:8px"></div>
      </div>
      <div class="grid-3 mt-14">
        <div class="stat"><div class="v"><span class="so-flame">🔥</span> <span id="so-streak">0</span></div><div class="l">Study streak</div></div>
        <div class="stat"><div class="v" id="so-total">0h</div><div class="l">Hours logged</div></div>
        <div class="stat"><div class="v" id="so-count">—</div><div class="l">Exam countdown</div></div>
      </div>
      <div class="row mt-14" style="gap:14px;align-items:center">
        <div class="so-ring" id="so-day-ring" style="--p:0%;width:70px;height:70px">
          <div class="in"><b id="so-day-v" style="font-size:13px">0m</b><small>today</small></div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:800" id="so-goal-line"></div>
          <div class="small muted" id="so-goal-sub">Log study time — every minute counts.</div>
          <div class="row mt-8" style="gap:8px">
            <button class="so-logbtn" data-min="15">+15m</button>
            <button class="so-logbtn" data-min="30">+30m</button>
            <button class="so-logbtn" data-min="60">+1h</button>
          </div>
        </div>
      </div>
      <div class="mt-14"><input type="date" class="so-date" id="so-date" style="width:100%" value="${esc(so.examDate || '')}"></div>
      <div class="small muted mt-8">Set your exam date to see the live countdown. 🎯</div>
    </div>

    <!-- ============ job & study (occupation scheduler) ============ -->
    <div class="section-title">My job &amp; study <span class="small muted">काम अनुसार तालिका</span></div>
    <div class="stack" id="so-occ"></div>

    <!-- ============ exam at a glance ============ -->
    <div class="card so-fade mt-14" style="animation-delay:.12s">
      <div class="card-title">Exam at a glance</div>
      ${SO_FACTS.map(f => `<div class="feat"><div class="e">${f.e}</div><div><div class="t">${esc(f.t)}</div><div class="d">${esc(f.d)}</div></div></div>`).join('')}
    </div>

    <!-- ============ curriculum ============ -->
    <div class="section-title">Curriculum <span class="small muted">tap a paper →</span></div>
    <div class="stack" id="so-papers"></div>

    <!-- ============ time management ============ -->
    <div class="section-title">Time management</div>
    <div class="chips" id="so-plan-chips"></div>
    <div class="card" id="so-plan-card"></div>
    <div class="card mt-14">
      <div class="card-title">Max → Min hours to be exam-ready</div>
      <div class="small muted">The full syllabus needs about <b style="color:var(--text)">${SO_HOURS} hours</b> of focused study. Pick your pace:</div>
      <div class="stack mt-14" id="so-tiers"></div>
      <div class="small muted mt-14" id="so-pace">Log study time to see your personal pace.</div>
    </div>

    <!-- ============ study techniques (20, banking-card grid) ============ -->
    <div class="section-title">Study techniques <span class="small muted" id="so-teq-x">0/20 mastered</span></div>
    <div class="stack" id="so-teq"></div>

    <!-- ============ discipline ============ -->
    <div class="section-title">Discipline <span class="small muted" id="so-disc-x"></span></div>
    <div class="card">
      <div class="so-disc" id="so-disc"></div>
      <div class="bar mt-14"><i id="so-disc-bar" style="width:0%"></i></div>
      <div class="small muted mt-8">All 8 done = +20 XP & a small celebration. Resets every morning.</div>
    </div>

    <!-- ============ motivation ============ -->
    <div class="section-title">Officer motivation</div>
    <div class="card quote-card so-quote" id="so-quote-card">
      <div class="mark">"</div>
      <div class="card-title">Daily fuel</div>
      <blockquote id="so-quote"></blockquote>
      <cite>tap for another one 🔁</cite>
    </div>
    <div class="grid-2 mt-8" id="so-affirms">
      ${SO_AFFIRM.map(a => `<div class="so-afchip">${esc(a)}</div>`).join('')}
    </div>
    <div class="card mt-14" style="border-color:rgba(255,154,107,.35)">
      <div class="card-title">The 5 rules of a selected candidate</div>
      <ul class="book-lessons">${SO_RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </div>

    <!-- ============ answer writing ============ -->
    <div class="section-title">Answer writing</div>
    <div class="card">
      <div class="row" style="gap:16px">
        <button class="so-answer-btn" id="so-ans">✍️</button>
        <div style="flex:1;min-width:0">
          <div style="font-weight:800" id="so-ans-t">0 answers today</div>
          <div class="small muted">1 full answer a day = 365 before the exam.</div>
          <div class="small muted mt-8">10-mark recipe: 2 min plan · 12 min write · 4 min review.</div>
        </div>
      </div>
    </div>

    <!-- ============ strategy vault ============ -->
    <div class="section-title">Strategy vault</div>
    <div class="stack" id="so-tips">
      ${SO_TIPS.map(t => `
        <div class="so-tip-row" data-tip="${t.id}">
          <div class="e">${t.e}</div>
          <div style="min-width:0"><div class="t">${esc(t.t)}</div><div class="d">${esc(t.d)}</div></div>
          <div class="go">${icon('chev')}</div>
        </div>`).join('')}
    </div>

    <div class="center small muted mt-20">Made with ❤️ by <b>Suraj Basnet</b></div>
  `;

  // ---------- element refs ----------
  const $ = sel => view.querySelector(sel);
  const ring = $('#so-ring'), ringV = $('#so-ring-v'), ringLine = $('#so-ring-line');
  const daysEl = $('#so-days'), daysLabel = $('#so-days-label'), jact = $('#so-jact');
  const streakEl = $('#so-streak'), totalEl = $('#so-total'), countEl = $('#so-count');
  const dayRing = $('#so-day-ring'), dayV = $('#so-day-v');
  const goalLine = $('#so-goal-line'), dateIn = $('#so-date');
  const discBox = $('#so-disc'), discBar = $('#so-disc-bar'), discX = $('#so-disc-x');
  const ansBtn = $('#so-ans'), ansT = $('#so-ans-t');
  const paceEl = $('#so-pace');
  const paperEls = {};

  // ---------- paints ----------
  const paintSyllabus = () => {
    const done = SO_PAPERS.reduce((a, p) => a + paperDone(so, p), 0);
    const pct = Math.round((done / TOPIC_TOTAL) * 100);
    ring.style.setProperty('--p', `${pct}%`);
    ringV.textContent = `${pct}%`;
    ringLine.textContent = `${done} / ${TOPIC_TOTAL} topics done`;
  };

  const paintPapers = () => {
    SO_PAPERS.forEach(p => {
      const ref = paperEls[p.id];
      if (!ref) return;
      const done = paperDone(so, p);
      const pct = Math.round((done / p.topics.length) * 100);
      ref.bar.style.width = `${pct}%`;
      ref.count.textContent = `${done}/${p.topics.length} topics`;
      ref.pct.textContent = `${pct}%`;
    });
    paintSyllabus();
  };

  const paintJourney = () => {
    const plan = planOf();
    const tMin = todayMin(so), totMin = totalMin(so);
    daysEl.textContent = so.started ? prepDays(so) : '—';
    daysLabel.textContent = so.started ? 'days preparing' : 'not started';
    streakEl.textContent = studyStreak(so);
    totalEl.textContent = `${Math.round(totMin / 60 * 10) / 10}h`;

    const cd = examCountdown(so);
    if (cd === null) countEl.textContent = '—';
    else if (cd > 0) countEl.textContent = `${cd}d`;
    else if (cd === 0) countEl.textContent = 'Today 🎖️';
    else countEl.textContent = 'Done';
    countEl.classList.toggle('urgent', cd !== null && cd >= 0 && cd <= 30);

    const gMin = goalMin();
    const occ = occOf();
    dayRing.style.setProperty('--p', `${Math.min(100, (tMin / gMin) * 100)}%`);
    dayV.textContent = tMin ? fmtHM(tMin) : '0m';
    goalLine.textContent = occ
      ? `Goal: ${fmtH(gMin)} today · ${occ.emoji} ${occ.name}${isHoliday() ? ' · 🕊️ बिदा' : ''}`
      : `Goal: ${plan.hours}h today · ${plan.emoji} ${plan.name}`;

    const avg = daysLogged(so) ? totalMin(so) / 60 / daysLogged(so) : 0;
    paceEl.innerHTML = avg > 0
      ? `Your pace: <b style="color:var(--text)">${avg.toFixed(1)}h/day</b> → ~${fmtMonth(SO_HOURS / avg)} months to cover the full syllabus.`
      : 'Log study time to see your personal pace.';

    jact.innerHTML = so.started
      ? `<button class="btn ghost" id="so-restart" style="padding:9px 13px;font-size:13px">Reset day 1</button>`
      : `<button class="btn primary" id="so-start">🚀 Start today</button>`;
    if (so.started) {
      $('#so-restart')?.addEventListener('click', () => {
        so = setSoState({ started: dayKey() });
        paintJourney();
        toast('Day 1 — again from today. Discipline wins 🎖️');
      });
    } else {
      $('#so-start')?.addEventListener('click', () => {
        so = setSoState({ started: dayKey() });
        so.hours[dayKey()] = so.hours[dayKey()] || 0;
        paintJourney();
        toast('Journey started — Day 1 begins now 🎖️');
        haptic(20);
      });
    }
  };

  const paintPlan = () => {
    const plan = planOf();
    $('#so-plan-chips').innerHTML = SO_PLANS.map(p =>
      `<button class="chip ${p.id === plan.id ? 'on' : ''}" data-plan="${p.id}">${p.emoji} ${p.name} · ${p.hours}h</button>`).join('');
    $('#so-plan-card').innerHTML = `
      <div class="row between">
        <div><div style="font-weight:800;font-size:16px">${plan.emoji} ${plan.name} plan</div>
        <div class="small muted">${esc(plan.for)}</div></div>
        <span class="so-pill" style="font-size:12px;padding:7px 13px">${plan.hours}h / day</span>
      </div>
      <div class="mt-14">
        ${plan.blocks.map(b => `
          <div class="so-plan-row">
            <span class="tm">${b.time}</span>
            <span class="lb">${esc(b.t)}</span>
            <span class="du">${b.d}h</span>
          </div>`).join('')}
      </div>
      <div class="small muted mt-10">Blocks include short breaks — take 10 minutes off every hour.${occOf() ? ' Your live daily goal comes from the <b>My job &amp; study</b> schedule above.' : ''}</div>`;
    const occH = ap ? Math.round(ap.min / 60) : null;
    const recId = occH ? SO_PLANS.reduce((b, p2) =>
      Math.abs(p2.hours - occH) < Math.abs(b.hours - occH) ? p2 : b, SO_PLANS[0]).id : null;
    $('#so-tiers').innerHTML = SO_PLANS.map(p => {
      const d = Math.ceil(SO_HOURS / p.hours);
      return `
      <div class="so-tier ${p.id === plan.id ? 'on' : ''} ${p.id === recId && p.id !== plan.id ? 'rec' : ''}" data-tier="${p.id}">
        <div class="e">${p.emoji}</div>
        <div class="t"><div class="n">${p.name}${p.id === plan.id ? ' · your plan' : p.id === recId ? ' · fits your job' : ''}</div>
        <div class="d">${esc(p.for)}</div></div>
        <div class="big">${d}d<br><span class="small muted" style="font-weight:700">~${fmtMonth(SO_HOURS / p.hours)} mo</span></div>
      </div>`;
    }).join('');
    paintJourney();
  };

  const paintDiscipline = () => {
    const day = discDay();
    const occ = occOf();
    const items = occ && ap
      ? SO_DISCIPLINE.map((d, i) => i === 0
        ? { e: '🌅', t: `Wake by ${toHM(ap.wake)} — study before the world wakes` } : d)
      : SO_DISCIPLINE;
    const doneN = SO_DISCIPLINE.filter((_, i) => day[i]).length;
    discBox.innerHTML = items.map((d, i) => `
      <div class="so-topic ${day[i] ? 'on' : ''}" data-disc="${i}">
        <div class="box">✓</div>
        <div class="txt">${d.e} ${esc(d.t)}</div>
      </div>`).join('');
    discBar.style.width = `${(doneN / SO_DISCIPLINE.length) * 100}%`;
    discX.textContent = `${doneN}/${SO_DISCIPLINE.length} today`;
  };

  const paintAnswers = () => {
    const n = so.answers[dayKey()] || 0;
    ansT.textContent = `${n} answer${n === 1 ? '' : 's'} today`;
  };

  const paintQuote = () => {
    const q = $('#so-quote');
    q.textContent = SO_MOTIVATION[qi];
    q.style.animation = 'none';
    requestAnimationFrame(() => { q.style.animation = 'fadeUp .4s ease'; });
  };

  // ---------- occupation: job-aware schedule ----------
  let picking = false;

  const verdictHTML = () => {
    const wH = occWeekH();
    if (!wH) return '';
    const cd = examCountdown(so);
    if (cd === null || cd <= 0) {
      return `<span class="so-verdict good">~${fmtMonth(SO_HOURS / (wH * 4.35))} months at this rhythm</span>`;
    }
    const need = Math.max(0, SO_HOURS - totalMin(so) / 60) / cd;
    const have = wH / 7;
    return need <= have * 1.05
      ? `<span class="so-verdict good">✓ On track — ${fmtH(need * 60)}/day needed, you have ${fmtH(have * 60)}</span>`
      : `<span class="so-verdict warn">⚠ ${fmtH(need * 60)}/day needed — schedule gives ${fmtH(have * 60)} · use holidays more</span>`;
  };

  const occPickerHTML = () => `
    <div class="card so-fade">
      <div class="card-title">${picking && occOf() ? 'Change your occupation' : 'Who are you? 🎯'}</div>
      <div class="small muted">Pick your job — BiggerBody builds your study day around the working hours (Nepali standard: 9–5). Everything is editable after.</div>
      <div class="so-occ-grid mt-14">
        ${SO_OCCUPATIONS.map(o => `
          <button class="so-occ-pick ${so.occupation === o.id ? 'on' : ''}" data-occ="${o.id}">
            <span class="e">${o.emoji}</span>
            <span style="min-width:0">
              <span class="n">${esc(o.name)}</span>
              <span class="d">${esc(o.ne)}</span>
              <span class="d">${o.job ? `${o.start}–${o.end}` : 'Flexible hours'}</span>
            </span>
          </button>`).join('')}
      </div>
      ${picking && occOf() ? '<button class="btn wide ghost mt-14" data-occ-back>← Back to my schedule</button>' : ''}
    </div>`;

  const occScheduleHTML = () => {
    const occ = occOf(), hol = isHoliday(), n = nowMin();
    return `
    <div class="card so-fade">
      <div class="row between" style="align-items:flex-start;gap:10px">
        <div class="row" style="gap:10px;min-width:0">
          <div style="font-size:30px;flex:none">${occ.emoji}</div>
          <div style="min-width:0">
            <div style="font-weight:800">${esc(occ.name)}</div>
            <div class="small muted">${esc(occ.ne)} · ${ap.type === 'job'
              ? `${esc(so.workStart)}–${esc(so.workEnd)} duty · ${so.commute}m travel`
              : occ.job ? '🕊️ बिदा — full-power day' : 'no fixed duty — your full day is the plan'}</div>
          </div>
        </div>
        <div class="row" style="gap:6px;flex:none">
          ${occ.job ? '<button class="so-logbtn" data-occ-edit>✏️</button>' : ''}
          <button class="so-logbtn" data-occ-swap>🔄</button>
        </div>
      </div>
      ${occ.job ? `
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">
        <button class="chip ${hol ? 'on' : ''}" data-occ-holiday>🕊️ बिदा छ — full-power day</button>
        <span class="small muted" style="align-self:center">auto-on Saturdays</span>
      </div>` : ''}
      <div class="so-tl mt-14">
        ${occTimeline(ap).map(s => `<i class="tl-${s.c}" style="width:${((s.t - s.f) / 1440 * 100).toFixed(2)}%"></i>`).join('')}
        <b class="so-tl-now" style="left:${(n / 1440 * 100).toFixed(2)}%"></b>
      </div>
      <div class="so-legend">
        <span><b class="tl-sleep"></b>sleep</span><span><b class="tl-job"></b>job</span>
        <span><b class="tl-move"></b>travel / audio</span><span><b class="tl-study"></b>study</span>
        <span><b class="tl-free"></b>free</span>
      </div>
      <div class="row mt-14" style="gap:14px;align-items:center">
        <div class="so-clock" id="so-clock">${toHM(n)}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:800" id="so-now-line"></div>
          <div class="small muted mt-8" id="so-next-line"></div>
        </div>
      </div>
      <div class="mt-14" id="so-occ-rows">${ap.blocks.map(occRow).join('')}</div>
      <div class="grid-3 mt-14">
        <div class="stat"><div class="v">${fmtH(ap.min)}</div><div class="l">study / day</div></div>
        <div class="stat"><div class="v">~${fmtMonth(SO_HOURS / (occWeekH() * 4.35))}</div><div class="l">months ready</div></div>
        <div class="stat"><div class="v">${toHM(ap.wake)}</div><div class="l">wake up</div></div>
      </div>
      <div class="small muted mt-8">🛌 Sleep ${toHM(ap.bed)} → ${toHM(ap.wake)} · ~${ap.sleepH.toFixed(1)}h — sleep is part of the plan, not the enemy.</div>
      <div class="row mt-14" style="gap:8px;flex-wrap:wrap">${verdictHTML()}</div>
      <div class="mt-14" style="border-top:1px solid var(--border);padding-top:12px">
        <div style="font-weight:800;font-size:13.5px">${occ.emoji} ${esc(occ.name)} strategy</div>
        <ul class="book-lessons mt-8">${occ.tips.map(t2 => `<li>${esc(t2)}</li>`).join('')}</ul>
      </div>
    </div>`;
  };

  const paintOcc = () => {
    $('#so-occ').innerHTML = !occOf() || picking ? occPickerHTML() : occScheduleHTML();
    if (occOf() && !picking) paintNow();
  };

  // live "right now" tracker — refreshed every 30s
  const paintNow = () => {
    const clock = $('#so-clock');
    if (!clock) return;
    const n = nowMin();
    clock.textContent = toHM(n);
    const act = activeBlock(ap, n);
    const nowLine = $('#so-now-line'), nextLine = $('#so-next-line');
    if (act) {
      nowLine.textContent = act.k === 'job'
        ? '💼 Job time — flashcards & bullets in the breaks'
        : `${act.t} — ${fmtHM(Math.max(0, act.e - n))} left`;
      nextLine.textContent = act.k === 'job'
        ? 'Study resumes the moment duty ends. 🎯'
        : `${act.w >= 1 ? 'Full-focus block' : 'Light block'} — finish strong.`;
    } else {
      nowLine.textContent = 'Free moment — even 20 minutes counts.';
      const next = ap.blocks.filter(b => b.w > 0)
        .map(b => ({ b, d: (b.s - n + 1440) % 1440 }))
        .filter(x => x.d > 0)
        .sort((a, b) => a.d - b.d)[0];
      nextLine.textContent = next ? `Next: ${next.b.t} in ${fmtHM(next.d)}` : 'Rest well — tomorrow\u2019s blocks are ready.';
    }
    view.querySelectorAll('#so-occ-rows [data-occ-row]').forEach((r, i) => {
      const b = ap.blocks[i];
      const on = !!act && !!b && act.s === b.s && act.e === b.e;
      r.classList.toggle('now', on);
      const nb = r.querySelector('.nowb');
      if (nb) nb.hidden = !on;
      const prog = r.querySelector('.prog');
      if (prog) {
        prog.style.width = on
          ? `${(100 * (b.e - b.s - Math.max(0, act.e - n)) / (b.e - b.s)).toFixed(1)}%`
          : '0%';
      }
    });
  };

  const openOccEdit = () => {
    const occ = occOf();
    if (!occ || !occ.job) return;
    const m = openModal(`
      <div style="font-size:34px">✏️</div>
      <h2 style="font-size:21px;font-weight:800;margin-top:6px">Customize your work day</h2>
      <div class="small muted mt-8">${esc(occ.name)} — tune the schedule to your real day.</div>
      <div class="so-edit-grid mt-14">
        <label>Duty starts<input type="time" id="so-ws" value="${esc(so.workStart)}"></label>
        <label>Duty ends<input type="time" id="so-we" value="${esc(so.workEnd)}"></label>
      </div>
      <div class="small muted mt-14" style="font-weight:800">Travel time · one way</div>
      <div class="chips mt-8" id="so-commute-chips">
        ${[0, 15, 30, 45, 60].map(c => `<button class="chip ${so.commute === c ? 'on' : ''}" data-c="${c}">${c ? `${c} min` : 'No travel'}</button>`).join('')}
      </div>
      <div class="small muted mt-14" style="font-weight:800">Lunch break available?</div>
      <div class="chips mt-8" id="so-lunch-chips">
        <button class="chip ${so.lunch ? 'on' : ''}" data-l="1">Yes — flashcards in break</button>
        <button class="chip ${!so.lunch ? 'on' : ''}" data-l="0">No lunch break</button>
      </div>
      <button class="btn wide primary mt-14" id="so-occ-save">Rebuild my schedule</button>
      <button class="btn wide ghost mt-8" id="so-occ-reset">Reset to ${esc(occ.name)} defaults</button>
      <button class="btn wide ghost mt-8" data-close>Close</button>
    `);
    let commute = so.commute, lunch = so.lunch;
    m.el.querySelector('#so-commute-chips').addEventListener('click', e => {
      const c = e.target.closest('[data-c]');
      if (!c) return;
      commute = Number(c.dataset.c);
      m.el.querySelectorAll('#so-commute-chips .chip').forEach(x => x.classList.toggle('on', x === c));
    });
    m.el.querySelector('#so-lunch-chips').addEventListener('click', e => {
      const c = e.target.closest('[data-l]');
      if (!c) return;
      lunch = c.dataset.l === '1';
      m.el.querySelectorAll('#so-lunch-chips .chip').forEach(x => x.classList.toggle('on', x === c));
    });
    m.el.querySelector('#so-occ-save').addEventListener('click', () => {
      const ws = m.el.querySelector('#so-ws').value || '09:00';
      const we = m.el.querySelector('#so-we').value || '17:00';
      if (toMin(we) <= toMin(ws)) { toast('End time must be after start time ⚠'); return; }
      so = setSoState({ workStart: ws, workEnd: we, commute, lunch });
      ap = planForToday();
      paintOcc(); paintJourney(); paintDiscipline();
      m.close();
      toast('Schedule rebuilt around your real day 💪');
      haptic(15);
    });
    m.el.querySelector('#so-occ-reset').addEventListener('click', () => {
      so = setSoState({ workStart: occ.start, workEnd: occ.end, commute: occ.commute, lunch: occ.lunch });
      ap = planForToday();
      paintOcc(); paintJourney(); paintDiscipline();
      m.close();
      toast('Back to the standard day ✓');
    });
  };

  $('#so-occ').addEventListener('click', e => {
    const pick = e.target.closest('[data-occ]');
    if (pick) {
      const o = SO_OCCUPATIONS.find(x => x.id === pick.dataset.occ);
      if (!o) return;
      const first = !so.occupation;
      so = setSoState({
        occupation: o.id,
        ...(o.job ? { workStart: o.start, workEnd: o.end, commute: o.commute, lunch: o.lunch } : {}),
      });
      ap = planForToday();
      picking = false;
      paintOcc(); paintJourney(); paintDiscipline();
      if (first) { addXP(5); confetti(); }
      toast(`${o.emoji} ${o.name} — schedule rebuilt around your job${first ? ' · +5 XP 🎖️' : ''}`);
      haptic(15);
      return;
    }
    if (e.target.closest('[data-occ-back]')) { picking = false; paintOcc(); return; }
    if (e.target.closest('[data-occ-swap]')) { picking = true; paintOcc(); haptic(10); return; }
    const hbtn = e.target.closest('[data-occ-holiday]');
    if (hbtn) {
      const h = { ...(so.holiday || {}), [dayKey()]: !isHoliday() };
      so = setSoState({ holiday: h });
      ap = planForToday();
      paintOcc(); paintJourney(); paintDiscipline();
      toast(h[dayKey()] ? '🕊️ बिदा mode — full-power day plan loaded' : 'Working-day schedule restored 💪');
      haptic(12);
      return;
    }
    if (e.target.closest('[data-occ-edit]')) openOccEdit();
  });

  // ---------- study techniques: 20 world-class methods ----------
  let teqCat = 'all';
  const teqMastered = () => Object.keys(so.teq || {}).filter(k => so.teq[k] && k !== 'all').length;

  const paintTeq = () => {
    const mastered = teqMastered();
    $('#so-teq-x').textContent = `${mastered}/${SO_TECHNIQUES.length} mastered`;
    // daily spotlight — rotates every day, prefers an unmastered technique
    const start = Math.floor(Date.now() / 864e5) % SO_TECHNIQUES.length;
    let spot = null;
    for (let i = 0; i < SO_TECHNIQUES.length; i++) {
      const t = SO_TECHNIQUES[(start + i) % SO_TECHNIQUES.length];
      if (!so.teq?.[t.id]) { spot = t; break; }
    }
    spot = spot || SO_TECHNIQUES[start];
    const list = teqCat === 'all' ? SO_TECHNIQUES : SO_TECHNIQUES.filter(t => t.cat === teqCat);
    $('#so-teq').innerHTML = `
      <div class="so-spot so-fade" data-teq="${spot.id}">
        <div class="so-spot-shine"></div>
        <div class="row" style="gap:12px;align-items:center">
          <div class="so-spot-tile">${spot.e}</div>
          <div style="min-width:0;flex:1">
            <div class="so-spot-eyebrow">TODAY\u2019S POWER TECHNIQUE</div>
            <div style="font-weight:800;font-size:15.5px">${esc(spot.name)}</div>
            <div class="small muted">${esc(spot.tag)}</div>
          </div>
          <div style="color:var(--muted);flex:none">${icon('chev')}</div>
        </div>
      </div>
      <div class="chips mt-10" id="so-teq-cats">
        ${SO_TEQ_CATS.map(c => `<button class="chip ${teqCat === c.id ? 'on' : ''}" data-tcat="${c.id}">${c.e} ${esc(c.n)}</button>`).join('')}
      </div>
      <div class="so-teq-grid mt-10">
        ${list.map((t, i) => `
          <button class="so-teq-card so-fade ${so.teq?.[t.id] ? 'done' : ''}" data-teq="${t.id}" style="animation-delay:${.06 + i * .04}s">
            ${so.teq?.[t.id] ? '<span class="donetick">✓</span>' : ''}
            <span class="tile t-${t.cat}">${t.e}</span>
            <span class="n">${esc(t.name)}</span>
            <span class="d">${esc(t.ne)}</span>
            <span class="d" style="opacity:.85">${esc(t.catN)}</span>
          </button>`).join('')}
      </div>`;
  };

  const openTeq = id => {
    const t = SO_TECHNIQUES.find(x => x.id === id);
    if (!t) return;
    const m = openModal(`
      <div class="so-teq-head">
        <span class="tile t-${t.cat} big">${t.e}</span>
        <div style="min-width:0">
          <h2 style="font-size:20px;font-weight:800">${esc(t.name)}</h2>
          <div class="small muted">${esc(t.ne)} · ${esc(t.catN)}</div>
        </div>
      </div>
      <div class="so-why mt-14"><b>WHY IT WORKS</b>${esc(t.why)}</div>
      <div class="mt-14">
        <div style="font-weight:800;font-size:13.5px">How to run it</div>
        <ol class="so-steps mt-8">${t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      </div>
      <div class="row mt-14" style="gap:6px;flex-wrap:wrap">
        ${t.best.map(b => `<span class="so-mini">${esc(b)}</span>`).join('')}
      </div>
      <div class="so-tipbox mt-14">💡 ${esc(t.tip)}</div>
      <button class="btn wide primary mt-14" id="so-teq-btn"></button>
      <button class="btn wide ghost mt-8" data-close>Close</button>
    `);
    const btn = m.el.querySelector('#so-teq-btn');
    const paintBtn = () => {
      const done = !!so.teq?.[t.id];
      btn.textContent = done ? '✓ Mastered — tap to undo' : 'Mark as mastered · +10 XP';
      btn.classList.toggle('mastered', done);
    };
    paintBtn();
    btn.addEventListener('click', () => {
      const teq = { ...(so.teq || {}) };
      const was = !!teq[t.id];
      if (was) delete teq[t.id];
      else {
        teq[t.id] = true;
        addXP(10);
        toast(`🧠 ${t.name} mastered — marks incoming! +10 XP`);
        haptic(18);
      }
      so = setSoState({ teq });
      const n = teqMastered();
      if (n === SO_TECHNIQUES.length && !teq.all) {
        teq.all = true;
        so = setSoState({ teq });
        addXP(50);
        confetti();
        toast('🏆 All 20 techniques mastered — you study like a topper! +50 XP');
      }
      paintBtn();
      paintTeq();
    });
  };

  $('#so-teq').addEventListener('click', e => {
    const cat = e.target.closest('[data-tcat]');
    if (cat) { teqCat = cat.dataset.tcat; paintTeq(); haptic(8); return; }
    const card = e.target.closest('[data-teq]');
    if (card) openTeq(card.dataset.teq);
  });

  // ---------- paper modal ----------
  const openPaper = pid => {
    const p = SO_PAPERS.find(x => x.id === pid);
    if (!p) return;
    const before = paperDone(so, p);
    const modal = openModal(`
      <div style="font-size:36px">${p.emoji}</div>
      <h2 style="font-size:21px;font-weight:800;margin-top:6px">${esc(p.name)}</h2>
      <div class="small muted">${esc(p.ne)} · ${p.marks} marks · ${esc(p.time)} · ${esc(p.q)} · pass ${p.pass}</div>
      <div class="bar mt-14"><i id="so-m-bar"></i></div>
      <div class="small muted mt-8" id="so-m-count"></div>
      <div class="small muted mt-8" style="line-height:1.5">${esc(p.note)}</div>
      <div class="mt-14" id="so-m-list"></div>
      <button class="btn wide ghost mt-14" data-close>Close</button>
    `, { onClose: () => paintPapers() });
    const list = modal.el.querySelector('#so-m-list');
    const mBar = modal.el.querySelector('#so-m-bar');
    const mCount = modal.el.querySelector('#so-m-count');

    const paintModal = () => {
      const done = paperDone(so, p);
      mBar.style.width = `${(done / p.topics.length) * 100}%`;
      mCount.textContent = `${done} / ${p.topics.length} topics done — ${Math.round((done / p.topics.length) * 100)}%`;
      list.innerHTML = p.topics.map(t => `
        <div class="so-topic ${so.topics[t.id] ? 'on' : ''}" data-topic="${t.id}">
          <div class="box">✓</div><div class="txt">${esc(t.t)}</div>
        </div>`).join('');
    };
    paintModal();

    list.addEventListener('click', e => {
      const row = e.target.closest('[data-topic]');
      if (!row) return;
      const id = row.dataset.topic;
      const wasOn = !!so.topics[id];
      if (wasOn) delete so.topics[id]; else so.topics[id] = true;
      so = setSoState({ topics: so.topics });
      row.classList.toggle('on', !wasOn);
      haptic(10);
      const done = paperDone(so, p);
      mBar.style.width = `${(done / p.topics.length) * 100}%`;
      mCount.textContent = `${done} / ${p.topics.length} topics done — ${Math.round((done / p.topics.length) * 100)}%`;
      if (!wasOn) {
        addXP(4);
        if (done === p.topics.length && before < p.topics.length) {
          confetti();
          addXP(20);
          toast(`${p.name} complete! 🎉 +20 XP`);
        }
      }
    });
  };

  // ---------- tips modal ----------
  const openTip = id => {
    const t = SO_TIPS.find(x => x.id === id);
    if (!t) return;
    openModal(`
      <div style="font-size:36px">${t.e}</div>
      <h2 style="font-size:21px;font-weight:800;margin-top:6px">${esc(t.t)}</h2>
      <ul class="book-lessons mt-14">${t.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
      <button class="btn wide ghost mt-14" data-close>Close</button>
    `);
  };

  // ---------- build papers list ----------
  const papersBox = $('#so-papers');
  papersBox.innerHTML = SO_PAPERS.map((p, i) => {
    const done = paperDone(so, p);
    const pct = Math.round((done / p.topics.length) * 100);
    return `
    <div class="card so-paper so-fade" data-paper="${p.id}" style="animation-delay:${.14 + i * .05}s">
      <span class="so-tag">${esc(p.tag)}</span>
      <div class="row">
        <div style="font-size:27px">${p.emoji}</div>
        <div style="min-width:0"><div style="font-weight:800">${esc(p.name)}</div>
        <div class="small muted">${esc(p.ne)}</div></div>
      </div>
      <div class="row small muted mt-8" style="gap:8px;flex-wrap:wrap">
        <span class="so-mini">${p.marks} marks</span><span class="so-mini">${esc(p.time)}</span><span class="so-mini">${esc(p.q)}</span>
      </div>
      <div class="bar mt-10"><i style="width:${pct}%"></i></div>
      <div class="row between mt-8">
        <span class="small muted" data-count>${done}/${p.topics.length} topics</span>
        <span class="small" data-pct style="color:var(--accent-1);font-weight:800">${pct}%</span>
      </div>
    </div>`;
  }).join('');
  papersBox.querySelectorAll('[data-paper]').forEach(card => {
    const id = card.dataset.paper;
    paperEls[id] = {
      bar: card.querySelector('.bar > i'),
      count: card.querySelector('[data-count]'),
      pct: card.querySelector('[data-pct]'),
    };
    card.addEventListener('click', () => openPaper(id));
  });

  // ---------- events ----------
  $('#so-journey').querySelectorAll('.so-logbtn').forEach(b => b.addEventListener('click', () => {
    if (!so.started) so.started = dayKey();
    so.hours[dayKey()] = (so.hours[dayKey()] || 0) + Number(b.dataset.min);
    so = setSoState({ started: so.started, hours: so.hours });
    addXP(Number(b.dataset.min) >= 30 ? 3 : 1);
    paintJourney();
    toast(`+${b.dataset.min}m logged — keep going 💪`);
    haptic(12);
  }));

  dateIn.addEventListener('change', () => {
    so = setSoState({ examDate: dateIn.value || null });
    paintJourney();
    if (dateIn.value) toast('Exam date set — the countdown is live 🎯');
  });

  $('#so-plan-chips').addEventListener('click', e => {
    const chip = e.target.closest('[data-plan]');
    if (!chip) return;
    so = setSoState({ plan: chip.dataset.plan });
    paintPlan();
  });
  $('#so-tiers').addEventListener('click', e => {
    const tier = e.target.closest('[data-tier]');
    if (!tier) return;
    so = setSoState({ plan: tier.dataset.tier });
    paintPlan();
    toast(`${planOf().emoji} ${planOf().name} plan selected — ${planOf().hours}h/day`);
  });

  discBox.addEventListener('click', e => {
    const row = e.target.closest('[data-disc]');
    if (!row) return;
    const i = Number(row.dataset.disc);
    const k = dayKey();
    so.disc[k] = so.disc[k] || {};
    const on = !so.disc[k][i];
    if (on) so.disc[k][i] = true; else delete so.disc[k][i];
    so = setSoState({ disc: so.disc });
    row.classList.toggle('on', on);
    haptic(10);
    paintDiscipline();
    const day = discDay();
    const all = SO_DISCIPLINE.filter((_, j) => day[j]).length === SO_DISCIPLINE.length;
    if (all && !day.done) {
      so.disc[k].done = true;
      so = setSoState({ disc: so.disc });
      addXP(20);
      confetti();
      toast('Full discipline day! +20 XP 🏅');
    } else if (on) {
      addXP(2);
    }
  });

  $('#so-quote-card').addEventListener('click', () => {
    qi = (qi + 1) % SO_MOTIVATION.length;
    paintQuote();
    haptic(8);
  });
  $('#so-affirms').addEventListener('click', e => {
    const chip = e.target.closest('.so-afchip');
    if (chip) toast(chip.textContent.trim());
  });

  ansBtn.addEventListener('click', () => {
    so.answers[dayKey()] = (so.answers[dayKey()] || 0) + 1;
    so = setSoState({ answers: so.answers });
    addXP(5);
    paintAnswers();
    ansBtn.classList.remove('pop');
    requestAnimationFrame(() => ansBtn.classList.add('pop'));
    toast('Answer written — 1 step closer ✍️');
    haptic(14);
  });

  $('#so-tips').addEventListener('click', e => {
    const row = e.target.closest('[data-tip]');
    if (row) openTip(row.dataset.tip);
  });

  // ---------- first paint ----------
  paintPapers();
  paintPlan();
  paintDiscipline();
  paintAnswers();
  paintQuote();
  paintJourney();
  paintOcc();
  paintTeq();

  // live clock — auto-stops when the view leaves the DOM
  if (soTicker) clearInterval(soTicker);
  soTicker = setInterval(() => {
    const c = document.getElementById('so-clock');
    if (!c || !c.isConnected) { clearInterval(soTicker); soTicker = null; return; }
    paintNow();
  }, 30000);
}
