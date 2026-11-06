// Fast & Fest — Nepali fasting and festival fitness guidance.
// Some days are computed EXACTLY from the local Bikram Sambat calendar:
//   • Sankranti          — 1st of every BS month
//   • Maghe Sankranti    — Magh 1
//   • Shrawan Sombar     — every Monday in Shrawan
//   • Personal weekly fasts — saved weekday patterns (Sankashti, Santoshi…)
// Other lunar days (Ekadashi, Teej, Chhath…) shift year to year, so their
// guidance stays browsable with a "check local calendar" note instead of fake dates.

import { todayBs, bsToAd, daysInBsMonth } from './nepaliCalendar.js';
import { dayKey, getFastState, getFastPatterns } from '../modules/storage.js';

export const GRAD = {
  fast: 'linear-gradient(135deg,#fbbf24,#d97706 55%,#7c2d12)',
  fest: 'linear-gradient(135deg,#f472b6,#c026d3 55%,#701a75)',
  food: 'linear-gradient(135deg,#34d399,#059669 55%,#064e3b)',
};

// Personal weekday fasts — tap which days you keep each week.
export const PATTERNS = [
  { dow: 0, ne: 'आइतबार', en: 'Sunday', who: 'Surya' },
  { dow: 1, ne: 'सोमबार', en: 'Monday', who: 'Shiva' },
  { dow: 2, ne: 'मंगलबार', en: 'Tuesday', who: 'Ganesh / Hanuman' },
  { dow: 3, ne: 'बुधबार', en: 'Wednesday', who: 'Bishnu' },
  { dow: 4, ne: 'बिहीबार', en: 'Thursday', who: 'Brihaspati' },
  { dow: 5, ne: 'शुक्रबार', en: 'Friday', who: 'Santoshi Mata' },
  { dow: 6, ne: 'शनिबार', en: 'Saturday', who: 'Shani' },
];

export const LEVEL_LABEL = {
  light: '🥗 Light training okay',
  moderate: '⚡ Moderate fine today',
  rest: '🛑 Better to rest',
};

export const KIND_LABEL = { fast: 'fast', fest: 'festival', food: 'food day' };

