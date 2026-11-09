// 🌤️ Weather-smart days — free Open-Meteo data (no key, no account),
// cached on-device so Home paints instantly and works offline with the
// last good sky. Advises water boosts, indoor swaps and best walk windows.
import { get, set, del, getSettings, saveSettings } from './storage.js';
import { icon, esc, toast } from '../ui/dom.js';
import { t } from '../i18n.js';

// Nepal — all 77 districts of the 7 provinces (coords = district HQ / main town),
// ordered the way Nepalis say them: east → west, Koshi to Sudurpashchim.
export const PROVINCES = [
  { name: 'Koshi', districts: [
    { id: 'bir',  name: 'Morang',        lat: 26.45, lon: 87.27 },
    { id: 'dhr',  name: 'Sunsari',       lat: 26.81, lon: 87.28 },
    { id: 'jhpa', name: 'Jhapa',         lat: 26.55, lon: 88.09 },
    { id: 'ilam', name: 'Ilam',          lat: 26.91, lon: 87.93 },
    { id: 'pnt',  name: 'Panchthar',     lat: 27.15, lon: 87.89 },
    { id: 'tbl',  name: 'Taplejung',     lat: 27.35, lon: 87.67 },
    { id: 'snb',  name: 'Sankhuwasabha', lat: 27.36, lon: 87.23 },
    { id: 'bho',  name: 'Bhojpur',       lat: 27.17, lon: 87.05 },
    { id: 'dkta', name: 'Dhankuta',      lat: 26.98, lon: 87.33 },
    { id: 'thm',  name: 'Terhathum',     lat: 27.10, lon: 87.47 },
    { id: 'kha',  name: 'Khotang',       lat: 27.20, lon: 86.78 },
    { id: 'oka',  name: 'Okhaldhunga',   lat: 27.32, lon: 86.50 },
    { id: 'slk',  name: 'Solukhumbu',    lat: 27.51, lon: 86.59 },
    { id: 'udp',  name: 'Udayapur',      lat: 26.97, lon: 86.50 },
  ]},
  { name: 'Madhesh', districts: [
    { id: 'spt',  name: 'Saptari',      lat: 26.54, lon: 86.75 },
    { id: 'srh',  name: 'Siraha',       lat: 26.66, lon: 86.20 },
    { id: 'jnk',  name: 'Dhanusha',     lat: 26.73, lon: 85.92 },
    { id: 'mht',  name: 'Mahottari',    lat: 26.65, lon: 85.80 },
    { id: 'slh',  name: 'Sarlahi',      lat: 26.86, lon: 85.56 },
    { id: 'rth',  name: 'Rautahat',     lat: 26.77, lon: 85.28 },
    { id: 'brg',  name: 'Parsa',        lat: 27.01, lon: 84.88 },
    { id: 'bar',  name: 'Bara',         lat: 27.03, lon: 85.00 },
  ]},
  { name: 'Bagmati', districts: [
    { id: 'ktm',  name: 'Kathmandu',     lat: 27.70, lon: 85.32 },
    { id: 'plt',  name: 'Lalitpur',      lat: 27.66, lon: 85.31 },
    { id: 'bkt',  name: 'Bhaktapur',     lat: 27.67, lon: 85.43 },
    { id: 'kvre', name: 'Kavre',         lat: 27.62, lon: 85.55 },
    { id: 'snp',  name: 'Sindhupalchok', lat: 27.78, lon: 85.69 },
    { id: 'nwt',  name: 'Nuwakot',       lat: 27.91, lon: 85.15 },
    { id: 'rsw',  name: 'Rasuwa',        lat: 28.11, lon: 85.30 },
    { id: 'dhd',  name: 'Dhading',       lat: 27.86, lon: 84.92 },
    { id: 'heta', name: 'Makwanpur',     lat: 27.43, lon: 85.03 },
    { id: 'sln',  name: 'Sindhuli',      lat: 27.27, lon: 85.91 },
    { id: 'dola', name: 'Dolakha',       lat: 27.67, lon: 86.05 },
    { id: 'rmc',  name: 'Ramechhap',     lat: 27.39, lon: 86.06 },
    { id: 'chit', name: 'Chitwan',       lat: 27.68, lon: 84.43 },
  ]},
  { name: 'Gandaki', districts: [
    { id: 'pkr',  name: 'Kaski',     lat: 28.23, lon: 83.98 },
    { id: 'syn',  name: 'Syangja',   lat: 28.11, lon: 83.87 },
    { id: 'tnh',  name: 'Tanahu',    lat: 27.98, lon: 84.28 },
    { id: 'lmj',  name: 'Lamjung',   lat: 28.23, lon: 84.29 },
    { id: 'grk',  name: 'Gorkha',    lat: 27.99, lon: 84.63 },
    { id: 'prb',  name: 'Parbat',    lat: 28.22, lon: 83.69 },
    { id: 'myd',  name: 'Myagdi',    lat: 28.35, lon: 83.69 },
    { id: 'bgl',  name: 'Baglung',   lat: 28.27, lon: 83.59 },
    { id: 'mus',  name: 'Mustang',   lat: 28.78, lon: 83.74 },
    { id: 'mng',  name: 'Manang',    lat: 28.55, lon: 84.05 },
    { id: 'npw',  name: 'Nawalpur',  lat: 27.64, lon: 84.10 },
  ]},
  { name: 'Lumbini', districts: [
    { id: 'btw',  name: 'Rupandehi',            lat: 27.70, lon: 83.45 },
    { id: 'kvl',  name: 'Kapilvastu',           lat: 27.55, lon: 83.41 },
    { id: 'pwi',  name: 'Nawalparasi (West)',   lat: 27.50, lon: 83.64 },
    { id: 'plp',  name: 'Palpa',                lat: 27.87, lon: 83.67 },
    { id: 'glm',  name: 'Gulmi',                lat: 28.06, lon: 83.38 },
    { id: 'ahl',  name: 'Arghakhanchi',         lat: 27.91, lon: 83.13 },
    { id: 'dng',  name: 'Dang',                 lat: 27.86, lon: 82.42 },
    { id: 'pyn',  name: 'Pyuthan',              lat: 28.13, lon: 82.84 },
    { id: 'rlp',  name: 'Rolpa',                lat: 28.30, lon: 82.68 },
    { id: 'rea',  name: 'Rukum East',           lat: 28.64, lon: 82.42 },
    { id: 'npg',  name: 'Banke',                lat: 28.05, lon: 81.62 },
    { id: 'brd',  name: 'Bardiya',              lat: 28.22, lon: 81.66 },
  ]},
  { name: 'Karnali', districts: [
    { id: 'sur',  name: 'Surkhet',   lat: 28.60, lon: 81.63 },
    { id: 'dlk',  name: 'Dailekh',   lat: 28.84, lon: 81.71 },
    { id: 'sal',  name: 'Salyan',    lat: 28.38, lon: 82.15 },
    { id: 'jaj',  name: 'Jajarkot',  lat: 28.70, lon: 82.19 },
    { id: 'rwe',  name: 'Rukum West', lat: 28.74, lon: 82.48 },
    { id: 'kal',  name: 'Kalikot',   lat: 29.11, lon: 81.60 },
    { id: 'jum',  name: 'Jumla',     lat: 29.27, lon: 82.18 },
    { id: 'mug',  name: 'Mugu',      lat: 29.56, lon: 82.11 },
    { id: 'hum',  name: 'Humla',     lat: 29.97, lon: 81.83 },
    { id: 'dol',  name: 'Dolpa',     lat: 28.94, lon: 82.81 },
  ]},
  { name: 'Sudurpashchim', districts: [
    { id: 'dhn',  name: 'Kailali',    lat: 28.70, lon: 80.59 },
    { id: 'knc',  name: 'Kanchanpur', lat: 28.97, lon: 80.18 },
    { id: 'dot',  name: 'Doti',       lat: 29.26, lon: 80.31 },
    { id: 'ddd',  name: 'Dadeldhura', lat: 29.30, lon: 80.58 },
    { id: 'ach',  name: 'Achham',     lat: 29.06, lon: 81.24 },
    { id: 'dra',  name: 'Darchula',   lat: 29.85, lon: 80.55 },
    { id: 'bai',  name: 'Baitadi',    lat: 29.53, lon: 80.47 },
    { id: 'baj',  name: 'Bajhang',    lat: 29.54, lon: 81.21 },
    { id: 'bju',  name: 'Bajura',     lat: 29.52, lon: 81.43 },
  ]},
];
// flat list — every district in one place, for lookups by id
export const CITIES = PROVINCES.flatMap(p => p.districts);
export const DISTRICT_COUNT = CITIES.length;
export const PROVINCE_COUNT = PROVINCES.length;

