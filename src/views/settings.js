// Settings — profile, theme, premium feature list, install, about.
import { el, icon, toast } from '../ui/dom.js';
import { getSettings, saveSettings, resetAll, getStats, getXP } from '../modules/storage.js';
import { PREMIUM_FEATURES } from '../data/content.js';

export let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
});

export function render(view) {
  const s = getSettings();
  const stats = getStats();

  view.innerHTML = `
    <div class="header"><div class="brand">${icon('settings')} Settings</div></div>

    <div class="card">
      <div class="card-title">Your profile</div>
      <div class="field"><label>Name</label><input id="st-name" placeholder="Your name" value="${s.name || ''}"></div>
      <div class="field"><label>Default coach on Home</label>
        <select id="st-gender">
          <option value="male" ${s.gender === 'male' ? 'selected' : ''}>💪 Male coach</option>
          <option value="female" ${s.gender === 'female' ? 'selected' : ''}>🌸 Female coach</option>
        </select>
      </div>
    </div>

    <div class="card mt-14">
      <div class="card-title">Experience</div>
      <div class="setting-row"><div><div class="t">Dark theme</div><div class="d">Premium night look</div></div><button class="switch ${s.theme !== 'light' ? 'on' : ''}" data-set="theme"></button></div>
      <div class="setting-row"><div><div class="t">Voice coaching</div><div class="d">Speaks each exercise aloud</div></div><button class="switch ${s.voice ? 'on' : ''}" data-set="voice"></button></div>
      <div class="setting-row"><div><div class="t">Sound effects</div><div class="d">Beeps for work & rest phases</div></div><button class="switch ${s.sfx ? 'on' : ''}" data-set="sfx"></button></div>
      <div class="setting-row"><div><div class="t">Keep screen awake</div><div class="d">During workouts</div></div><button class="switch ${s.keepAwake ? 'on' : ''}" data-set="keepAwake"></button></div>
      <div class="setting-row"><div><div class="t">Haptics</div><div class="d">Gentle vibration on changes</div></div><button class="switch ${s.haptics ? 'on' : ''}" data-set="haptics"></button></div>
    </div>

    <div class="card mt-14" id="install-card" style="border-color:rgba(255,154,107,.4)">
      <div class="card-title">Install the app</div>
      <div class="small muted">Add BiggerBody to your home screen on Android, iOS, Windows, macOS or Linux — full screen, offline, instant.</div>
      <button class="btn primary wide mt-14" id="install-btn">${icon('download')} Install BiggerBody</button>
      <div class="small muted center mt-8" id="install-hint"></div>
    </div>

    <div class="section-title">✨ Included premium features</div>
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

    <button class="btn danger wide mt-14" id="reset-btn">Reset all progress</button>
    <div class="small muted center mt-14 mb-8">Made with ❤️ by Suraj Basnet</div>
  `;

  // profile
  view.querySelector('#st-name').addEventListener('change', e => { saveSettings({ name: e.target.value.trim() }); toast('Saved ✅'); });
  view.querySelector('#st-gender').addEventListener('change', e => saveSettings({ gender: e.target.value }));

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
    if (!armed) { armed = true; e.target.textContent = 'Tap again to confirm reset'; return; }
    resetAll();
    location.hash = '#/home';
    location.reload();
  });
}
