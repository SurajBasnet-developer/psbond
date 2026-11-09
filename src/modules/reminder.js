// 🔔 Daily date notification — puts today's date in the device's
// notification shade on Android & iOS. Works with the installed PWA:
// Android (Chrome/Edge) always; iOS 16.4+ when added to the Home Screen.
// No server needed — the date is built on-device from the same calendar
// module the whole app uses.
import { get, set, getSettings, saveSettings, dayKey } from './storage.js';
import { dateLine } from './dateline.js';
import { t } from '../i18n.js';

export const supported = () => typeof Notification !== 'undefined' && 'serviceWorker' in navigator;

const timeOf = s => {
  const [h, m] = (s.dateNotifTime || '07:30').split(':').map(Number);
  return { h: h || 7, m: m || 30 };
};

export async function requestPermission() {
  if (!supported()) throw new Error('unsupported');
  if (Notification.permission === 'granted') return 'granted';
  const p = await Notification.requestPermission();
  return p; // 'granted' | 'denied' | 'default'
}

async function post(title, body) {
  // service-worker notification (so it blends into the OS shade on both platforms)
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, {
        body, tag: 'bb-date', icon: nameIcon(),
      });
      return true;
    }
  } catch { /* fall through to page notification */ }
  try { new Notification(title, { body, icon: nameIcon() }); return true; }
  catch { return false; }
}

const nameIcon = () => '/icons/logo-192.png';


export function notificationText() {
  const name = (getSettings().name || '').trim();
  return {
    title: name ? `🕉️ ${name}, today is…` : '🕉️ BiggerBody — today',
    body: dateLine() + ' — ' + t('train, meditate, grow'),
  };
}

async function showToday() {
  const { title, body } = notificationText();
  await post(title, body);
  set('notifShown', dayKey());
  scheduleNext(); // arm tomorrow
}

let timer = null;

export function scheduleNext() {
  clearTimeout(timer);
  const s = getSettings();
  if (!s.dateNotif || !supported() || Notification.permission !== 'granted') return;
  const { h, m } = timeOf(s);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  timer = setTimeout(showToday, target - now);
}

// on boot: catch up if we missed today's note, then arm the timer
export function init() {
  const s = getSettings();
  if (!s.dateNotif || !supported() || Notification.permission !== 'granted') return;
  const { h, m } = timeOf(s);
  const now = new Date();
  const missedToday =
    get('notifShown', '') !== dayKey() &&
    now.getHours() * 60 + now.getMinutes() >= h * 60 + m;
  if (missedToday) showToday();
  else scheduleNext();
}

// settings helpers
export async function enable() {
  const p = await requestPermission();
  if (p !== 'granted') return p;
  saveSettings({ dateNotif: true });
  scheduleNext();
  await showToday(); // immediate confirmation — the date lands in the shade now
  return p;
}

export function disable() {
  saveSettings({ dateNotif: false });
  clearTimeout(timer);
}

export async function test() {
  const p = await requestPermission();
  if (p !== 'granted') return p;
  saveSettings({ dateNotif: true });
  const { title, body } = notificationText();
  await post(title, body);
  set('notifShown', dayKey());
  scheduleNext();
  return p;
}