// WMO weather codes → [label, emoji]
const CODES = {
  0: ['Clear sky', '☀️'], 1: ['Mostly clear', '🌤️'], 2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'], 45: ['Fog', '🌫️'], 48: ['Icy fog', '🌫️'],
  51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'], 55: ['Heavy drizzle', '🌦️'],
  61: ['Light rain', '🌦️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'],
  80: ['Showers', '🌦️'], 81: ['Showers', '🌧️'], 82: ['Heavy showers', '⛈️'],
  95: ['Thunderstorm', '⛈️'], 96: ['Storm + hail', '⛈️'], 99: ['Storm + hail', '⛈️'],
  66: ['Freezing rain', '🌨️'], 67: ['Freezing rain', '🌨️'],
  71: ['Snow', '🌨️'], 73: ['Snow', '❄️'], 75: ['Heavy snow', '❄️'],
  85: ['Snow showers', '🌨️'], 86: ['Snow showers', '❄️'],
};
export const codeInfo = c => CODES[c] || ['Sky', '☁️'];

// ---- animated sky scene (pure CSS — no images, no extra requests) ----
// WMO code + day/night → a hand-drawn animated kind: sun, moon, sun-cloud,
// moon-cloud, cloud, rain, rain-hard, storm, snow, fog.
export function wxKind(code, isDay) {
  if (code >= 95) return 'storm';
  if ([65, 81, 82].includes(code)) return 'rain-hard';
  if ([51, 53, 55, 61, 63, 66, 67, 80].includes(code)) return 'rain';
  if (code >= 71 && code <= 86) return 'snow';
  if (code === 45 || code === 48) return 'fog';
  if (code === 3) return 'cloud';
  if (code === 2) return isDay ? 'sun-cloud' : 'moon-cloud';
  return isDay ? 'sun' : 'moon';
}

