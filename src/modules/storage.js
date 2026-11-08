// Tiny localStorage wrapper + progress math. No database — everything lives on-device.

const KEY = k => `bb.${k}`;

export function get(k, fallback) {
  try {
    const v = localStorage.getItem(KEY(k));
    return v === null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}
export function set(k, v) { localStorage.setItem(KEY(k), JSON.stringify(v)); }
export function del(k) { localStorage.removeItem(KEY(k)); }

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ---------- daily log ----------
export function getLog() { return get('log', {}); }
export function todayLog() {
  const log = getLog();
  const k = dayKey();
  if (!log[k]) log[k] = { min: 0, cal: 0, sessions: 0, kinds: {} };
  return log[k];
}
export function addSession(kind, minutes, kcal) {
  const log = getLog();
  const k = dayKey();
  const day = log[k] || { min: 0, cal: 0, sessions: 0, kinds: {} };
  day.min = +(day.min + minutes).toFixed(1);
  day.cal = Math.round(day.cal + kcal);
  day.sessions += 1;
  day.kinds[kind] = (day.kinds[kind] || 0) + 1;
  log[k] = day;
  set('log', log);
}

// ---------- cumulative stats ----------
export function getStats() {
  return get('stats', { workouts: 0, meditations: 0, dances: 0, gratitude: 0, waterPerfect: 0, kcal: 0, min: 0 });
}
export function bumpStat(key, n = 1) {
  const s = getStats();
  s[key] = (s[key] || 0) + n;
  set('stats', s);
}

// ---------- XP / level ----------
import { LEVELS } from '../data/content.js';
export function getXP() { return get('xp', 0); }
export function addXP(n) { set('xp', getXP() + n); }
export function levelInfo(xp = getXP()) {
  let li = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.at) li = i; });
  const cur = LEVELS[li];
  const next = LEVELS[li + 1];
  const pct = next ? Math.min(100, Math.round(((xp - cur.at) / (next.at - cur.at)) * 100)) : 100;
  return { index: li, name: cur.name, xp, next: next?.at ?? null, pct };
}

