// Bikram Sambat (BS) <-> Gregorian (AD) calendar data and conversion.
// Calendar data covers BS 1901–2199 (AD 1844–2143), encoded as one character
// per month: "0" = 29 days, "1" = 30, "2" = 31, "3" = 32.
// Source: cross-verified public Bikram Sambat calendar tables.

const DATA = '223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132321110102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102222322101011223222101011232321110012132321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110102222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132321110102223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322011011223222101011232321110011232321110102223222101011223222101011232321110011232321110102223222101011223222101011232321110012132321110102223222101011223321101011232321110012132321110102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110102222322101011223222101011232321110011232321110102222322101011223222101011232321110012132321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012222322010102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223222101011232321110012132321110102223222101011223321101011232321110012132321110102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110102222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132321110102223222101011223321101011232321110012222322011002223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102222322101011223222101011232321110012132321110102223222101011223231101011232321110012132321110102223222101011223321101011232321110012132322011002223222101011223321101011232321110012222322011011223222101011223321101011232321110012222322011011223222101011232321101011232321110012222322101011223222101011232321110011232321110102222322101011223222101011232321110011232321110102223222101011223231101011';

export const BS_MIN_YEAR = 1901;
export const BS_MAX_YEAR = 2199;
export const BS_MIN_AD = { year: 1844, month: 4, day: 11 };
export const BS_MAX_AD = { year: 2143, month: 4, day: 15 };

export const BS_MONTHS = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत'];
export const BS_MONTHS_EN = ['Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Asoj', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
export const AD_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAYS_NE = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

const MONTH_START = [];
const YEAR_START = [];
let acc = 0;
for (let y = BS_MIN_YEAR; y <= BS_MAX_YEAR; y++) {
  YEAR_START[y - BS_MIN_YEAR] = acc;
  for (let m = 1; m <= 12; m++) {
    MONTH_START[(y - BS_MIN_YEAR) * 12 + (m - 1)] = acc;
    acc += daysInBsMonth(y, m);
  }
}
export const BS_TOTAL_DAYS = acc;

export function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInBsMonth(year, month) {
  if (year < BS_MIN_YEAR || year > BS_MAX_YEAR) throw new RangeError(`BS year must be between ${BS_MIN_YEAR} and ${BS_MAX_YEAR}`);
  if (month < 1 || month > 12) throw new RangeError('BS month must be between 1 and 12');
  return 29 + (DATA.charCodeAt((year - BS_MIN_YEAR) * 12 + (month - 1)) - 48);
}

export function daysInBsYear(year) {
  let n = 0;
  for (let m = 1; m <= 12; m++) n += daysInBsMonth(year, m);
  return n;
}

export function bsToAd(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) throw new RangeError('Please enter a valid date');
  const dim = daysInBsMonth(year, month);
  if (day < 1 || day > dim) throw new RangeError(`${BS_MONTHS[month - 1]} ${year} has only ${dim} days`);
  const days = MONTH_START[(year - BS_MIN_YEAR) * 12 + (month - 1)] + (day - 1);
  const d = new Date(Date.UTC(BS_MIN_AD.year, BS_MIN_AD.month - 1, BS_MIN_AD.day) + days * 86400000);
  return {
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    weekday: d.getUTCDay(),
  };
}

export function adToBs(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) throw new RangeError('Please enter a valid date');
  if (month < 1 || month > 12) throw new RangeError('Month must be between 1 and 12');
  const maxDay = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > maxDay) throw new RangeError(`${AD_MONTHS[month - 1]} ${year} has only ${maxDay} days`);
  const target = Date.UTC(year, month - 1, day);
  const start = Date.UTC(BS_MIN_AD.year, BS_MIN_AD.month - 1, BS_MIN_AD.day);
  const end = Date.UTC(BS_MAX_AD.year, BS_MAX_AD.month - 1, BS_MAX_AD.day);
  if (target < start || target > end) throw new RangeError(`AD date must be between ${BS_MIN_AD.year} and ${BS_MAX_AD.year}`);
  let days = Math.round((target - start) / 86400000);
  let lo = 0, hi = YEAR_START.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (YEAR_START[mid] <= days) lo = mid; else hi = mid - 1;
  }
  const yearIndex = lo;
  days -= YEAR_START[yearIndex];
  let bsMonth = 1;
  while (bsMonth < 12 && days >= daysInBsMonth(BS_MIN_YEAR + yearIndex, bsMonth)) {
    days -= daysInBsMonth(BS_MIN_YEAR + yearIndex, bsMonth);
    bsMonth++;
  }
  const d = new Date(target);
  return {
    year: BS_MIN_YEAR + yearIndex, month: bsMonth, day: days + 1,
    weekday: d.getUTCDay(),
  };
}

export function todayBs() {
  const now = new Date();
  // Nepal is UTC+5:45 all year. Shift the epoch and read UTC fields so the
  // result is correct no matter which timezone the device is set to.
  const nepal = new Date(now.getTime() + 5.75 * 3600000);
  const ad = { year: nepal.getUTCFullYear(), month: nepal.getUTCMonth() + 1, day: nepal.getUTCDate(), weekday: nepal.getUTCDay() };
  return { ad, bs: adToBs(ad.year, ad.month, ad.day) };
}

export const toDevanagari = n => String(n).replace(/[0-9]/g, d => '०१२३४५६७८९'[+d]);

export function formatAd(d, { weekday = true, devanagari = false } = {}) {
  const num = devanagari ? toDevanagari : String;
  const text = `${weekday ? WEEKDAYS[d.weekday] + ', ' : ''}${d.day} ${AD_MONTHS[d.month - 1]} ${d.year}`;
  return devanagari ? `${num(d.day)} ${AD_MONTHS[d.month - 1]} ${num(d.year)}` : text;
}

export function formatBs(d, { nepali = true, weekday = true, devanagari = true } = {}) {
  if (nepali) {
    const day = devanagari ? toDevanagari(d.day) : String(d.day);
    const year = devanagari ? toDevanagari(d.year) : String(d.year);
    return `${year} ${BS_MONTHS[d.month - 1]} ${day}${weekday ? ', ' + WEEKDAYS_NE[d.weekday] : ''}`;
  }
  return `${d.year} ${BS_MONTHS_EN[d.month - 1]} ${d.day}${weekday ? ', ' + WEEKDAYS[d.weekday] : ''}`;
}
