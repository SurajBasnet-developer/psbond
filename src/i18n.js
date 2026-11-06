// i18n — Nepali language switch. English is the source of truth: every view
// renders through t(), which passes EN strings through untouched and swaps in
// Nepali translations when the user picks नेपाली in Settings.
// {0} {1} ... are positional placeholders for dynamic values.
import { getSettings } from './modules/storage.js';

let LANG = null;

export function getLang() {
  if (!LANG) LANG = getSettings().lang || 'en';
  return LANG;
}

export function setLang(lang) {
  LANG = lang;
  document.dispatchEvent(new CustomEvent('bb-lang', { detail: lang }));
}

export function applyChrome() {
  document.querySelectorAll('.nav a, .sidebar a').forEach(a => {
    const span = a.querySelector('span');
    const label = ROUTE_LABEL[a.dataset.route];
    if (span && label) span.textContent = t(label);
  });
}

export function t(key, ...vals) {
  const lang = getLang();
  let s = lang === 'ne' ? (NE[key] || key) : key;
  vals.forEach((v, i) => { if (s.includes(`{${i}}`)) s = s.split(`{${i}}`).join(String(v)); });
  return s;
}

// Router labels live here so the chrome can be re-translated on the fly.
export const ROUTE_LABEL = {
  home: 'Home', train: 'Train', mind: 'Mind', progress: 'Progress', more: 'More',
  dance: 'Dance', motivation: 'Motivation', care: 'Care', library: 'Library',
  books: 'Book Summaries', melodies: 'Melodies', dates: 'Date Converter',
  ghargym: 'GharGym', fasting: 'Fast & Fest', settings: 'Settings',
};