const R = (a, b) => +(a + Math.random() * (b - a)).toFixed(2);
const cloud = (left, top, s, dur, delay = 0, cls = '') =>
  `<div class="wx-drift" style="left:${left}px;top:${top}px;animation-duration:${dur}s;animation-delay:${delay}s"><div class="wx-cloud ${cls}" style="--s:${s}"></div></div>`;
const rays = Array.from({ length: 8 }, (_, i) => `<i style="--a:${i * 45}deg"></i>`).join('');
const drops = n => Array.from({ length: n }, () =>
  `<i style="--x:${R(12, 88)}%;--d:${R(.85, 1.5)}s;--dl:${R(0, 1.6)}s"></i>`).join('');
const flakes = n => Array.from({ length: n }, () =>
  `<i style="--x:${R(10, 90)}%;--d:${R(2.6, 4.4)}s;--dl:${R(0, 4)}s;--sw:${R(-14, 14)}px"></i>`).join('');
const stars = [[14, 16], [80, 10], [86, 30], [22, 34], [62, 8], [8, 44]].map(([x, y], i) =>
  `<i style="left:${x}%;top:${y}%;animation-delay:${(i * .45).toFixed(2)}s"></i>`).join('');
const bands = ['top:34px;--d:9s', 'top:58px;--d:7s;animation-delay:1s;opacity:.85', 'top:82px;--d:11s;animation-delay:.4s;opacity:.7']
  .map(s => `<div class="wx-fog" style="${s}"></div>`).join('');

