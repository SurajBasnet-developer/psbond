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
  // today counts if logged; otherwise streak can still be alive from yesterday
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
  keepAwake: true, waterRemind: false, haptics: true,
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

// ---------- challenges ----------
export function getChallengeState() {
  return get('challenge', {}); // { '2026-11-04': {done: true, xp: 30} }
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

// ---------- export ----------
export function exportData() {
  const dump = {};
  ['settings', 'log', 'stats', 'xp', 'water', 'gratitude', 'challenge'].forEach(k => { dump[k] = get(k); });
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `biggerbody-backup-${dayKey()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function resetAll() {
  ['settings', 'log', 'stats', 'xp', 'water', 'gratitude', 'challenge', 'quote'].forEach(del);
}