const NE = {
  // ---- chrome / router ----
  'Home': 'होम',
  'Train': 'तालिम',
  'Mind': 'मन',
  'Progress': 'प्रगति',
  'More': 'अरू',
  'Dance': 'नृत्य',
  'Motivation': 'प्रेरणा',
  'Care': 'सम्बन्ध',
  'Library': 'लाइब्रेरी',
  'Book Summaries': 'पुस्तक सार',
  'Melodies': 'धुन',
  'Date Converter': 'मिति परिवर्तन',
  'GharGym': 'घर जिम',
  'Fast & Fest': 'व्रत र पर्व',
  'Settings': 'सेटिङ',
  'Beat studio & dance cardio': 'बीट स्टुडियो र नृत्य कार्डियो',
  'Quotes & affirmations': 'उद्धरण र आत्मप्रेरक वाक्य',
  'Relationships & gratitude': 'सम्बन्ध र कृतज्ञता',
  'All exercises A–Z': 'वर्णक्रममा सबै व्यायाम',
  'Best self-help books, distilled': 'सर्वोत्कृष्ट पुस्तकहरू, सारमा',
  'Generated meditation music': 'उत्पन्न ध्यान संगीत',
  'Nepali ↔ English calendar': 'नेपाली ⇄ अंग्रेजी मिति',
  'Strength from bottles, sacks, bricks': 'बोतल, भारी, इँटबाट ताकत',
  'Train smart on fasting & festival days': 'व्रत–पर्वमा बुद्धिपूर्वक तालिम',
  'Profile, theme, install': 'प्रोफाइल, थिम, इन्स्टल',
  'Something went wrong loading this page.': 'यो पृष्ठ खोल्दा समस्या भयो।',

  // ---- challenge ----
  "Today's challenge": 'आजको च्यालेन्ज',
  '· done ✅': '· सम्पन्न ✅',
  '+{0} XP when complete': 'पुरा गर्दा +{0} XP',
  'Done': 'सकियो',
  'Mark done': 'गरेँ',
  'Challenge complete! +{0} XP ⚡': 'च्यालेन्ज पुरा! +{0} XP ⚡',
  'Loading…': 'लोड हुँदै…',

  // ---- daily challenge texts ----
  '50 squats today': 'आज ५० स्क्वाट',
  'Hold a plank 3 times (30s+)': '३ पटक प्लाङ्क (३० सेकेन्डमाथि)',
  'Drink 8 glasses of water': '८ गिलास पानी पिउनुहोस्',
  '10-minute walk after every meal': 'हरेक खानापछि १० मिनेट हिँडाइ',
  '100 push-ups total today': 'आज जम्मा १०० पुश-अप',
  '5 minutes of stretching': '५ मिनेट स्ट्रेचिङ',
  'Take the stairs every time': 'सिँढी नै रोज्नुहोस्',
  'Dance to 3 songs': '३ गीतमा नाच्नुहोस्',
  'Meditate for 5 minutes': '५ मिनेट ध्यान',
  'No sugar until dinner': 'बेलुका खानासम्म चिनी होइन',
  '60 seconds of high knees': '६० सेकेन्ड हाइ-नी',
  'Write 3 things you are grateful for': 'कृतज्ञताका ३ कुरा लेख्नुहोस्',
  'Say something kind to someone': 'कसैलाई मायाको कुरा भन्नुहोस्',
  'Sleep before midnight': 'मध्यरातअघि सुत्नुहोस्',

  // ---- home ----
  'Good morning': 'शुभ प्रभात',
  'Good afternoon': 'शुभ दिन',
  'Good evening': 'शुभ साँझ',
  'Still up': 'अझै जागै',
  '{0}-day streak — keep the fire alive!': '{0} दिनको स्ट्रिक — आगो बालिराख्नुहोस्!',
  'Your body is ready. Let\u2019s begin today.': 'शरीर तयार छ — आजैबाट सुरु गरौं।',
  'Level:': 'स्तर:',
  'Workouts': 'वर्कआउट',
  'Min today': 'आज मिनेट',
  'Kcal today': 'आज क्यालोरी',
  'Quote of the day': 'आजको उद्धरण',
  'Quick start': 'छिटो सुरु',
  'See all →': 'सबै हेर्नुहोस् →',
  'Water tracker': 'पानी ट्र्याकर',
  '{0}/8 glasses': '{0}/8 गिलास',
  'Hydration hero! 💧': 'पानी हिरो! 💧',
  'Small sips, big energy.': 'थोरै–थोरै घुटुक्क, ठूलो जोश।',
  'Add': 'जोड्नुहोस्',
  'Mind Studio': 'मन स्टुडियो',
  'Meditate · breathe · sleep': 'ध्यान · सास · निद्रा',
  'Cardio disguised as fun': 'खेल भन्दा मजा भन्दा कार्डियो',
  'Relationships': 'सम्बन्ध',
  'Daily bonding wisdom': 'दैनिक साइनोको बुद्धि',
  'Strength with bottles & sacks': 'बोतल र भारीबाट ताकत',
  'Fasting & festival fitness': 'व्रत र पर्वको फिटनेस',
  'Today in Nepal': 'नेपालमा आज',
  'Tap for fasting-safe training & festival tips': 'व्रत-मित्र तालिम र पर्व सुझावका लागि ठिच्याउनुहोस्',

  // ---- settings ----
  'Your profile': 'तपाईंको प्रोफाइल',
  'Name': 'नाम',
  'Your name': 'तपाईंको नाम',
  'Default coach on Home': 'होममा देखिने कोच',
  '💪 Male coach': '💪 पुरुष कोच',
  '🌸 Female coach': '🌸 महिला कोच',
  'Experience': 'अनुभव',
  'Dark theme': 'अँध्यारो थिम',
  'Premium night look': 'प्रिमियम रातको लुक',
  'Voice coaching': 'आवाज कोचिङ',
  'Speaks each exercise aloud': 'हरेक व्यायाम बोलेर सिकाउँछ',
  'Sound effects': 'ध्वनि प्रभाव',
  'Beeps for work & rest phases': 'काम–विश्राममा बिप आवाज',
  'Keep screen awake': 'स्क्रिन बल्याउँदै राख्ने',
  'During workouts': 'वर्कआउटको बेला',
  'Haptics': 'ह्याप्टिक्स',
  'Gentle vibration on changes': 'परिवर्तनमा हल्का भाइब्रेसन',
  'Language': 'भाषा',
  'Switch the app interface. Suggestions like quotes and tips stay bilingual.': 'एपको इन्टरफेस बदलिन्छ। उद्धरण–सुझाव जस्ता सामग्रीमा दुवै भाषा मिसिएकै रहन्छ।',
  'Install the app': 'एप इन्स्टल गर्नुहोस्',
  'Add BiggerBody to your home screen on Android, iOS, Windows, macOS or Linux — full screen, offline, instant.': 'BiggerBody लाई होम स्क्रिनमा राख्नुहोस् — पूरा स्क्रिन, अफलाइन, झटपट।',
  'Install BiggerBody': 'BiggerBody इन्स्टल गर्नुहोस्',
  '✨ Included premium features': '✨ सँगैका प्रिमियम सुविधाहरू',
  'Reset all progress': 'सबै प्रगति मेट्नुहोस्',
  'Tap again to confirm reset': 'पक्का गर्न फेरि ठिच्याउनुहोस्',
  'Saved ✅': 'सेभ भयो ✅',
  'Language changed ✅': 'भाषा बदलियो ✅',

  // ---- ghargym ----
  'No gym? No problem 🏠': 'जिम छैन? समस्या छैन 🏠',
  'Full strength training with bottles, gagri, bhaari, bricks, towels and stairs — things found in every Nepali home. Equipment cost: Rs. 0.': 'बोतल, गाग्री, भारी, इँट, ताउल र सिँढी — नेपाली घरका त्यही सामानले पूरा ताकत तालिम। सामान लागत: रु. ०।',
  '{0} exercises': '{0} व्यायाम',
  '{0} done today': 'आज {0} सम्पन्न',
  'Search goblet, sack, brick, stairs…': 'खोज्नुहोस्: स्क्वाट, भारी, इँट…',
  'tap an exercise': 'थिचेर हेर्नुहोस्',
  'No exercises found.': 'व्यायाम भेटिएन।',
  'Try another search or item.': 'अर्को खोजी वा सामान रोज्नुहोस्।',
  'How to do it': 'गर्ने तरिका',
  'dose:': 'मात्रा:',
  '✅ Mark done (+8 XP)': '✅ सम्पन्न (+8 XP)',
  'Done today ✅': 'आज सम्पन्न ✅',
  'Close': 'बन्द',
  'GharGym done! +8 XP 💪': 'घर जिम सम्पन्न! +8 XP 💪',
  '💧 Water': '💧 पानी',
  '🌾 Rice sack': '🌾 भारी',
  '🧱 Brick & stone': '🧱 इँट–ढुङ्गा',
  '🪢 Towel & belt': '🪢 ताउल–पट्टी',
  '🪑 Chair & stairs': '🪑 कुर्सी–सिँढी',
  'Bottles & 5L gagri': 'बोतल र ५–लि. गाग्री',
  'Daal–bhaari power': 'दाल–भारीको ताकत',
  'Budget iron': 'सस्तो फलाम',
  'Iso & mobility': 'आइसो र गतिलोपन',
  'Push, dip, climb': 'पुश, डिप, सिँढी',

  // ---- fast & fest ----
  'a regular day — full sessions open': 'सामान्य दिन — पूरा सेसन खुला',
  'Fasting mode': 'व्रत मोड',
  'ON — today is a fasting day 🌾': 'अन — आज व्रतको दिन 🌾',
  'Off — am I fasting today?': 'अफ — आज व्रत बस्ने हो?',
  'Mark today': 'आज व्रत बस्छु',
  'Turn off': 'बन्द गर्नुहोस्',
  'Light sessions only · hydration reminder on · guidance below': 'लाइट सेसन मात्र · पानी सम्झना अन · तल सुझाव',
  'Mark fast days here — home screen will adjust suggestions automatically': 'व्रतको दिन यहाँ दर्ता गर्नुहोस् — होमका सुझाव आफैं मिल्नेछन्',
  'Upcoming · auto-tracked': 'आउँदै · आफैं ट्र्याक',
  'My weekly fasts': 'मेरा साप्ताहिक व्रत',
  'Tap the days you regularly fast (Sombar-Shiva, Sanibar-Shani, Santoshi Shukrabar…). They turn on fasting mode automatically.': 'नियमित व्रतका बार ठिच्याउनुहोस् (सोमबार–शिव, शनिबार–शनि, सन्तोषी शुक्रबार…)। त्यो दिन व्रत मोड आफैं अन हुन्छ।',
  'Day guide': 'दिन गाइड',
  '🙏 Fasts': '🙏 व्रत',
  '🎉 Festivals': '🎉 पर्व',
  '🍲 Food days': '🍲 खाना दिन',
  'today': 'आज',
  'tomorrow': 'भोलि',
  'in {0} days': '{0} दिनमा',
  'Fasting-safe sessions': 'व्रत-मित्र सेसन',
  'Fast-day rules of thumb': 'व्रत दिनको कामका नियम',
  'Slow movement keeps energy steady while fasting — these all stay under walking intensity.': 'व्रतमा हिँडाइको तहभन्दा तलको हल्का अभ्यासले ऊर्जा स्थिर राख्छ।',
  '💧 Water even on fast days — unless it is nirjala: sip every 30–45 min otherwise.': '💧 व्रतमा पनि पानी — निर्जला नभएसम्म ३०–४५ मिनेटमा घुटुक्क।',
  '🥗 Break the fast gently: fruit, milk or warm khichadi before anything fried.': '🥗 व्रत तोड्दा नम्रै: फलफूल, दूध वा तातो खिचडी नै पहिलो।',
  '🛑 No high-intensity or heavy lifting on an empty stomach — ever.': '🛑 खाली पेटमा भारी वा हाइ-इन्टेन्सिटी काम — कहिल्यै होइन।',
  '🧂 If fasting with salt-free foods, fatigue comes faster — shorten sessions.': '🧂 नुनरहित व्रतमा थकान छिटो लाग्छ — सेसन छोटो बनाउनुहोस्।',
  '{0} — automatic flag from your weekly fast. Connecting with {1} today? Keep the phone away and the timer short. 🙏': '{0} — तपाईंको साप्ताहिक व्रत आफैं पक्रियो। आज {1} को पूजा? फोन टाढा राख्नुहोस्, टाइमर छोटो। 🙏',
  'Health note: diabetics, pregnant & nursing mothers, and anyone on regular medication — talk to your doctor about fasting. Never push through dizziness.': 'स्वास्थ्य नोट: डाइबिटिस, गर्भवती वा स्तनपान माताहरू र औषधि चलिरहेका — व्रतबारे डाक्टरसँग सल्लाह लिनुहोस्। रिंगटा लागे कहिल्यै नधक्काउनुहोस्।',
  'Dates shift yearly with the lunar tithi — everything here is guidance, not an astrological calendar.': 'तिथिअनुसार मिति हरेक वर्ष सर्छ — यहाँआजको सबै सुझाव पनि छ, पात्रो चाहिँ होइन।',
  'Food & drink': 'खाना–पानी',
  'Training this day': 'यो दिनको तालिम',
  '🌾 Open fasting mode': '🌾 व्रत मोड खोल्नुहोस्',
  'Fasting mode ON for today 🙏': 'आज व्रत मोड अन 🙏',
  'Fasting mode ON — take it light today 🙏': 'व्रत मोड अन — आज हल्कै गर्नुहोस् 🙏',
  'Fasting mode off — full sessions back': 'व्रत मोड अफ — पूरा सेसन फर्कियो',
  'weekly · {0}': 'साप्ताहिक · {0}',

  // ---- day-guide level labels (from data/fests.js) ----
  '🥗 Light training okay': '🥗 हल्का तालिम ठीक',
  '⚡ Moderate fine today': '⚡ मध्यम सेसन सकिन्छ',
  '🛑 Better to rest': '🛑 विश्राम नै राम्रो',

  // ---- view headers & heroes ----
  'Read less, learn more 📚': 'कम पढ्नुहोस्, बढी सिक्नुहोस् 📚',
  'The top self-help books, distilled into short, practical summaries you can finish in minutes.': 'सर्वोत्कृष्ट सेल्फ-हेल्प पुस्तकहरू — मिनेटभित्र सकिने छोटा र व्यावहारिक सार।',
  'Nepali ↔ English dates': 'नेपाली ⇄ अंग्रेजी मिति',
  'Divine Melodies': 'दिव्य धुनहरू',
  'Beat Studio 🎧': 'बीट स्टुडियो 🎧',
  '{0}+ exercises · always growing': '{0}+ व्यायाम · झन् झन् थपिँदै',
};