// One painted sky — the exact same markup scales down for the mini forecast chips.
export function sceneHTML(code, isDay) {
  const kind = wxKind(code, isDay);
  let inner = '';
  if (kind === 'sun') inner = `<div class="wx-sun"><div class="wx-rays">${rays}</div></div>`;
  else if (kind === 'moon') inner = `<div class="wx-moon"><i class="c1"></i><i class="c2"></i><i class="c3"></i></div><div class="wx-stars">${stars}</div>`;
  else if (kind === 'sun-cloud') inner = `<div class="wx-sun"><div class="wx-rays">${rays}</div></div>` + cloud(30, 62, .95, 7) + cloud(2, 88, .58, 9, .8);
  else if (kind === 'moon-cloud') inner = `<div class="wx-moon"><i class="c1"></i><i class="c2"></i></div><div class="wx-stars">${stars}</div>` + cloud(34, 62, .9, 8);
  else if (kind === 'cloud') inner = cloud(6, 28, .75, 8) + cloud(34, 52, 1, 7, .5, 'dark') + cloud(0, 78, .55, 9, 1.1, 'darker');
  else if (kind === 'rain') inner = cloud(26, 26, .95, 6.5, 0, 'dark') + `<div class="wx-rain">${drops(10)}</div>`;
  else if (kind === 'rain-hard') inner = cloud(18, 22, 1.05, 6, 0, 'darker') + `<div class="wx-rain hard">${drops(16)}</div>`;
  else if (kind === 'storm') inner = cloud(20, 20, 1.05, 6.5, 0, 'storm') + `<div class="wx-rain">${drops(8)}</div><i class="wx-bolt"></i><span class="wx-flashbg"></span>`;
  else if (kind === 'snow') inner = cloud(24, 26, .95, 7, 0, 'dark') + `<div class="wx-snow">${flakes(9)}</div>`;
  else if (kind === 'fog') inner = `<div class="wx-glow"></div>` + cloud(18, 18, .8, 8, 0, 'pale') + `<div class="wx-fogs">${bands}</div>`;
  return `<div class="wx-scene" data-kind="${kind}">${inner}</div>`;
}

