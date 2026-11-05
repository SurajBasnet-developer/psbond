// Shared Nepali (Bikram Sambat) <-> English (Gregorian) date converter UI.
import {
  AD_MONTHS, BS_MONTHS, BS_MIN_YEAR, BS_MAX_YEAR, BS_MAX_AD,
  adToBs, bsToAd, todayBs, isLeapYear, daysInBsMonth, formatAd, formatBs,
} from '../data/nepaliCalendar.js';

const yearOptions = (from, to, selected) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)
    .map(y => `<option value="${y}" ${y === selected ? 'selected' : ''}>${y}</option>`).join('');

const dayOptions = (max, selected) =>
  Array.from({ length: max }, (_, i) => i + 1)
    .map(d => `<option value="${d}" ${d === selected ? 'selected' : ''}>${d}</option>`).join('');

const adDaysInMonth = (y, m) => [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

function setDayOptions(select, max, keep = 1) {
  const value = Math.min(Math.max(1, keep), max);
  select.innerHTML = dayOptions(max, value);
  select.value = String(value);
}

function resultHTML(main, sub) {
  return `<div class="dr-main">${main}</div><div class="dr-sub">${sub}</div>`;
}

function errorHTML(msg) {
  return `<div class="dr-main dr-error">${msg}</div><div class="dr-sub">Check the month and day and try again.</div>`;
}

export function renderDateConverter(box) {
  const now = todayBs();
  const maxAdYear = Math.min(now.ad.year, BS_MAX_AD.year);
  const maxBsYear = Math.min(now.bs.year, BS_MAX_YEAR);

  box.innerHTML = `
    <div class="date-converter">
      <div class="card date-today">
        <div class="date-today-label">Today in Nepal</div>
        <div class="date-today-row">
          <div>
            <div class="date-today-bs">${formatBs(now.bs)}</div>
            <div class="small muted">${formatBs(now.bs, { nepali: false, weekday: false })}</div>
          </div>
          <div class="date-today-ad">
            <div class="date-today-bs">${formatAd(now.ad)}</div>
            <div class="small muted">${now.ad.year}-${String(now.ad.month).padStart(2, '0')}-${String(now.ad.day).padStart(2, '0')}</div>
          </div>
        </div>
        <div class="date-today-hint">${BS_MIN_YEAR}–${BS_MAX_YEAR} BS · 1900–${maxAdYear} AD · accurate, offline conversion</div>
      </div>

      <div class="card mt-14 date-card">
        <div class="card-title">English → Nepali</div>
        <div class="date-inputs">
          <select id="dc-ad-year" aria-label="English year">${yearOptions(1900, maxAdYear, now.ad.year)}</select>
          <select id="dc-ad-month" aria-label="English month">${AD_MONTHS.map((m, i) => `<option value="${i + 1}" ${i + 1 === now.ad.month ? 'selected' : ''}>${m}</option>`).join('')}</select>
          <select id="dc-ad-day" aria-label="English day">${dayOptions(31, now.ad.day)}</select>
        </div>
        <div class="date-actions">
          <button class="btn primary" id="dc-ad-btn">Convert to Nepali</button>
          <button class="btn ghost" id="dc-ad-today">Today</button>
        </div>
        <div class="date-result" id="dc-ad-result"></div>
      </div>

      <div class="card mt-14 date-card">
        <div class="card-title">Nepali → English</div>
        <div class="date-inputs">
          <select id="dc-bs-year" aria-label="Nepali year">${yearOptions(BS_MIN_YEAR, maxBsYear, now.bs.year)}</select>
          <select id="dc-bs-month" aria-label="Nepali month">${BS_MONTHS.map((m, i) => `<option value="${i + 1}" ${i + 1 === now.bs.month ? 'selected' : ''}>${m}</option>`).join('')}</select>
          <select id="dc-bs-day" aria-label="Nepali day">${dayOptions(daysInBsMonth(now.bs.year, now.bs.month), now.bs.day)}</select>
        </div>
        <div class="date-actions">
          <button class="btn primary" id="dc-bs-btn">Convert to English</button>
          <button class="btn ghost" id="dc-bs-today">Today</button>
        </div>
        <div class="date-result" id="dc-bs-result"></div>
      </div>

      <div class="card mt-14 date-note">
        <b>Did you know?</b> Bikram Sambat runs about 56 years and 8 months ahead of the Gregorian calendar. Month lengths change every year (29–32 days), so the app uses verified calendar tables — not rough maths.
      </div>
    </div>
  `;

  const adYear = box.querySelector('#dc-ad-year');
  const adMonth = box.querySelector('#dc-ad-month');
  const adDay = box.querySelector('#dc-ad-day');
  const adResult = box.querySelector('#dc-ad-result');

  const bsYear = box.querySelector('#dc-bs-year');
  const bsMonth = box.querySelector('#dc-bs-month');
  const bsDay = box.querySelector('#dc-bs-day');
  const bsResult = box.querySelector('#dc-bs-result');

  const syncAdDays = () => {
    setDayOptions(adDay, adDaysInMonth(+adYear.value, +adMonth.value), +adDay.value || 1);
  };
  const syncBsDays = () => {
    setDayOptions(bsDay, daysInBsMonth(+bsYear.value, +bsMonth.value), +bsDay.value || 1);
  };

  const convertAd = () => {
    try {
      const bs = adToBs(+adYear.value, +adMonth.value, +adDay.value);
      adResult.innerHTML = resultHTML(
        formatBs(bs),
        `${formatBs(bs, { nepali: false })} · ${adYear.value}-${String(adMonth.value).padStart(2, '0')}-${String(adDay.value).padStart(2, '0')} AD`
      );
    } catch (err) {
      adResult.innerHTML = errorHTML(err.message);
    }
  };

  const convertBs = () => {
    try {
      const ad = bsToAd(+bsYear.value, +bsMonth.value, +bsDay.value);
      bsResult.innerHTML = resultHTML(
        formatAd(ad),
        `${ad.year}-${String(ad.month).padStart(2, '0')}-${String(ad.day).padStart(2, '0')} AD · ${formatBs({ year: +bsYear.value, month: +bsMonth.value, day: +bsDay.value, weekday: ad.weekday }, { nepali: false, weekday: false })}`
      );
    } catch (err) {
      bsResult.innerHTML = errorHTML(err.message);
    }
  };

  adYear.addEventListener('change', syncAdDays);
  adMonth.addEventListener('change', () => { syncAdDays(); convertAd(); });
  adDay.addEventListener('change', convertAd);
  box.querySelector('#dc-ad-btn').addEventListener('click', convertAd);
  box.querySelector('#dc-ad-today').addEventListener('click', () => {
    adYear.value = String(now.ad.year);
    adMonth.value = String(now.ad.month);
    setDayOptions(adDay, adDaysInMonth(now.ad.year, now.ad.month), now.ad.day);
    convertAd();
  });

  bsYear.addEventListener('change', () => { syncBsDays(); convertBs(); });
  bsMonth.addEventListener('change', () => { syncBsDays(); convertBs(); });
  bsDay.addEventListener('change', convertBs);
  box.querySelector('#dc-bs-btn').addEventListener('click', convertBs);
  box.querySelector('#dc-bs-today').addEventListener('click', () => {
    bsYear.value = String(now.bs.year);
    bsMonth.value = String(now.bs.month);
    setDayOptions(bsDay, daysInBsMonth(now.bs.year, now.bs.month), now.bs.day);
    convertBs();
  });

  syncAdDays();
  syncBsDays();
  convertAd();
  convertBs();
}
