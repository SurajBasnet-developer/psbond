// Daily Rashifal — free horoscope API (no key, CORS open), cached on-device
// like the quotes. The API lives on vercel.app, which some South-Asian ISPs
// block and whose function can cold-start slow — so fetches race the direct
// call against mirrors/proxies (same resilient chain the news module uses),
// then fall back to yesterday's stars, and finally to a seeded daily wisdom
// line so the card never looks broken.
import { get, set, dayKey } from './storage.js';

// The 12 raashi (moon signs) — Nepali name, transliteration, glyph, API sign id.
export const RAASHIS = [
  { id: 'aries',      ne: 'मेष',     en: 'Mesh',      emoji: '♈' },
  { id: 'taurus',     ne: 'वृषभ',    en: 'Vrishabh',  emoji: '♉' },
  { id: 'gemini',     ne: 'मिथुन',   en: 'Mithun',    emoji: '♊' },
  { id: 'cancer',     ne: 'कर्कट',   en: 'Karkat',    emoji: '♋' },
  { id: 'leo',        ne: 'सिंह',    en: 'Singha',    emoji: '♌' },
  { id: 'virgo',      ne: 'कन्या',   en: 'Kanya',     emoji: '♍' },
  { id: 'libra',      ne: 'तुला',    en: 'Tula',      emoji: '♎' },
  { id: 'scorpio',    ne: 'वृश्चिक', en: 'Vrishchik', emoji: '♏' },
  { id: 'sagittarius',ne: 'धनु',     en: 'Dhanu',     emoji: '♐' },
  { id: 'capricorn',  ne: 'मकर',     en: 'Makar',     emoji: '♑' },
  { id: 'aquarius',   ne: 'कुम्भ',   en: 'Kumbha',    emoji: '♒' },
  { id: 'pisces',     ne: 'मीन',     en: 'Meen',      emoji: '♓' },
];

export const findRashi = id => RAASHIS.find(r => r.id === id);

// Offline last resort — never pretend, always marked 'अफलाइन' by the view.
const STAR_WISDOM = [
  'आजको अनुशासनले भोलिको भाग्य लेख्छ — एउटा स्थिर कदम पर्याप्त छ।',
  'शान्त मनले कठिन दिनलाई बलियो बनाउँछ। पहिले सास फेर्नुहोस्, त्यसपछि सुरु गर्नुहोस्।',
  'शंकामा खर्च गर्ने ऊर्जा सुरुवातमै खर्च गर्नु राम्रो।',
  'साना जितहरू थुप्रिँदै जान्छन्। अघिको एउटा उठाउनुहोस्।',
  'पानी, हिँडाइ, घाम — यही सबैभन्दा पुरानो ज्योतिष हो।',
  'मुडभन्दा तपाईंको लगातारता ठूलो छ। नम्रसँग उपस्थित रहनुहोस्।',
  'सानै रोपेको कुरा हुर्कँदै छ। पालना गर्दै जानुहोस्।',
  'आराम पनि प्रगति हो — आरामले अर्को प्रहार बलियो बनाउँछ।',
  'संसारलाई भन्नुअघि आफैंलाई एक मीठो वाक्य भन्नुहोस्।',
  'आज भाग्यभन्दा ध्यान जित्छ। सबैभन्दा महत्त्वपूर्ण काम रोज्नुहोस्।',
  'पुरानो योजनालाई नयाँ नजर चाहिन्छ — सरल बनाउनुहोस् र अघि बढ्नुहोस्।',
  'आज साहस मौन हुन्छ: निडरको काम मौनसँग गर्नुहोस्।',
  'बन्द भन्ठानेको ढोका अर्को बाटोबाट खुल्छ। फेरि हेर्नुहोस्।',
  'खुसी इन्धन हो। मुस्कान दिने एउटा काम आज अवश्य गर्नुहोस्।',
  'धैर्य मनको व्यायाम हो। घण्टा होइन, सास गन्नुहोस्।',
  'एक विचलनलाई न भन्नुहोस्, एक सपनालाई हुन भन्नुहोस्।',
  'प्रगति इमानदार सुरुवातलाई माया गर्छ — जहाँ छन्, त्यहीँबाट सुरु गर्नुहोस्।',
  'शक्ति प्रयासको बीचको विश्राममा बढ्छ। विश्रामलाई सम्मान दिनुहोस्।',
  'कृतज्ञताले भएको कुरा दोब्बर बनाउँछ। तीन वटा लेख्नुहोस्।',
  'ताराहरूलाई इच्छाभन्दा मिहिनेत मन पर्छ। सानो तर निडर कदम चाल्नुहोस्।',
];

function localStars(sign) {
  const seed = Math.abs([...(dayKey() + sign)].reduce((a, c) => a + c.charCodeAt(0), 0));
  return STAR_WISDOM[seed % STAR_WISDOM.length];
}

