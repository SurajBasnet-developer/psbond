// Nepali festival & holiday patro data, layered on top of the exact Bikram
// Sambat calendar (nepaliCalendar.js).
//
// Structure:
//  • FIXED   — events pinned to a Bikram Sambat month/day, true for EVERY year
//              (Nepali New Year, Constitution Day, Republic Day, Maghe
//              Sankranti, Asar Pandhra…).
//  • AD_FIX  — events pinned to a Gregorian date, reborn every year
//              (Jan 1, Mar 8, May 1, Dec 25).
//  • YEARS   — per-year tables for lunar/tithi events that shift each year.
//              2083 (Apr 2026 – Apr 2027) is fully cross-verified against the
//              Rastriya Patro (HamroPatro calendar pages, fetched 8 Nov 2026).
//              Other BS years show fixed + weekly holidays only.
//  • Saturday is the weekly public holiday in Nepal — the view adds it.
//
// kind: 'national' (holiday or observance) · 'festival' · 'fast' · 'intl'
//       hol: true marks an official day off · spark: true marks flash moments

import { bsToAd, daysInBsMonth } from './nepaliCalendar.js';

// ---------- events that exist every BS year (m, d are BS month/day) ----------
export const FIXED = [
  { m: 1, d: 1, emoji: '🎉', ne: 'नयाँ वर्ष', en: 'Nepali New Year', kind: 'national', hol: true, spark: true },
  { m: 1, d: 1, emoji: '🚩', ne: 'बिस्का जात्रा', en: 'Bisket Jatra (Bhaktapur)', kind: 'festival' },
  { m: 1, d: 11, emoji: '🕊', ne: 'लोकतन्त्र दिवस', en: 'Loktantra Diwas', kind: 'national' },
  { m: 3, d: 15, emoji: '🌾', ne: 'राष्ट्रिय धान दिवस', en: 'Ropain / National Paddy Day', kind: 'festival', food: 'Dahi-chiura day 🥣' },
  { m: 3, d: 29, emoji: '✍️', ne: 'भानु जयन्ती', en: 'Bhanu Jayanti', kind: 'festival' },
  { m: 6, d: 3, emoji: '📜', ne: 'संविधान दिवस', en: 'Constitution Day', kind: 'national', hol: true, spark: true },
  { m: 9, d: 15, emoji: '🧗', ne: 'तमु ल्होसार', en: 'Tamu Lhosar (Gurung New Year)', kind: 'festival' },
  { m: 9, d: 27, emoji: '🏰', ne: 'पृथ्वी जयन्ती · राष्ट्रिय एकता दिवस', en: 'Prithvi Jayanti', kind: 'national' },
  { m: 10, d: 1, emoji: '💛', ne: 'माघे संक्रान्ति', en: 'Maghe Sankranti', kind: 'national', hol: true, spark: true },
  { m: 10, d: 16, emoji: '🕯', ne: 'शहीद दिवस', en: 'Martyrs\u2019 Day (Shahid Diwas)', kind: 'national' },
  { m: 11, d: 7, emoji: '⚖️', ne: 'प्रजातन्त्र दिवस', en: 'Democracy Day (Falgun 7)', kind: 'national' },
  { m: 12, d: 30, emoji: '🌅', ne: 'घोडे जात्रा', en: 'Ghode Jatra (KTM valley)', kind: 'festival', note: 'Chaitra Aunsi — shifts a day or two; see the verified year table' },
];

// ---------- events pinned to Gregorian dates (mo, da are AD month/day) ----------
export const AD_FIX = [
  { mo: 1, da: 1, emoji: '🎆', ne: 'नयाँ वर्ष (अंग्रेजी)', en: 'Gregorian New Year', kind: 'intl' },
  { mo: 3, da: 8, emoji: '🌸', ne: 'नारी दिवस', en: 'International Women\u2019s Day', kind: 'intl' },
  { mo: 5, da: 1, emoji: '🛠', ne: 'श्रमिक दिवस', en: 'International Labour Day', kind: 'intl', hol: true },
  { mo: 12, da: 25, emoji: '🎄', ne: 'क्रिसमस', en: 'Christmas Day', kind: 'national', hol: true },
];