export const FESTS = [
  {
    id: 'sankranti', name: 'Sankranti', ne: 'संक्रान्ति', emoji: '🍲',
    kind: 'food', level: 'light', auto: true,
    when: '1st day of every BS month',
    desc: 'The 1st day of each Nepali month is Sankranti — the custom is a warm, simple pot of khichadi (dal-rice), a natural reset day for digestion. The app tracks it for you automatically.',
    food: ['Warm khichadi with ghee — simple, easy to digest', 'Seasonal sabji and achar in small amounts', 'Finish dinner early today'],
    train: ['A normal workout is fine — khichadi gives steady energy'],
    safety: 'Nothing special today — enjoy the monthly reset.',
  },
  {
    id: 'shrawan-sombar', name: 'Shrawan Sombar', ne: 'साउन सोमबार', emoji: '🔱',
    kind: 'fast', level: 'light', auto: true,
    when: 'Every Monday of Shrawan',
    desc: 'Millions of Nepalis fast or eat one simple vegetarian meal on Shrawan Mondays to honour Shiva. The app counts the Mondays and auto-flags these days for you.',
    food: ['Fruit, milk, sabudana, makhana are the classic fast foods', 'Regular rice/wheat is usually skipped', 'Rock salt (sendhava) instead of table salt'],
    train: ['Keep sessions short and low intensity', 'Yoga and surya namaskar beat heavy lifting today', 'If you are eating, sip water every 30–45 minutes'],
    safety: 'Full-day without food? Skip resistance training entirely today — walk and stretch instead.',
  },
  {
    id: 'maghe-sankranti', name: 'Maghe Sankranti', ne: 'माघे संक्रान्ति', emoji: '💛',
    kind: 'fest', level: 'moderate', auto: true,
    when: '1st of Magh (mid-January)',
    desc: 'The winter harvest feast day: chaku, gheu, yam (tarul), bhatmas. A warm, energy-packed day that actually suits training well.',
    food: ['Chaku, ghee, tarul, bhatmas — dense winter energy foods', 'Balanced meal, not a full-day feast', 'Warm water through the day'],
    train: ['Good training day — energy dense foods help', 'Morning workout before the big family meal'],
    safety: 'Those with diabetes — go gentle on chaku and sweets.',
  },
  {
    id: 'ekadashi', name: 'Ekadashi', ne: 'एकादशी', emoji: '🌒',
    kind: 'fast', level: 'light',
    when: 'Twice every lunar month (tithi-based — shifts)',
    desc: 'The 11th day of each lunar fortnight. Many keep it as a fruit-and-milk day or full fast. The dates move every month with the tithi — confirm from a local calendar or temple board.',
    food: ['Fruit, milk, sabudana, makhana, sweet potato', 'No grains or beans on a strict ekadashi', 'Eat slightly less at night than usual'],
    train: ['Light yoga, stretching or a walk is perfect', 'Push high-intensity sessions to the next day', 'You will feel it — do not chase PRs today'],
    safety: 'If you feel dizzy, sit down and eat something. Fasting is worship, not a fitness test.',
  },
  {
    id: 'teej', name: 'Haritalika Teej', ne: 'हरितालिका तीज', emoji: '💃',
    kind: 'fast', level: 'rest',
    when: 'Bhadra–Asoj (Aug–Sep), lunar — varies yearly',
    desc: 'The biggest women\u2019s festival of the year — red sarees, songs, dancing, and for many a strict 24-hour fast even without water. Plan the days around it, not through it.',
    food: ['Special dar the night before — eat and hydrate well', 'On the day: many keep absolute fast; breaking traditionally with fruit or milk', 'Next day: gentle light food, nothing fried'],
    train: ['Today is a rest day — dancing at the daris is your workout', 'No heavy lifting, no fasting-day training', 'Recovery focus: sleep early after the vigil'],
    safety: 'Long fast + no water = no exercise, full stop. Diabetics and pregnant women should speak to their doctor before keeping nirjala fasts.',
  },
  {
    id: 'rishi-panchami', name: 'Rishi Panchami', ne: 'ऋषि पञ्चमी', emoji: '🌿',
    kind: 'fast', level: 'light',
    when: 'Two days after Teej (Bhadra)',
    desc: 'The final day of the Teej trio — bathing, purification and a cleansing one-meal fast. The body is usually tired from the festival; treat this as an easy day.',
    food: ['Single simple meal, usually with hareyo greens', 'Light khaja-style food through the day'],
    train: ['Gentle stretching or a slow walk at most', 'Save energy — many wake before dawn today'],
    safety: 'None specific. Sleep well tonight.',
  },
  {
    id: 'janai-purnima', name: 'Janai Purnima', ne: 'जनै पुर्णिमा', emoji: '🧵',
    kind: 'fest', level: 'moderate',
    when: 'Shrawan full moon (Aug), lunar — varies yearly',
    desc: 'The sacred-thread day — and the day every home smells of kwati, the nine-bean sprout soup. That kwati is secretly one of the best post-workout protein dishes in Nepali cuisine.',
    food: ['Kwati — nine sprouted beans, quality plant protein', 'Different kinds of beans for the whole family', 'Some communities fast during the day until the thread ceremony'],
    train: ['Normal training okay if you are eating kwati', 'Morning session before family visits'],
    safety: 'None special — enjoy the protein.',
  },
  {
    id: 'krishna-janmashtami', name: 'Krishna Janmashtami', ne: 'कृष्ण जन्माष्टमी', emoji: '🦚',
    kind: 'fast', level: 'light',
    when: 'Bhadra (Aug–Sep), midnight vigil — varies yearly',
    desc: 'Devotees fast through the day and break it at midnight — the hour of Krishna\u2019s birth. A common and very meaningful evening fast.',
    food: ['Day: fruit and milk if fasting gently', 'Midnight: prashad and the day\u2019s first full meal', 'Keep it light — late meals sit heavy'],
    train: ['Daytime: keep it light to moderate', 'Evening: skip training — the vigil will run late'],
    safety: 'If you will be out late at the temple, plan tomorrow\u2019s workout shorter.',
  },
  {
    id: 'dashain', name: 'Dashain (Vijaya Dashami)', ne: 'दशैं', emoji: '🎉',
    kind: 'fest', level: 'moderate',
    when: 'Asoj–Kartik (Sep–Oct), 15 days',
    desc: 'The big one. Family, tika and feasts for two weeks. Buffet culture adds a kilo or two for most people. The trick is not dieting through Dashain — it is moving daily so there is less to undo later.',
    food: ['Meat, sel, achar and homemade sweets — enjoy, but plate first, then sit', 'Balance heavy meals with extra water and fruit', 'Do not skip breakfast to "save" for feasts — that backfires'],
    train: ['Walk 20–30 minutes daily — evenings after meals', 'Home bodyweight sessions: 15 min is enough', 'Come back to real training gently after Ghatasthapana break'],
    safety: 'Take the heavy post-Dashain sessions to your calendar, not your guilt. Consistency resumes; a festival week off is fine.',
  },
  {
    id: 'tihar', name: 'Tihar & Bhai Tika', ne: 'तिहार', emoji: '🪔',
    kind: 'fest', level: 'moderate',
    when: 'Kartik (Oct–Nov), 5 days',
    desc: 'Five days of lights, sel-roti, sweets, deusi-bhailo and marigold. Sel-roti at every house means calorie creep — dance with the deusi crew and you will balance it.',
    food: ['Sel-roti, sweets, achar — taste everything, consume less of everything', 'Water in between festival rounds', 'Keep one plain meal a day as your anchor'],
    train: ['Morning light sessions keep energy for the evenings', 'Cooking, cleaning, dancing = real activity — count it', 'Mend the sweet tooth slowly after Bhai Tika'],
    safety: 'Frying for five days — your digestion will thank you for the greens.',
  },
  {
    id: 'chhath', name: 'Chhath', ne: 'छठ', emoji: '🌅',
    kind: 'fast', level: 'rest',
    when: 'Asoj–Kartik (Oct–Nov), 4 days of vrats',
    desc: 'The most physically demanding fast in Nepal: 36 hours without even water for the vrat (mostly mothers). Sun salutations at the river, standing in water at dawn and dusk.',
    food: ['Day 1: normal meal; Day 2–3: strict fast, thekua and fruit to break it', 'The food in Chhath is clean, sattvic and simple', 'Hydration matters before, not during, the final fast'],
    train: ['No workouts for the vrat — 36 hours is enough load', 'Light walking only, and only before the full fast begins', 'Help them: vratis carry the whole fast — carry the kosi instead'],
    safety: 'Absolute: no exercise during a nirjala vrati. Glucose drops fast in cold river water at dawn — watch for shivering or confusion.',
  },
  {
    id: 'shivaratri', name: 'Maha Shivaratri', ne: 'महाशिवरात्री', emoji: '🔱',
    kind: 'fast', level: 'rest',
    when: 'Fagun (Feb–Mar), night vigil',
    desc: 'The great night of Shiva. Many fast through the day and stay awake through the night at temple. Pair a rest day here and use the evening for chanting, not cardio.',
    food: ['Phalahar fast: fruit, milk, makhana', 'Some keep an absolute fast through the four prahars of the night', 'Break the fast next morning, gently — khichadi is perfect'],
    train: ['Rest day officially recommended', 'If you plan to stay up all night: no training, and clear tomorrow', 'Morning-before meditation beats an evening HIIT'],
    safety: 'Sleep debt after vigil — reschedule hard sessions 1–2 days out.',
  },
  {
    id: 'buddha-jayanti', name: 'Buddha Jayanti', ne: 'बुद्ध जयन्ती', emoji: '☸️',
    kind: 'fest', level: 'light',
    when: 'Baisakh full moon (Apr–May) — varies yearly',
    desc: 'The Buddha\u2019s birth, enlightenment and passing — one day, three events. Especially for the Buddhist Newari, lamp-rotations and sutra chanting fill the day.',
    food: ['Many keep sattvic vegetarian/vegan days', 'Kheer and simple grains in most homes', 'No alcohol traditionally today'],
    train: ['Light, mindful movement fits the day best', 'Walking meditation > lifting session'],
    safety: 'None special — the day simply asks for calm.',
  },
  {
    id: 'ram-nawami', name: 'Ram Nawami', ne: 'राम नवमी', emoji: '🏹',
    kind: 'fast', level: 'light',
    when: 'Fagun–Chait (Mar–Apr) — varies yearly',
    desc: 'The birth of Ram. Many fast through this day at Kali/Nawami temples, with bhajans and festivals all over the country.',
    food: ['Falahari fast: fruit, milk, sabudana', 'The regular evening meal is fine for non-fasters'],
    train: ['Light to moderate considering most fast lightly', 'Morning surya namaskar tradition pairs well'],
    safety: 'None specific. If you fast: keep water close.',
  },
];

