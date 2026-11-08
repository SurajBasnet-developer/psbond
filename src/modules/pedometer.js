// Offline pedometer — counts steps from the device motion sensor, no backend.
//
// Honest limits: browsers pause JS when the screen is off, and no web API
// exposes the OS step counter. So this is a session counter: the user taps
// Start, walks with the phone (screen kept awake via the Wake Lock API when
// the setting allows), and taps Stop. Every step is added to the day's total
// in storage ('bb.steps'), and a manual-entry fallback covers watches,
// desktops and permission-denied devices.
//
// Detection is a zero-crossing peak detector on the accelerometer magnitude:
// low-pass filter for gravity → high-pass swing → count each descent through
// zero whose peak passes an adaptive (EMA) amplitude threshold, with a hard
// 300 ms floor between steps (~200 steps/min max).

import { toast } from '../ui/dom.js';
import { t } from '../i18n.js';
import { addSteps, getSteps, set, get, addXP, bumpStat, dayKey, getStepGoal, getSettings } from './storage.js';

const MIN_INTERVAL = 300;    // ms between steps
const SENSOR_TIMEOUT = 2500; // ms to wait for the first real sample

let counting = false;
let sessionSteps = 0;
let denied = false;
let missing = false;

let handler = null;
let wakeLock = null;
let noSensorTimer = null;

// detector state
let lp = 0, hpPrev = 0, peakAmp = 0, avgPeak = 1.8, lastStepAt = 0;
let hadSample = false;

const listeners = new Set();

export function isCounting() { return counting; }
export function getSessionSteps() { return sessionSteps; }
export function isSupported() {
  return typeof window !== 'undefined' &&
    (('ondevicemotion' in window) || ('Accelerometer' in window));
}
export function status() { return { counting, supported: isSupported(), denied, missing }; }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() {
  const n = { counting, session: sessionSteps, denied, missing };
  listeners.forEach(f => { try { f(n); } catch { /* listener error */ } });
}

async function requestPermission() {
  const DM = window.DeviceMotionEvent;
  if (!DM) return false;
  // iOS 13+: permission must be requested from inside a user gesture (a tap).
  if (typeof DM.requestPermission === 'function') {
    try { return (await DM.requestPermission()) === 'granted'; } catch { return false; }
  }
  return true; // Android & others grant implicitly
}

export async function start() {
  if (counting) return true;
  if (!isSupported()) { missing = true; toast(t('No motion sensor on this device — add steps manually.')); emit(); return false; }
  const ok = await requestPermission();
  if (!ok) { denied = true; toast(t('Motion permission denied — you can add steps manually.')); emit(); return false; }

  sessionSteps = 0;
  missing = false;
  lp = 0; hpPrev = 0; peakAmp = 0; avgPeak = 1.8; lastStepAt = 0; hadSample = false;

  handler = onMotion;
  window.addEventListener('devicemotion', handler);

  // Something concrete within SENSOR_TIMEOUT, or the device has no sensor
  // in practice (some desktops expose the event but never fire real values).
  if (noSensorTimer) clearTimeout(noSensorTimer);
  noSensorTimer = setTimeout(() => {
    if (counting && !sessionSteps && !hadSample) failNoSensor();
  }, SENSOR_TIMEOUT);

  counting = true;
  if (getSettings().keepAwake) {
    try { wakeLock = await navigator.wakeLock?.request('screen'); } catch { /* noop */ }
  }
  emit();
  return true;
}

export function stop() {
  if (handler) window.removeEventListener('devicemotion', handler);
  handler = null;
  if (noSensorTimer) { clearTimeout(noSensorTimer); noSensorTimer = null; }
  try { wakeLock?.release(); } catch { /* noop */ }
  wakeLock = null;
  counting = false;
  emit();
  return sessionSteps;
}

function failNoSensor() {
  stop();
  missing = true;
  toast(t('No motion sensor on this device — add steps manually.'));
  emit();
}

// One entry path for both the sensor and manual input — it keeps the halfway
// & goal milestones (and their one-per-day XP) authoritative in this module.
export function recordSteps(n, { silent = false } = {}) {
  addSteps(n);
  if (!silent) emit();
  milestones();
}

// ---------- milestone celebration (once per day each) ----------
function milestones() {
  const k = dayKey();
  const after = getSteps(k);
  const goal = getStepGoal();
  const map = get('stepFlags', {});
  const f = (map[k] = map[k] || {});
  let half = false, goalHit = false;
  if (!f.half && after >= goal / 2) { f.half = 1; half = true; }
  if (!f.goal && after >= goal) { f.goal = 1; goalHit = true; addXP(10); bumpStat('goalSteps'); }
  if (half || goalHit) {
    map[k] = f;
    set('stepFlags', map);
    if (half) toast(t('Halfway to your step goal! 🚶'));
    if (goalHit) toast(t('Step goal reached! +10 XP 👟'));
  }
}

function onMotion(e) {
  if (!counting) return;
  const a = e.accelerationIncludingGravity;
  if (!a || a.x == null) return;
  const mag = Math.hypot(a.x, a.y || 0, a.z || 0);
  if (!mag || !isFinite(mag)) return;
  if (!hadSample) { hadSample = true; if (noSensorTimer) { clearTimeout(noSensorTimer); noSensorTimer = null; } lp = mag; }

  lp += (mag - lp) * 0.12;      // slow filter — tracks gravity/orientation drift
  const hp = mag - lp;          // fast swing around it
  if (hp > peakAmp) peakAmp = hp;

  const now = performance.now();
  if (hpPrev > 0 && hp <= 0) {  // completed an upswing — grade it
    const thresh = Math.max(0.8, avgPeak * 0.35);
    if (peakAmp >= thresh && now - lastStepAt >= MIN_INTERVAL) {
      lastStepAt = now;
      avgPeak = avgPeak * 0.88 + peakAmp * 0.12;  // adapt to gait & pocket
      sessionSteps++;
      recordSteps(1, { silent: true });
      emit();
    }
    peakAmp = 0;
  }
  hpPrev = hp;
}