// ---------- per-year lunar tables (tithi events, verified per BS year) ----------
// Entry: { m, d (BS), emoji, ne, en, kind, hol?, note? }
const YEAR_2083 = [
  // Baisakh
  { m: 1, d: 4, emoji: '🤱', ne: 'मातातीर्थ औंसी', en: 'Mata Tirtha Aunsi (Mother\u2019s Day)', kind: 'festival' },
  { m: 1, d: 18, emoji: '☸️', ne: 'बुद्ध जयन्ती', en: 'Buddha Jayanti', kind: 'national', hol: true, spark: true },
  // Jestha
  { m: 2, d: 12, emoji: '🌊', ne: 'गङ्गादशहरा', en: 'Gangadashahara', kind: 'festival' },
  { m: 2, d: 14, emoji: '🕋', ne: 'बकर ईद', en: 'Bakra Eid (Eid al-Adha)', kind: 'national', hol: true },
  // Asar
  { m: 3, d: 6, emoji: '🛕', ne: 'भोटो जात्रा', en: 'Bhoto Jatra (KTM valley)', kind: 'festival' },
  { m: 3, d: 11, emoji: '🌒', ne: 'निर्जला एकादशी', en: 'Nirjala Ekadashi', kind: 'fast' },
  // Shrawan
  { m: 4, d: 25, emoji: '🌿', ne: 'हरिशयनी एकादशी', en: 'Harishayani Ekadashi · Chaturmas begins', kind: 'fast' },
  { m: 4, d: 28, emoji: '🔔', ne: 'गुंला पर्व आरम्भ', en: 'Gunla begins (Newar Buddhist month)', kind: 'festival' },
  // Bhadra
  { m: 5, d: 1, emoji: '🐍', ne: 'नाग पञ्चमी', en: 'Nag Panchami · Simha Sankranti', kind: 'festival' },
  { m: 5, d: 10, emoji: '🕌', ne: 'पैगम्बर जयन्ती', en: 'Id-e-Milad (Muslim community)', kind: 'national', note: 'Holiday for the Muslim community' },
  { m: 5, d: 12, emoji: '🧵', ne: 'जनै पूर्णिमा', en: 'Janai Purnima · Raksha Bandhan', kind: 'national', hol: true, spark: true },
  { m: 5, d: 13, emoji: '🐄', ne: 'गाई जात्रा', en: 'Gai Jatra (KTM valley)', kind: 'festival' },
  { m: 5, d: 19, emoji: '🦚', ne: 'श्रीकृष्ण जन्माष्टमी', en: 'Krishna Janmashtami', kind: 'national', hol: true },
  { m: 5, d: 22, emoji: '👨', ne: 'कुशे औंसी', en: 'Kushe Aunsi (Father\u2019s Day)', kind: 'festival' },
  { m: 5, d: 29, emoji: '💃', ne: 'हरितालिका तीज', en: 'Haritalika Teej', kind: 'national', note: 'Holiday for women employees', spark: true },
  { m: 5, d: 30, emoji: '🌿', ne: 'ऋषि पञ्चमी', en: 'Rishi Panchami', kind: 'fast' },
  { m: 5, d: 31, emoji: '🛠', ne: 'विश्वकर्मा पूजा', en: 'Bishwakarma Puja', kind: 'festival' },
  // Asoj
  { m: 6, d: 9, emoji: '🎭', ne: 'इन्द्र जात्रा', en: 'Indra Jatra (KTM valley)', kind: 'festival' },
  { m: 6, d: 24, emoji: '🌾', ne: 'घटस्थापना', en: 'Ghatasthapana · Navaratri begins', kind: 'national', hol: true },
  { m: 6, d: 31, emoji: '🌺', ne: 'फूलपाती', en: 'Fulpati · Dashain holidays begin', kind: 'national', hol: true },
  // Kartik
  { m: 7, d: 1, emoji: '⚔️', ne: 'महा अष्टमी', en: 'Maha Ashtami (Dashain)', kind: 'national', hol: true },
  { m: 7, d: 2, emoji: '🎊', ne: 'दशैं बिदा', en: 'Dashain holiday', kind: 'national', hol: true },
  { m: 7, d: 3, emoji: '🗡', ne: 'महा नवमी', en: 'Maha Navami (Dashain)', kind: 'national', hol: true },
  { m: 7, d: 4, emoji: '🎉', ne: 'विजया दशमी', en: 'Vijaya Dashami · Tika', kind: 'national', hol: true, spark: true },
  { m: 7, d: 6, emoji: '🎊', ne: 'दशैं बिदा', en: 'Dashain holiday', kind: 'national', hol: true },
  { m: 7, d: 8, emoji: '🌕', ne: 'कोजाग्रत पूर्णिमा', en: 'Kojagrat Purnima', kind: 'national', hol: true },
  { m: 7, d: 20, emoji: '🪔', ne: 'धनतेरस', en: 'Dhan Teras · Yam Deep', kind: 'festival' },
  { m: 7, d: 21, emoji: '🐦', ne: 'काग तिहार', en: 'Kag Tihar (crow worship)', kind: 'festival' },
  { m: 7, d: 22, emoji: '🐕', ne: 'कुकुर तिहार · लक्ष्मी पूजा', en: 'Kukur Tihar · Laxmi Puja', kind: 'festival' },
  { m: 7, d: 23, emoji: '🐄', ne: 'गाई पूजा', en: 'Gai Tihar', kind: 'festival' },
  { m: 7, d: 23, emoji: '🪔', ne: 'तिहार बिदा', en: 'Tihar holiday', kind: 'national', hol: true },
  { m: 7, d: 24, emoji: '🕯', ne: 'म्ह पूजा · नेपाल संवत् प्रारम्भ', en: 'Mha Puja · Nepal Sambat New Year', kind: 'festival', note: 'KTM valley holiday' },
  { m: 7, d: 25, emoji: '🥰', ne: 'भाइटीका', en: 'Bhai Tika', kind: 'national', hol: true, spark: true },
  { m: 7, d: 26, emoji: '🪔', ne: 'तिहार बिदा', en: 'Tihar holiday', kind: 'national', hol: true },
  { m: 7, d: 29, emoji: '🌅', ne: 'छठ पर्व', en: 'Chhath Parva', kind: 'national', hol: true },
  // Poush
  { m: 9, d: 9, emoji: '🍛', ne: 'उधौली पर्व · योमरी पुन्ही', en: 'Udhauli Parva · Yomari Punhi', kind: 'festival' },
  // Magh
  { m: 10, d: 2, emoji: '🏚', ne: 'राष्ट्रिय भुकम्प सुरक्षा दिवस', en: 'National Earthquake Safety Day', kind: 'national' },
  { m: 10, d: 24, emoji: '🤍', ne: 'सोनाम ल्होछार', en: 'Sonam Lhosar (Tamang New Year)', kind: 'festival' },
  { m: 10, d: 28, emoji: '🪶', ne: 'सरस्वती पूजा', en: 'Basanta Panchami · Saraswati Puja', kind: 'festival' },
  // Falgun
  { m: 11, d: 22, emoji: '🔱', ne: 'महाशिवरात्रि', en: 'Maha Shivaratri', kind: 'national', hol: true, spark: true },
  { m: 11, d: 24, emoji: '🌸', ne: 'नारी दिवस', en: 'International Women\u2019s Day', kind: 'intl' },
  { m: 11, d: 25, emoji: '🐉', ne: 'ग्याल्पो ल्होसार', en: 'Gyalpo Lhosar (Sherpa New Year)', kind: 'festival' },
  // Chait
  { m: 12, d: 7, emoji: '🎨', ne: 'फागु पूर्णिमा (होली)', en: 'Holi — hilly districts', kind: 'national', hol: true, spark: true },
  { m: 12, d: 8, emoji: '🎨', ne: 'फागु पूर्णिमा (तराई)', en: 'Holi — Terai districts', kind: 'national', hol: true },
  { m: 12, d: 23, emoji: '🐎', ne: 'घोडे जात्रा', en: 'Ghode Jatra (KTM valley)', kind: 'festival', note: 'KTM valley holiday' },
];