// शुभ अंक / शुभ रङ — deterministic per sign+date: stable all day for everyone,
// needs no network, and pairs naturally with the daily seeded horoscope.
const LUCKY_COLORS = [
  { ne: 'रातो',    hex: '#e53935' },
  { ne: 'पहेँलो',  hex: '#fdd835' },
  { ne: 'हरियो',   hex: '#43a047' },
  { ne: 'निलो',    hex: '#1e88e5' },
  { ne: 'सेतो',    hex: '#f5f5f5' },
  { ne: 'गुलाबी',  hex: '#ec407a' },
  { ne: 'सुनौलो',  hex: '#ffb300' },
  { ne: 'बैंगनी',  hex: '#8e24aa' },
  { ne: 'सुन्तला', hex: '#fb8c00' },
  { ne: 'कालो',    hex: '#37474f' },
  { ne: 'आकाशी',   hex: '#4dd0e1' },
];

function seededLucky(sign) {
  const seed = salt => Math.abs([...(dayKey() + sign + salt)].reduce((a, c) => a + c.charCodeAt(0), 0));
  return {
    number: (seed('#') % 9) + 1,
    color: LUCKY_COLORS[seed('color') % LUCKY_COLORS.length],
  };
}

async function tryFetch(url, timeout = 12000, headers) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers });
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    // channels like jina may wrap the payload with meta lines — extract the
    // JSON object OR array (the translate endpoint answers with an array)
    const starts = [text.indexOf('{'), text.indexOf('[')].filter(i => i >= 0);
    const ends = [text.lastIndexOf('}'), text.lastIndexOf(']')].filter(i => i >= 0);
    try { return JSON.parse(text); } catch { /* fall through to slicing */ }
    if (starts.length && ends.length) return JSON.parse(text.slice(Math.min(...starts), Math.max(...ends) + 1));
    throw new Error('unparseable');
  } finally { clearTimeout(t); }
}

// Race the two dependable channels first (direct ↔ jina mirror), then walk
// the public proxies — mirrors the news module's fetchFeed strategy.
async function fetchStars(sign) {
  const url = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
  const enc = encodeURIComponent(url);
  const steps = [
    () => tryFetch(url, 12000),
    () => tryFetch(`https://r.jina.ai/${url}`, 12000, { 'x-return-format': 'text' }),
    () => tryFetch(`https://api.codetabs.com/v1/proxy?quest=${enc}`, 12000),
    () => tryFetch(`https://api.allorigins.win/raw?url=${enc}`, 12000),
  ];
  const pick = data => {
    const d = data?.data?.horoscope ? data.data : data; // some channels wrap, some don't
    const text = d?.horoscope;
    return text && typeof text === 'string' && text.length > 20
      ? { text, date: d.date || dayKey() }
      : null;
  };

  const raced = await Promise.allSettled([steps[0](), steps[1]()]);
  for (const r of raced) {
    if (r.status === 'fulfilled') {
      const got = pick(r.value);
      if (got) return got;
    }
  }
  for (const step of steps.slice(2)) {
    try {
      const got = pick(await step());
      if (got) return got;
    } catch { /* next channel */ }
  }
  return null;
}

export function getRashifalSign() { return get('rashifalSign', null); }
export function setRashifalSign(id) { set('rashifalSign', id); }

// Free machine translation (no key, CORS open) — English horoscope → नेपाली.
async function toNepali(en) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${encodeURIComponent(en)}`;
  const steps = [
    () => tryFetch(url, 9000),
    () => tryFetch(`https://r.jina.ai/${url}`, 9000, { 'x-return-format': 'text' }),
  ];
  for (const step of steps) {
    try {
      const data = await step();
      const segs = data?.[0];
      if (Array.isArray(segs)) {
        const out = segs.filter(Array.isArray).map(s => s?.[0] || '').join('');
        if (out.trim().length > 10) return out;
      }
    } catch { /* next channel */ }
  }
  return null;
}

// One fetch per sign per day — 'bb.rashifal' = { [sign]: { sign, date, text, ne, day } }.
export async function getRashifal(sign, force = false) {
  const lucky = seededLucky(sign);
  const cache = get('rashifal', {}) || {};
  const today = dayKey();
  const hit = cache[sign];
  if (!force && hit && hit.day === today && hit.text) {
    // older cache entries carry only the English text — upgrade them to Nepali
    if (hit.ne) return { ...hit, lucky };
    const ne = await toNepali(hit.text);
    if (ne) {
      hit.ne = ne;
      cache[sign] = hit;
      try { set('rashifal', cache); } catch { /* session-only */ }
    }
    return { ...hit, lucky };
  }

  const fresh = await fetchStars(sign);
  if (fresh) {
    const ne = await toNepali(fresh.text); // may be null — view falls back to English
    const result = { sign, date: fresh.date, text: fresh.text, ne: ne || '', day: today, offline: false };
    cache[sign] = result;
    try { set('rashifal', cache); } catch { /* quota — usable this session only */ }
    return { ...result, lucky };
  }

  // network down — show the last real horoscope (any age) before inventing one
  if (hit?.text) return { ...hit, offline: true, lucky };
  // nothing at all — seeded daily wisdom (already Nepali) so the card never looks broken
  return { sign, date: today, text: '', ne: localStars(sign), day: today, offline: true, local: true, lucky };
}
