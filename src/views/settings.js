// Settings — profile, theme, premium feature list, install, about.
import { el, icon, toast, esc } from '../ui/dom.js';
import { getSettings, saveSettings, resetAll, getStats, getXP, get } from '../modules/storage.js';
import { PREMIUM_FEATURES } from '../data/content.js';
import { t, setLang, applyChrome } from '../i18n.js';
import { supported as notifSupported, enable as enableNotif, disable as disableNotif, test as testNotif, scheduleNext as scheduleNotif } from '../modules/reminder.js';
import { CITIES, getLoc, setGps, clearGps, getWeather, codeInfo } from '../modules/weather.js';

export let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

export function render(view) {
  const s = getSettings();
  const stats = getStats();

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('settings')} ${esc(t('Settings'))}</div></div>

    <div class="card">
      <div class="card-title">${esc(t('Language'))}</div>
      <div class="chips" style="padding-bottom:2px">
        ${[['en', 'English'], ['ne', 'नेपाली']].map(([id, label]) => `
          <button class="chip ${s.lang === id ? 'on' : ''}" data-lang="${id}">${label}</button>`).join('')}
      </div>
      <div class="small muted mt-8">${esc(t('Switch the app interface. Suggestions like quotes and tips stay bilingual.'))}</div>
    </div>

    <div class="card">
      <div class="card-title">${esc(t('Your profile'))}</div>
      <div class="field"><label>${esc(t('Name'))}</label><input id="st-name" placeholder="${esc(t('Your name'))}" value="${s.name || ''}"></div>
      <div class="field"><label>${esc(t('Default coach on Home'))}</label>
        <select id="st-gender">
          <option value="male" ${s.gender === 'male' ? 'selected' : ''}>${esc(t('💪 Male coach'))}</option>
          <option value="female" ${s.gender === 'female' ? 'selected' : ''}>${esc(t('🌸 Female coach'))}</option>
        </select>
      </div>
    </div>

    <div class="card mt-14">
      <div class="card-title">${esc(t('Experience'))}</div>
      <div class="setting-row"><div><div class="t">${esc(t('Dark theme'))}</div><div class="d">${esc(t('Premium night look'))}</div></div><button class="switch ${s.theme !== 'light' ? 'on' : ''}" data-set="theme"></button></div>
      <div class="setting-row"><div><div class="t">${esc(t('Voice coaching'))}</div><div class="d">${esc(t('Speaks each exercise aloud'))}</div></div><button class="switch ${s.voice ? 'on' : ''}" data-set="voice"></button></div>
      <div class="setting-row"><div><div class="t">${esc(t('Sound effects'))}</div><div class="d">${esc(t('Beeps for work & rest phases'))}</div></div><button class="switch ${s.sfx ? 'on' : ''}" data-set="sfx"></button></div>
      <div class="setting-row"><div><div class="t">${esc(t('Keep screen awake'))}</div><div class="d">${esc(t('During workouts'))}</div></div><button class="switch ${s.keepAwake ? 'on' : ''}" data-set="keepAwake"></button></div>
      <div class="setting-row"><div><div class="t">${esc(t('Haptics'))}</div><div class="d">${esc(t('Gentle vibration on changes'))}</div></div><button class="switch ${s.haptics ? 'on' : ''}" data-set="haptics"></button></div>
    </div>

    <div class="card mt-14" id="date-notif-card" style="border-color:rgba(250,200,80,.4)">
      <div class="card-title">${esc(t('Date notice — Android & iOS'))}</div>
      <div class="setting-row"><div><div class="t">${esc(t('Daily date notification'))}</div><div class="d">${esc(t("Today's Nepali + English date, in your device's notification shade"))}</div></div><button class="switch ${s.dateNotif ? 'on' : ''}" id="notif-switch"></button></div>
      <div class="field mt-14" style="margin-bottom:0"><label>${esc(t('Reminder time'))}</label><input id="notif-time" type="time" value="${s.dateNotifTime || '07:30'}"></div>
      <div class="row mt-14" style="gap:8px">
        <button class="btn" id="notif-test">${icon('sparkle')} ${esc(t('Test now'))}</button>
      </div>
      <div class="small muted mt-8">${icon('calendar')} ${esc(t('The date is also pinned at the top of every screen. Notifications need an installed app on iOS 16.4+ (Add to Home Screen); Android works out of the box. Fired daily while the app runs in the background — no server, always free.'))}</div>
    </div>

    <div class="card mt-14" id="wx-card" style="border-color:rgba(120,180,255,.4)">
      <div class="card-title">${esc(t('🌤️ Weather'))}</div>
      <div class="field" style="margin-top:10px"><label>${esc(t('Your city'))}</label>
        <select id="wx-city">
          ${get('wxLoc', null) ? `<option value="__gps" selected>📍 ${esc(t('My location (GPS)'))}</option>` : ''}
          ${CITIES.map(c => `<option value="${c.id}" ${!get('wxLoc', null) && (s.wxCity || 'ktm') === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
        </select>
      </div>
      <div class="row mt-10" style="gap:8px">
        <button class="btn" id="wx-gps">📍 ${esc(t('Use my location'))}</button>
        <button class="btn" id="wx-refresh">🔄 ${esc(t('Refresh now'))}</button>
      </div>
      <div class="setting-row mt-10"><div><div class="t">${esc(t('Extra water on hot days'))}</div><div class="d">${esc(t('Goal moves from 8 to 10 glasses when it is 28°C or hotter'))}</div></div><button class="switch ${s.wxAutoWater !== false ? 'on' : ''}" id="wx-water-switch"></button></div>
      <div class="small muted mt-10" id="wx-preview">${esc(t('Loading your sky…'))}</div>
      <div class="small muted mt-8">${icon('sparkle')} ${esc(t('Free Open-Meteo service, no key needed. Data is cached on your device — offline it shows your last sky.'))}</div>
    </div>

    <div class="card mt-14" id="install-card" style="border-color:rgba(255,154,107,.4)">
      <div class="card-title">${esc(t('Install the app'))}</div>
      <div class="small muted">${esc(t('Add BiggerBody to your home screen on Android, iOS, Windows, macOS or Linux — full screen, offline, instant.'))}</div>
      <button class="btn primary wide mt-14" id="install-btn">${icon('download')} ${esc(t('Install BiggerBody'))}</button>
      <div class="small muted center mt-8" id="install-hint"></div>
    </div>

    <div class="section-title">${esc(t('✨ Included premium features'))}</div>
    <div class="card">
      ${PREMIUM_FEATURES.map(([e, t, d]) => `
        <div class="feat"><div class="e">${e}</div><div><div class="t">${t}</div><div class="d">${d}</div></div></div>`).join('')}
      <div class="center small muted mt-14">All ${PREMIUM_FEATURES.length} features are included and unlocked — forever free. 💛</div>
    </div>

    <div class="card mt-14 center">
      <img src="/icons/logo-512.png" alt="BiggerBody" style="width:76px;height:76px;border-radius:20px;margin:0 auto 12px;box-shadow:0 10px 30px rgba(255,94,125,.3)">
      <div style="font-weight:800;font-size:18px">BiggerBody</div>
      <div class="small muted mt-8">Train · Meditate · Grow</div>
      <div class="small muted mt-8">v1.0 · ${stats.workouts} workouts · ${getXP()} XP earned</div>
      <div class="mt-14" style="font-weight:700">Developed by <b style="background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent">Suraj Basnet</b></div>
      <div class="small muted mt-8">Made with ❤️ for your strongest, calmest self.</div>
    </div>

    <button class="btn danger wide mt-14" id="reset-btn">${esc(t('Reset all progress'))}</button>
    <div class="small muted center mt-14 mb-8">Made with ❤️ by Suraj Basnet</div>
  `;

  // profile
  view.querySelector('#st-name').addEventListener('change', e => { saveSettings({ name: e.target.value.trim() }); toast(t('Saved ✅')); });
  view.querySelector('#st-gender').addEventListener('change', e => saveSettings({ gender: e.target.value }));

  // language
  view.querySelectorAll('[data-lang]').forEach(chip => chip.addEventListener('click', () => {
    const lang = chip.dataset.lang;
    if (lang === s.lang) return;
    saveSettings({ lang });
    setLang(lang);
    applyChrome();
    toast(t('Language changed ✅'));
    render(view);
  }));

  // switches
  view.querySelectorAll('.switch').forEach(sw => sw.addEventListener('click', () => {
    const key = sw.dataset.set;
    if (key === 'theme') {
      const light = s.theme !== 'light';
      saveSettings({ theme: light ? 'light' : 'dark' });
      document.documentElement.dataset.theme = light ? 'light' : '';
    } else {
      saveSettings({ [key]: !s[key] });
    }
    render(view);
  }));

  // date notification (Android & iOS)
  const notifSwitch = view.querySelector('#notif-switch');
  const notifTime = view.querySelector('#notif-time');
  const notifNote = () => {
    if (!notifSupported()) return t('Notifications are not available in this browser');
    if (Notification.permission === 'denied') return t('Blocked: allow notifications for this site in your browser settings');
    return '';
  };
  notifSwitch.addEventListener('click', async () => {
    if (s.dateNotif) {
      disableNotif();
      toast(t('Date notification off'));
    } else {
      const res = await enableNotif();
      toast(res === 'granted' ? t("Date notification on — check today's notification 📅") : t('Permission not granted ❌'));
    }
    render(view);
  });
  notifTime.addEventListener('change', e => { saveSettings({ dateNotifTime: e.target.value || '07:30' }); scheduleNotif(); });
  view.querySelector('#notif-test').addEventListener('click', async () => {
    const res = await testNotif();
    const note = notifNote();
    if (res === 'granted') toast(t("Sent! Look at the top of your screen 📅"), 3600);
    else if (note) toast(note, 3600);
    else toast(t('Permission not granted ❌'));
  });

  // weather
  const wxPreview = view.querySelector('#wx-preview');
  const paintWxPreview = d => {
    const [label, emoji] = codeInfo(d.cur.code);
    wxPreview.innerHTML = `${emoji} ${esc(getLoc().label)}: <b>${d.cur.t}°C</b>, ${esc(label)} · 🌅 ${esc(d.sun.rise)} · 🌇 ${esc(d.sun.set)}`;
  };
  const cachedWx = get('wxCache', null);
  if (cachedWx?.data) paintWxPreview(cachedWx.data);
  getWeather().then(paintWxPreview)
    .catch(() => { if (!cachedWx?.data) wxPreview.textContent = t('No sky yet — go online once and it will remember.'); });

  view.querySelector('#wx-city').addEventListener('change', e => {
    if (e.target.value === '__gps') return;
    clearGps();
    saveSettings({ wxCity: e.target.value });
    render(view); // GPS option disappears; preview refetches for the new city
  });

  view.querySelector('#wx-gps').addEventListener('click', () => {
    if (!navigator.geolocation) return toast(t('GPS not available on this device'));
    toast(t('Finding you…'));
    navigator.geolocation.getCurrentPosition(
      p => { setGps(p.coords.latitude, p.coords.longitude); toast(t('Location set 📍')); render(view); },
      () => toast(t('Could not get GPS — try again outdoors'), 3000),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  });

  view.querySelector('#wx-refresh').addEventListener('click', async () => {
    try {
      const d = await getWeather({ force: true });
      paintWxPreview(d);
      toast(t('Sky updated ⛅'));
    } catch { toast(t('No internet right now — showing the last sky'), 3000); }
  });

  const wxWaterSw = view.querySelector('#wx-water-switch');
  wxWaterSw.addEventListener('click', () => {
    const nowOn = s.wxAutoWater === false;
    saveSettings({ wxAutoWater: nowOn });
    wxWaterSw.classList.toggle('on', nowOn);
    toast(nowOn ? t('Extra water on hot days — on 💧') : t('Extra water on hot days — off'));
  });

  // install
  const installBtn = view.querySelector('#install-btn');
  const hint = view.querySelector('#install-hint');
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone) {
    installBtn.style.display = 'none';
    hint.textContent = '✅ Already installed — you are running the app mode.';
  } else if (!deferredPrompt) {
    hint.textContent = 'iOS: tap Share → "Add to Home Screen". Desktop: use the install icon in your browser address bar.';
  }
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return toast('Use your browser menu → "Add to Home Screen"');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') toast('Installing… welcome to the app! 🎉');
    deferredPrompt = null;
  });

  // reset
  let armed = false;
  view.querySelector('#reset-btn').addEventListener('click', e => {
    if (!armed) { armed = true; e.target.textContent = t('Tap again to confirm reset'); return; }
    resetAll();
    location.hash = '#/home';
    location.reload();
  });
}