export const YEARS = { 2083: YEAR_2083 };

/** Highest BS year whose lunar events are fully verified. */
export const VERIFIED_THROUGH = 2083;

// ---------- lookup API ----------

/** All events on one BS day: year table → fixed → matched AD-fixed.
    ad = the bsToAd() result for (y, m, d); optional for pure BS lookups. */
export function eventsForBs(y, m, d, ad) {
  const out = [];
  const seen = new Set();
  const add = e => { if (!seen.has(e.en)) { seen.add(e.en); out.push(e); } };
  const table = YEARS[y];
  // A verified year table is the truth — same-named FIXED approximations in
  // that month (e.g. Ghode Jatra) are suppressed for covered years.
  const covered = table ? new Set(table.filter(e => e.m === m).map(e => e.en)) : null;
  if (table) for (const e of table) if (e.m === m && e.d === d) add(e);
  for (const e of FIXED) if (e.m === m && e.d === d && !(covered && covered.has(e.en))) add(e);
  if (ad) for (const e of AD_FIX) if (ad.month === e.mo && ad.day === e.da) add(e);
  return out;
}

/** Map: BS day number → events[] for one BS month. Blank = no events. */
export function monthEvents(y, m) {
  const map = [];
  const dim = daysInBsMonth(y, m);
  for (let d = 1; d <= dim; d++) {
    const evs = eventsForBs(y, m, d, bsToAd(y, m, d));
    if (evs.length) map[d] = evs;
  }
  return map;
}