const hhmm = iso => (iso || '').slice(11, 16);
const dayName = dateStr => {
  try { return new Date(`${dateStr}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' }); }
  catch { return dateStr.slice(5); }
};

// ---- location: saved GPS point, else chosen city (default Kathmandu) ----
export function getLoc() {
  const saved = get('wxLoc', null);
  if (saved && Number.isFinite(saved.lat)) return saved;
  const s = getSettings();
  const city = CITIES.find(c => c.id === (s.wxCity || 'ktm')) || CITIES.find(c => c.id === 'ktm');
  return { lat: city.lat, lon: city.lon, label: city.name };
}

export function setGps(lat, lon) { set('wxLoc', { lat: +lat.toFixed(4), lon: +lon.toFixed(4), label: t('My location') }); }
export function clearGps() { set('wxLoc', null); }

// ---- fetch + cache ----
const TZ = 60 * 60 * 1000;
export async function getWeather({ force = false } = {}) {
  const cached = get('wxCache', null);
  const loc = getLoc();
  const fresh = cached && cached.loc && cached.loc.lat === loc.lat &&
    (Date.now() - cached.ts) < TZ;
  if (!force && fresh) return cached.data;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}` +
    `&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset,temperature_2m_max,weather_code&timezone=auto&forecast_days=3`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(t('Weather service unavailable'));
  const j = await res.json();
  const data = {
    cur: {
      t: Math.round(j.current.temperature_2m),
      code: j.current.weather_code,
      isDay: !!j.current.is_day,
    },
    sun: { rise: hhmm(j.daily.sunrise[0]), set: hhmm(j.daily.sunset[0]) },
    days: j.daily.time.map((d, i) => ({
      date: d, max: Math.round(j.daily.temperature_2m_max[i]), code: j.daily.weather_code[i],
    })),
  };
  set('wxCache', { data, ts: Date.now(), loc: { lat: loc.lat, lon: loc.lon, label: loc.label } });
  return data;
}

// ---- rules engine → advice lines (max 3) ----
export function advise(d) {
  if (!d) return [];
  const { cur, sun } = d;
  const out = [];
  const rain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(cur.code);
  const storm = cur.code >= 95;

  if (cur.t >= 35) out.push(t('🥵 Severe heat — train only before 8 AM or after sunset today.'));
  else if (cur.t >= 32) out.push(t('🥵 Very hot — water goal is +2 glasses today; finish heavy sessions before 9 AM.'));
  else if (cur.t >= 28) out.push(t('🌡️ Warm day — an extra glass of water before and after every session.'));
  else if (cur.t <= 5) out.push(t('🧊 Bitter cold — 5 extra minutes of warm-up, layer up, and breathe indoors.'));
  else if (cur.t <= 12) out.push(t('🧊 Cold morning — 3 extra minutes of warm-up before lifting; warm-up joints first.'));

  if (storm) out.push(t('⛈️ Thunderstorm — indoor today: Dance or Home strength, no outdoor run.'));
  else if (rain) out.push(t('🌧️ Rain — swap the outdoor run for Dance or GharGym; the rain soundscape in Mind matches the sky tonight.'));
  if (cur.code === 45 || cur.code === 48) out.push(t('🌫️ Foggy — morning run off, visibility is poor; walk after the fog clears.'));
  else if (cur.t >= 18 && cur.t <= 27 && cur.code <= 1) out.push(t('☀️ Clear and mild — a perfect sunlit walk day; 10 minutes after lunch.'));

  // sun window hints
  const h = new Date().getHours();
  if (!storm && !rain && d.cur.isDay && h >= 10 && h <= 15) out.push(t('🌇 Sunset {0} — plan yoga/walk there for a golden finish.', sun.set));
  return out.slice(0, 3);
}

// ---- hydration: 8 → 10 glasses on warm/hot days ----
export function waterTarget() {
  const c = get('wxCache', null);
  const on = getSettings().wxAutoWater !== false;
  if (on && c?.data?.cur?.t >= 28) return 10;
  return 8;
}

// ---- home card ----
export function mountCard(node) {
  if (!node) return;
  const cached = get('wxCache', null);
  if (cached?.data) paint(node, cached.data, true);

  getWeather().then(d => paint(node, d, true))
    .catch(() => { if (!cached?.data) paint(node, null, false); });
}

export function paint(node, d, hasData) {
  if (!node) return;
  if (!d) {
    node.removeAttribute('data-wx-kind');
    node.innerHTML = `
      <div class="card-title">🌤️ ${esc(t("Today's sky"))}</div>
      <div class="small muted">${esc(t('Weather needs the internet once — after that it remembers your last sky and works offline.'))}</div>`;
    return;
  }
  const kind = wxKind(d.cur.code, d.cur.isDay);
  const [wlabel, wemoji] = codeInfo(d.cur.code);
  const lines = advise(d);
  const boost = waterTarget() > 8 && getSettings().wxAutoWater !== false;
  node.dataset.wxKind = kind;
  node.innerHTML = `
    <div class="row between" style="align-items:center">
      <div class="card-title">${wemoji} ${esc(t("Today's sky — {0}", getLoc().label))}</div>
      <button class="icon-btn wx-refresh" title="${esc(t('Refresh sky'))}" aria-label="${esc(t('Refresh sky'))}">${icon('refresh')}</button>
    </div>
    <div class="wx-hero mt-14">
      ${sceneHTML(d.cur.code, d.cur.isDay)}
      <div class="wx-now">
        <div class="wx-temp">${d.cur.t}<span>°C</span></div>
        <div class="small muted mt-8">${esc(wlabel)}</div>
        <div class="chips mt-8" style="gap:6px">
          <span class="chip">🌅 ${esc(d.sun.rise)}</span>
          <span class="chip">🌇 ${esc(d.sun.set)}</span>
        </div>
        ${boost ? `<div style="margin-top:8px"><span class="chip">💧 ${esc(t('water +2 today'))}</span></div>` : ''}
      </div>
    </div>
    ${lines.length ? `<ul class="wx-advise">${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
    <div class="row mt-14" style="gap:6px">
      ${d.days.map(day => {
        const [dl] = codeInfo(day.code);
        return `<div class="wx-day" title="${esc(dl)}">
          <div class="small muted">${esc(dayName(day.date))}</div>
          <div class="wx-mini">${sceneHTML(day.code, true)}</div>
          <div class="small" style="font-weight:800">${day.max}°</div>
        </div>`;
      }).join('')}
    </div>
  `;
  node.querySelector('.wx-refresh').addEventListener('click', async () => {
    try {
      const fresh = await getWeather({ force: true });
      paint(node, fresh, true);
      toast(t('Sky updated ⛅'));
    } catch { toast(t('No internet right now — showing the last sky'), 3000); }
  });
}