export const festById = id => FESTS.find(f => f.id === id);

const matchAuto = (f, t) =>
  f.id === 'sankranti' ? t.bs.day === 1
  : f.id === 'shrawan-sombar' ? (t.bs.month === 4 && t.ad.weekday === 1)
  : f.id === 'maghe-sankranti' ? (t.bs.month === 10 && t.bs.day === 1)
  : false;

const flagOf = f => ({ fest: f, emoji: f.emoji, title: f.name, sub: f.ne });

// Flags for "today" — used by the home banner and the Fast & Fest page.
export function todaysFlags() {
  const t = todayBs();
  const out = [];
  FESTS.forEach(f => { if (matchAuto(f, t)) out.push(flagOf(f)); });
  getFastPatterns().forEach(dow => {
    if (t.ad.weekday === dow) {
      out.push({ custom: 'pattern', emoji: '🙏', title: `${PATTERNS[dow].ne} fast`, sub: `Your weekly ${PATTERNS[dow].en} fast` });
    }
  });
  if (getFastState()[dayKey()]?.on) {
    out.push({ custom: 'manual', emoji: '🌾', title: 'You marked a fast today', sub: 'Training light today' });
  }
  return out;
}

// Upcoming computed days (Sankranti, Maghe, Shrawan Sombar, personal patterns).
export function getUpcoming() {
  const t = todayBs();
  const base = Date.UTC(t.ad.year, t.ad.month - 1, t.ad.day);
  const res = [];

  const bsMeta = bs => {
    const ad = bsToAd(bs.year, bs.month, bs.day);
    return { bs, ad, left: Math.round((Date.UTC(ad.year, ad.month - 1, ad.day) - base) / 86400000) };
  };

  // Sankranti — the 1st of the next BS month (or today)
  if (t.bs.day === 1) {
    res.push({ ...bsMeta(t.bs), fest: festById('sankranti') });
  } else {
    const [yy, mm] = t.bs.month === 12 ? [t.bs.year + 1, 1] : [t.bs.year, t.bs.month + 1];
    res.push({ ...bsMeta({ year: yy, month: mm, day: 1 }), fest: festById('sankranti') });
  }

  // Maghe Sankranti — the next 1 Magh
  const isMagheToday = t.bs.month === 10 && t.bs.day === 1;
  if (isMagheToday) {
    res.push({ ...bsMeta(t.bs), fest: festById('maghe-sankranti') });
  } else {
    const my = t.bs.month > 10 || (t.bs.month === 10 && t.bs.day > 1) ? t.bs.year + 1 : t.bs.year;
    res.push({ ...bsMeta({ year: my, month: 10, day: 1 }), fest: festById('maghe-sankranti') });
  }

  // Shrawan Sombar — next Shrawan's Mondays (and this one if we are in it)
  const sy = t.bs.month === 4 ? t.bs.year : (t.bs.month < 4 ? t.bs.year : t.bs.year + 1);
  const som = shrawanMondays(sy);
  if (som.length) {
    const first = t.bs.month === 4
      ? (som.find(s => s.bs.day >= t.bs.day) || som[som.length - 1])
      : som[0];
    res.push({ ...bsMeta(first.bs), fest: festById('shrawan-sombar'), note: `${som.length} Mondays in Shrawan ${sy}` });
  }

  // Personal weekly fast patterns
  getFastPatterns().forEach(dow => {
    let d = new Date(base);
    do { d = new Date(d.getTime() + 86400000); } while (d.getUTCDay() !== dow);
    const ad = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), weekday: d.getUTCDay() };
    res.push({
      pattern: PATTERNS[dow],
      bs: bsToAd(ad.year, ad.month, ad.day),
      ad,
      left: Math.round((d.getTime() - base) / 86400000),
    });
  });

  return res.sort((a, b) => a.left - b.left);
}

function shrawanMondays(bsYear) {
  const dim = daysInBsMonth(bsYear, 4);
  const out = [];
  for (let day = 1; day <= dim; day++) {
    const ad = bsToAd(bsYear, 4, day);
    if (ad.weekday === 1) out.push({ bs: { year: bsYear, month: 4, day, weekday: ad.weekday }, ad });
  }
  return out;
}

export const leftLabel = n =>
  n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;