// ---------- streak ----------
export function getStreak() {
  const log = getLog();
  let streak = 0;
  const d = new Date();
  if (!isActive(log[dayKey(d)])) d.setDate(d.getDate() - 1);
  while (isActive(log[dayKey(d)])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
const isActive = day => day && (day.sessions > 0 || day.min > 0);

// ---------- settings ----------
export const DEFAULT_SETTINGS = {
  name: '', theme: 'dark', gender: 'male', voice: true, sfx: true,
  keepAwake: true, waterRemind: false, haptics: true, lang: 'en',
  stepGoal: 8000, stride: 0.7,   // pedometer: daily steps & stride length (m)
};
export function getSettings() { return { ...DEFAULT_SETTINGS, ...get('settings', {}) }; }
export function saveSettings(patch) { set('settings', { ...getSettings(), ...patch }); }

// ---------- water ----------
export function getWater(k = dayKey()) { return get('water', {})[k] || 0; }
export function setWater(n, k = dayKey()) {
  const w = get('water', {});
  const prev = w[k] || 0;
  w[k] = Math.max(0, Math.min(12, n));
  if (prev < 8 && w[k] >= 8) bumpStat('waterPerfect');
  set('water', w);
}

// ---------- gratitude ----------
export function getGratitude() { return get('gratitude', []); }
export function addGratitude(text) {
  const g = getGratitude();
  g.unshift({ date: dayKey(), text, at: Date.now() });
  set('gratitude', g.slice(0, 200));
  bumpStat('gratitude');
}

// ---------- daily mantra ----------
export function getMantraDone() { return get('mantraDone', {}); }
export function setMantraDone(done) {
  const m = getMantraDone();
  m[dayKey()] = done;
  set('mantraDone', m);
  if (done) bumpStat('mantras');
}
export function isMantraDone() {
  const m = getMantraDone();
  return !!m[dayKey()];
}

// ---------- chanting / mala ----------
export function getChantLog() { return get('chantLog', []); }
export function addChantSession(count, mantra) {
  const log = getChantLog();
  log.push({ date: dayKey(), at: Date.now(), count, mantra });
  set('chantLog', log.slice(-500));
  bumpStat('chanting');
}

// ---------- mala preferences ----------
export function getMalaPrefs() { return get('malaPrefs', { mantra: 'Om Namaḥ Śivāya', target: 108 }); }
export function setMalaPrefs(p) { set('malaPrefs', { ...getMalaPrefs(), ...p }); }

// ---------- custom mantras ----------
export function getCustomMantras() { return get('customMantras', []); }
export function addCustomMantra(text) {
  const arr = getCustomMantras();
  const t = String(text).trim();
  if (!t || arr.includes(t)) return arr;
  arr.push(t);
  set('customMantras', arr);
  return arr;
}
export function removeCustomMantra(text) {
  const arr = getCustomMantras().filter(m => m !== text);
  set('customMantras', arr);
  return arr;
}

// ---------- GharGym (household equipment gym) ----------
export function getGharDone(k = dayKey()) { return get('gharDone', {})[k] || {}; }
export function markGharDone(id) {
  const m = get('gharDone', {});
  const k = dayKey();
  m[k] = m[k] || {};
  if (m[k][id]) return false;
  m[k][id] = true;
  set('gharDone', m);
  bumpStat('gharGym');
  addXP(8);
  return true;
}

// ---------- fasting ----------
// fastState: { [dayKey]: { on: true } } — manual "I am fasting today" marks.
export function getFastState() { return get('fastState', {}); }
export function toggleFastToday(on = null) {
  const st = getFastState();
  const k = dayKey();
  st[k] = { ...(st[k] || {}), on: on === null ? !st[k]?.on : !!on };
  set('fastState', st);
  return st[k].on;
}
// fastPatterns: array of weekday indexes (0–6) kept as personal weekly fasts.
export function getFastPatterns() { return get('fastPatterns', []); }
export function toggleFastPattern(dow) {
  const p = getFastPatterns();
  const i = p.indexOf(dow);
  if (i >= 0) p.splice(i, 1); else p.push(dow);
  set('fastPatterns', p.slice().sort((a, b) => a - b));
  return p.includes(dow);
}

// ---------- challenges ----------
export function getChallengeState() {
  return get('challenge', {});
}
export function completeChallenge(xp) {
  const st = getChallengeState();
  const k = dayKey();
  if (st[k]?.done) return false;
  st[k] = { done: true, xp };
  set('challenge', st);
  addXP(xp);
  return true;
}

// ---------- steps (offline pedometer) ----------
// One running total per day. The engine adds into it live while counting,
// manual entry uses the same path. Milestones (halfway, goal) are tracked as
// 'bb.stepFlags' so the +10 XP goal bonus can't be re-farmed within a day.
export function getSteps(k = dayKey()) { return get('steps', {})[k] || 0; }
export function getStepGoal() { return getSettings().stepGoal || 8000; }
export function getStride() { return getSettings().stride || 0.7; }
export function setSteps(n, k = dayKey()) {
  const s = get('steps', {});
  s[k] = Math.max(0, Math.round(n));
  set('steps', s);
  return s[k];
}
export function addSteps(n, k = dayKey()) { return setSteps(getSteps(k) + Math.round(n), k); }
export function stepStats() {
  const s = get('steps', {});
  let total = 0, best = 0;
  for (const v of Object.values(s)) { total += v; if (v > best) best = v; }
  return { total, best };
}
// distance (km) & energy estimate for a step count — walking ≈ 1 kcal/kg/km
export function stepsToKm(steps) { return (steps * getStride()) / 1000; }
export function stepsToKcal(km) {
  const weight = getSettings().bmiW || 65;
  return Math.round(weight * km);
}

// ---------- export ----------
export function exportData() {
  const dump = {};
  ['settings', 'log', 'stats', 'xp', 'water', 'gratitude', 'challenge', 'mantraDone', 'chantLog', 'malaPrefs', 'customMantras', 'gharDone', 'fastState', 'fastPatterns', 'steps', 'stepFlags'].forEach(k => { dump[k] = get(k); });
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `biggerbody-backup-${dayKey()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function resetAll() {
  ['settings', 'log', 'stats', 'xp', 'water', 'gratitude', 'challenge', 'quote', 'mantraDone', 'chantLog', 'malaPrefs', 'customMantras', 'gharDone', 'fastState', 'fastPatterns', 'steps', 'stepFlags'].forEach(del);
}
