// Section Officer (शाखा अधिकृत) — Lok Sewa Aayog prep data.
// Structure verified against the official PSC syllabus 2081 (integrated & unified
// examination system, effective from FY 2081/82 advertisements). Fully offline.

// ---------- exam at a glance ----------
export const SO_FACTS = [
  { e: '🇳🇵', t: 'Lok Sewa Aayog', d: 'Integrated exam — परराष्ट्र, प्रशासन, लेखापरीक्षण र संसद सेवा' },
  { e: '🎖️', t: 'Rank', d: 'Gazetted Third Class (रा.प. तृतीय) — Section Officer or equivalent' },
  { e: '🎓', t: 'Eligibility', d: 'Bachelor\u2019s degree · age 21–35 (inclusive groups +5 years)' },
  { e: '➖', t: 'Negative marking', d: 'Stage I MCQ: −20% per wrong answer — guess only when 2 options are eliminated' },
  { e: '🏆', t: 'Final merit', d: '300 (3 written papers) + 60 (skill · group · interview) = 360 marks' },
  { e: '🚫', t: 'Screening rule', d: 'Stage I (AAT) marks do NOT count in the final merit — it only opens the gate' },
];

// ---------- curriculum (papers & topics) ----------
// Topic ids must be `${paperId}-${n}` — progress is stored under them.
export const SO_PAPERS = [
  {
    id: 'p1', emoji: '🧠', tag: 'Stage I · Screening',
    name: 'Administrative Aptitude Test', ne: 'प्रशासनिक अभिरुचि परीक्षण (AAT)',
    marks: 100, time: '1h 30m', pass: 45, q: '100 MCQs × 1 mark',
    note: 'Part A: General Awareness 50 · Part B: Aptitude 30 · Part C: English 20. Pass this to reach the main exam — marks do not count in merit.',
    topics: [
      'Nepal — geography, history, society & culture',
      'Nepal — economy, development & key data',
      'Nepal — constitution, politics & latest acts',
      'World — organizations, capitals & current events',
      'Science, technology & environment basics',
      'Verbal reasoning & IQ drill',
      'Numerical reasoning — math & data interpretation',
      'English — grammar, vocabulary & usage',
      'English — comprehension practice',
      'Full mock test — 100 Q · 90 min (weekly)',
    ],
  },
  {
    id: 'p2', emoji: '🏛️', tag: 'Stage II · Paper 2',
    name: 'Governance Systems', ne: 'शासन प्रणाली',
    marks: 100, time: '3h', pass: 40, q: '10 questions × 10 marks',
    note: 'The highest-scoring paper — a deep but stable syllabus. Master the Constitution first.',
    topics: [
      'शासनका सैद्धान्तिक पक्ष — state, democracy & governance theories',
      'नेपालको संविधान २०७२ — all parts, schedules & preamble',
      'संवैधानिक निकाय — formation, roles & inter-relation',
      'नेपाली प्रशासनको विकासक्रम — Lichhavi era to present',
      'संघीय संरचना — three tiers & distribution of powers',
      'प्रदेश र स्थानीय तह — structures & service delivery',
      'लोक सेवा आयोग — functions & civil service system',
      'नागरिक सेवा ऐन र नियमावली — rights, duties & discipline',
      'सुशासन — indicators, transparency & accountability',
      'तुलनात्मक शासन प्रणाली — UK, USA, India & UN systems',
      'अर्थ विकास — budget, planning & NPC',
      'अन्तर्राष्ट्रिय कानुन — treaties, agreements & organizations',
    ],
  },
  {
    id: 'p3', emoji: '📰', tag: 'Stage II · Paper 3',
    name: 'Contemporary Issues', ne: 'समसामयिक घटना',
    marks: 100, time: '3h', pass: 40, q: '10 questions × 10 marks',
    note: 'This paper lives in your daily newspaper — 30 minutes a day, every single day.',
    topics: [
      'राष्ट्रिय राजनीतिक घटनाक्रम — last 12 months',
      'संविधान कार्यान्वयन — debates, amendments & courts',
      'आर्थिक पहल — budget, economic survey & indices',
      'सामाजिक आन्दोलन र विवाद — issues & commissions',
      'विदेश नीति — neighbours & strategic partners',
      'अन्तर्राष्ट्रिय घटनाक्रम — regional & global',
      'SDGs — goals, targets & Nepal\u2019s progress',
      'वातावरण र जलवायु — COP, disasters & climate',
      'पुरस्कार, खेलकुद र पुस्तक — annual roundup',
      'Monthly current-affairs notes — write & revise',
    ],
  },
  {
    id: 'p4', emoji: '⚙️', tag: 'Stage II · Paper 4',
    name: 'Service-Related Subject', ne: 'सेवा सम्बन्धी विषय',
    marks: 100, time: '3h', pass: 40, q: '10 questions × 10 marks',
    note: 'Administration group: management theory, office & financial administration.',
    topics: [
      'व्यवस्थापनका सिद्धान्त — planning, organizing, directing, controlling',
      'नेतृत्व र प्रेरणा — Maslow, Herzberg & leadership styles',
      'कार्यालय व्यवस्थापन — टिप्पणी, आदेश र O&M',
      'आर्थिक प्रशासन — budget process & महालेखा',
      'नेपालको अर्थतन्त्र — GDP, banks, trade & NRB policy',
      'नागरिक सेवा — structure, conduct & promotion',
      'भ्रष्टाचार नियन्त्रण — CIAA, prevention & good practice',
      'सूचना प्रविधि — e-governance & digital services',
      'परियोजना व्यवस्थापन — NPC, SDG & project cycle',
      'कानुनी पक्ष — procurement, RTI & labour acts',
      'Case practice — सेवाप्रवाह & office administration questions',
    ],
  },
  {
    id: 'p5', emoji: '🎤', tag: 'Final Stage · 60 marks',
    name: 'Skill Test, Group Test & Interview', ne: 'सीप, समूह परीक्षण र अन्तर्वार्ता',
    marks: 60, time: '20 min + presentation', pass: '—', q: 'IT 10 · Group 10 · Interview 40',
    note: 'The written exam gets you in — the final stage decides the list. Practise typing daily.',
    topics: [
      'देवनागरी टाइपिङ — 10 minutes daily practice',
      'English typing — 5-minute drill',
      'MS Word — formatting & official documents',
      'Excel — SUM, AVERAGE, IF, COUNT, MAX + charts',
      'PowerPoint — clean presentation skills',
      'Email & internet — basics + netiquette',
      'Group test — individual presentation practice',
      'Interview — self-intro, why officer, district facts & mocks',
    ],
  },
].map(p => ({
  ...p,
  topics: p.topics.map((t, i) => ({ id: `${p.id}-${i + 1}`, t })),
}));

// ---------- daily discipline checklist (resets every morning) ----------
export const SO_DISCIPLINE = [
  { e: '🌅', t: 'Wake at 5 AM — first study block before sunrise' },
  { e: '📵', t: 'Phone in another room during study blocks' },
  { e: '📚', t: '2 theory blocks done (Paper II / III / IV)' },
  { e: '📰', t: '30 min current affairs + bullet notes' },
  { e: '✍️', t: '1 full 10-mark answer written' },
  { e: '🔁', t: 'Revised yesterday\u2019s notes (1-2-4-7 rule)' },
  { e: '🏃', t: '30 min walk / exercise' },
  { e: '😴', t: 'Lights out by 10 PM — 7h sleep minimum' },
];

// ---------- time management plans ----------
export const SO_PLANS = [
  {
    id: 'min', emoji: '🌙', name: 'Minimum', hours: 3, for: 'Busy days · job holders',
    blocks: [
      { time: '06:00–07:30', d: 1.5, t: 'Main theory — Paper II ⇄ IV (alternate days)' },
      { time: '08:00–08:30', d: 0.5, t: 'Current affairs + 5 bullet notes' },
      { time: '21:00–22:00', d: 1, t: 'MCQ drill / 1 written answer + revision' },
    ],
  },
  {
    id: 'std', emoji: '⚡', name: 'Standard', hours: 6, for: 'The winning average',
    blocks: [
      { time: '05:30–06:00', d: 0.5, t: 'Wake · walk · plan the day' },
      { time: '06:00–07:30', d: 1.5, t: 'Paper II — शासन प्रणाली' },
      { time: '09:00–10:00', d: 1, t: 'Paper IV — सेवा सम्बन्धी' },
      { time: '11:00–11:30', d: 0.5, t: 'Current affairs + notes' },
      { time: '14:00–15:00', d: 1, t: 'Answer writing — 2 × 10-mark questions' },
      { time: '17:00–17:30', d: 0.5, t: 'AAT MCQ drill — 30 questions' },
      { time: '20:30–21:30', d: 1, t: 'Revision + tomorrow\u2019s plan' },
    ],
  },
  {
    id: 'max', emoji: '🔥', name: 'Full Power', hours: 10, for: 'Full-time aspirant mode',
    blocks: [
      { time: '05:00–05:30', d: 0.5, t: 'Wake · walk · plan' },
      { time: '05:30–07:30', d: 2, t: 'Paper II — deep study + notes' },
      { time: '08:00–09:30', d: 1.5, t: 'Paper IV — deep study' },
      { time: '10:00–10:30', d: 0.5, t: 'Current affairs' },
      { time: '11:00–12:30', d: 1.5, t: 'Paper III — weekly themes + notes' },
      { time: '13:30–15:00', d: 1.5, t: 'Answer writing — 4 questions + review' },
      { time: '15:30–16:30', d: 1, t: 'AAT mock — 50 MCQ set' },
      { time: '17:30–18:30', d: 1, t: 'Revision — 1-2-4-7 queue' },
      { time: '20:00–20:30', d: 0.5, t: 'Weak-area repair' },
    ],
  },
];

// Total focused study hours the full syllabus realistically needs.
export const SO_HOURS = 1000;

// ---------- motivation ----------
export const SO_MOTIVATION = [
  'जुन दिन तिमी अल्छी छौ, त्यही दिनको पढाइले भविष्य बनाउँछ।',
  'Selection is not luck — it is 1,000 quiet hours.',
  'तिम्रो प्रतिस्पर्धी पनि अहिले पढ्दैछ — एक पाना बढी पढ।',
  '80% revision + 20% reading = a selected candidate.',
  'An officer\u2019s seat is earned one disciplined morning at a time.',
  'लोक सेवा भाग्य होइन — निरन्तर मेहनतको नतिजा हो।',
  'Streak beats speed: 3 hours daily > 10 hours weekly.',
  'Write today what you will read in the exam hall.',
  'अहिलेको सानो त्याग, भोलिको ठूलो सम्मान।',
  'The exam hall rewards the calmest hand, not the fastest.',
  'परीक्षा भन्दा पहिले तयारीले नै नतिजा लेखिसकेको हुन्छ।',
  'Start where you are — one chapter today beats the whole book never.',
];

export const SO_AFFIRM = [
  'I am preparing like the officer I will become.',
  'Discipline today, selection tomorrow.',
  'मेरो धैर्य नै मेरो नतिजा हो।',
  'I don\u2019t chase luck — I build marks.',
  'Every revision makes my answer sharper.',
  'सानो कोठा, ठूलो सपना — म गर्छु।',
];

export const SO_RULES = [
  'Same wake time daily — body first, book second.',
  'No zero days — 30 minutes minimum, always.',
  'Finish the block before touching the phone.',
  'Notes over books in revision weeks.',
  'Simulate the exam every Sunday — same 3 hours, same pen.',
];

// ---------- strategy vault (tap-to-open modals) ----------
export const SO_TIPS = [
  {
    id: 'write', e: '📝', t: 'How to write a 10-mark answer',
    d: 'The formula examiners reward — intro, points, diagram, conclusion.',
    lines: [
      'Plan 2 minutes first: read the question twice, note 6–8 points before writing.',
      'Open with a 2-line definition or a constitutional quote (भूमिका).',
      'Write in numbered points — one idea per point, short sentences.',
      'Add 1 flowchart, table or diagram — visual answers score higher.',
      'Sprinkle current data: budget figures, indices, committee names.',
      'Close with a forward-looking निष्कर्ष — a 2-line recommendation.',
      'Time budget: 18 minutes per question — 10 Q × 18 min = 3 hours.',
    ],
  },
  {
    id: 'revise', e: '🔁', t: 'The 1-2-4-7 revision rule',
    d: 'Spaced repetition — the only reason top scorers remember everything.',
    lines: [
      'Revise a topic the same evening it was studied (day 1).',
      'Revise again after 2 days, then after 4 days, then after 7 days.',
      'Keep 1-page notes per topic — revise from notes, not from books.',
      'Sunday = weekly revision day; month-end = full sweep.',
      'If you can\u2019t recall it from notes, it isn\u2019t learned yet.',
    ],
  },
  {
    id: 'paperday', e: '🗓️', t: 'Paper-day strategy',
    d: 'Walk out with 300 marks banked — calmly.',
    lines: [
      'Scan the whole paper for 5 minutes; mark your strongest questions.',
      'Answer sure marks first — bank the pass mark, then aim high.',
      'Never leave a question blank — even 5 points score 4–5 marks.',
      'Black-ink dot pen, clean margins, underline keywords.',
      'Keep a 15-minute buffer for review and question numbering.',
    ],
  },
  {
    id: 'kit', e: '📚', t: 'Resource kit',
    d: 'Few sources, many revisions — the winning rule.',
    lines: [
      'नेपालको संविधान (संशोधन सहित) — read the full text 3 times.',
      'One standard governance + one management noteset — finish, don\u2019t collect.',
      'Ekantipur / Gorkhapatra daily — 30 min for Paper III.',
      'Past 10 years\u2019 questions — solve them, don\u2019t just read them.',
      'Use the News tab in this app for daily headlines.',
    ],
  },
  {
    id: 'it', e: '💻', t: 'IT skill test — 10 marks, 20 minutes',
    d: 'The easiest marks in the whole exam — don\u2019t lose them.',
    lines: [
      'देवनागरी टाइपिङ 2.5 · English typing 2.5 · Word 1 · Excel 1 · PPT 1 · Email/Internet 2.',
      'Practise typing 10 minutes daily — speed decides the 5-mark half.',
      'Learn 5 Excel formulas: SUM, AVERAGE, IF, COUNT, MAX.',
      'Prepare 2 sample files: an official letter (Word) and a budget sheet (Excel).',
      'Windows basics, email & internet — revise shortcuts the night before.',
    ],
  },
  {
    id: 'joblife', e: '💼', t: 'Job + Lok Sewa — the dual life',
    d: 'Working full-time and still selecting — the proven formula.',
    lines: [
      'Mornings are sacred — the world can\u2019t touch 5–7 AM.',
      'Commute = audio revision. Never dead time.',
      'One deep evening block beats three tired ones — protect 90 minutes after dinner.',
      'Weekday minimum 3h; your day off = 10h full-power day.',
      'Tell your family the plan — they will guard your evenings for you.',
      'Energy > time: a 20-minute walk after work buys 2 good study hours.',
    ],
  },
  {
    id: 'interview', e: '🎤', t: 'Interview — 40 marks',
    d: 'Confidence is a skill — rehearse it like one.',
    lines: [
      'Prepare a 90-second self-intro in Nepali and in English.',
      'Answer \u201cwhy section officer?\u201d with service, not salary.',
      'Know your province & district: population, resources, major schemes.',
      'Read today\u2019s headlines before you walk in.',
      'Dress formal, sit straight, finish sentences — no \u201cumm\u201d endings.',
    ],
  },
];

// ---------- occupation-aware smart scheduler ----------
// Real Nepali working-hour templates. Every value is editable afterwards
// (✏️ in the schedule card) — these are smart defaults, not rules.

export const toMin = hhmm => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};
export const toHM = min => {
  min = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
};

export const SO_OCCUPATIONS = [
  {
    id: 'teacher', emoji: '👩‍🏫', name: 'School Teacher', ne: 'शिक्षक / शिक्षिका',
    job: true, start: '09:00', end: '16:00', commute: 30, lunch: true,
    tips: [
      'Your golden hours: 05:50–07:40 before school and 17:15–21:00 after — guard them like exam days.',
      'Tiffin & free periods = flashcards + 10 MCQs, not staff-room gossip.',
      'Teach-to-learn: explain a topic aloud as if to your class — the strongest revision trick a teacher owns.',
    ],
  },
  {
    id: 'gov', emoji: '🏛️', name: 'Government Office', ne: 'सरकारी कार्यालय',
    job: true, start: '09:00', end: '17:00', commute: 30, lunch: true,
    tips: [
      'Government 9–5: your weapon is the 90 minutes before office — nothing can touch it.',
      'Lunch hour = newspaper hour — Gorkhapatra + bullet notes for Paper III.',
      'You see governance daily — connect office life to your Paper II & IV answers.',
    ],
  },
  {
    id: 'officer', emoji: '👨‍💼', name: 'Administrator', ne: 'प्रशासक / अधिकृत',
    job: true, start: '09:00', end: '17:00', commute: 30, lunch: true,
    tips: [
      'Meeting-heavy days — anchor the morning block; meetings can\u2019t touch 5–7 AM.',
      'Drafting files at work? Your टिप्पणी practice is free Paper IV preparation.',
      'The evening block starts the moment you reach home — change clothes, then books.',
    ],
  },
  {
    id: 'assistant', emoji: '📝', name: 'Assistant / Clerk', ne: 'सहायक / कर्मचारी',
    job: true, start: '10:00', end: '17:00', commute: 30, lunch: true,
    tips: [
      'Assistants get micro-windows — keep flashcards on the phone, not social media.',
      'A 10 AM duty start = a calm 90-minute morning block — give it the hardest paper.',
      'Leave office on time twice a week — that\u2019s 3 extra study hours you own.',
    ],
  },
  {
    id: 'private', emoji: '💼', name: 'Private Company', ne: 'निजी कम्पनी',
    job: true, start: '09:30', end: '17:30', commute: 30, lunch: true,
    tips: [
      'Private jobs drain evenings — win the day with the morning block first.',
      'Commute + lunch micro-study quietly adds ~1 hour daily without you feeling it.',
      'Target 5h on weekdays — your day off doubles the weekly total.',
    ],
  },
  {
    id: 'bank', emoji: '🏦', name: 'Bank Employee', ne: 'बैंक कर्मचारी',
    job: true, start: '10:00', end: '16:00', commute: 30, lunch: true,
    tips: [
      'Banks close at 4 — you hold the best evening window of any job. Use 5–8 PM.',
      'Day off = full-power day. Guard it from social plans.',
      'Counter idle minutes = mental math + current-affairs recall drills.',
    ],
  },
  {
    id: 'police', emoji: '👮', name: 'Security Forces', ne: 'प्रहरी / सेना',
    job: true, start: '07:00', end: '17:00', commute: 30, lunch: true,
    tips: [
      'Shifts change — the rule doesn\u2019t: always study the 90 minutes before duty.',
      'Night duty? Flip the plan: sleep first, study after waking, revise before shift.',
      'PT time is thinking time — listen to current-affairs audio while you run.',
    ],
  },
  {
    id: 'health', emoji: '🏥', name: 'Health Worker', ne: 'स्वास्थ्यकर्मी',
    job: true, start: '08:00', end: '16:00', commute: 30, lunch: true,
    tips: [
      'Hospital hours are unpredictable — carry one pocket noteset everywhere.',
      'The pre-duty morning block is your anchor — let ward chaos never touch it.',
      'After night shifts: revise only — 1h of notes beats 3h of heavy reading.',
    ],
  },
  {
    id: 'abroad', emoji: '🌍', name: 'Abroad Worker', ne: 'वैदेशिक रोजगार',
    job: true, start: '09:00', end: '18:00', commute: 30, lunch: true,
    tips: [
      'Long shifts — study in two short blocks: 45 minutes before, 60 after duty.',
      'Your day off is the Paper II deep-study day — protect it fiercely.',
      'Audio revision on breaks; full written practice only on the day off.',
    ],
  },
  {
    id: 'home', emoji: '🏠', name: 'Homemaker', ne: 'गृहिणी',
    job: false,
    tips: [
      'Build the day around household peaks — quiet hours are your study hours.',
      'Two deep blocks + one revision block daily = full-time level progress.',
      'The 1-2-4-7 rule fits perfectly between household routines.',
    ],
  },
  {
    id: 'student', emoji: '🎓', name: 'Full-time Aspirant', ne: 'फुल-टाइम तयारी',
    job: false,
    tips: [
      'You have the gift others pray for — 10 focused hours a day.',
      'Same seat, same time, every day — ritual builds focus faster than mood.',
      'Rotate the 3 papers daily; keep one day weekly for mock + full revision.',
    ],
  },
  {
    id: 'free', emoji: '🚴', name: 'Freelancer / Flexible', ne: 'फ्रिलान्सर',
    job: false,
    tips: [
      'Your boss is you — book study blocks in the calendar like client meetings.',
      'Anchor two fixed blocks daily; freelance work fills the gaps around them.',
      'Plan the month, not the day — heavy weeks and light weeks balance out.',
    ],
  },
];

// Build the real study day around a job window (minutes since midnight).
// Study blocks are weighted — travel audio counts 50%.
export function buildJobPlan(start, end, commute = 30, lunch = true) {
  const S = toMin(start), E = toMin(end), C = Math.round(commute);
  const work = Math.max(60, E - S);
  let deep1 = 90;
  let wake = S - C - 70 - deep1;                     // prep + breakfast before duty
  if (wake < 285) { wake = 285; deep1 = Math.max(45, S - C - 70 - wake); }
  const B = [];
  const add = (s, e, k, w, t, ne) => { if (e > s) B.push({ s, e, k, w, t, ne }); };
  add(wake, wake + 20, 'wake', 0, 'Wake · fresh · plan the day', 'उठ्नुहोस् · योजना');
  if (wake + 20 + deep1 <= S - C - 10)
    add(wake + 20, wake + 20 + deep1, 'deep', 1, 'Deep study — Paper II ⇄ IV (alternate days)', 'बिहानको गहिरो पढाइ');
  add(wake + 20 + deep1, S - C, 'prep', 0, 'Get ready · breakfast', 'तयारी · खाजा');
  if (C >= 15) add(S - C, S, 'audio', .5, 'Commute — current-affairs audio + 5 bullets', 'बाटोमा समसामयिकी');
  add(S, E, 'job', 0, 'Job time — work with pride', 'कार्यको समय');
  if (lunch && work >= 300) {
    const m = S + Math.round(work / 2);
    add(m, m + 30, 'micro', 1, 'Lunch break — flashcards · 10 MCQs', 'खाजा — फ्लासकार्ड');
  }
  if (C >= 15) add(E, E + C, 'audio', .5, 'Commute home — revise the morning notes', 'घर फर्किँदै पुनरावलोकन');
  let t = E + C;
  add(t, t + 45, 'rest', 0, 'Rest · snack · family — no guilt', 'आराम · परिवार');
  t += 45;
  const bedTarget = (wake - 450 + 1440) % 1440;      // ≈7.5h sleep before wake
  let chain = [
    { m: 90, k: 'deep', w: 1, t: 'Evening deep — main theory + notes', ne: 'साँझको गहिरो पढाइ' },
    { m: 30, k: 'rest', w: 0, t: 'Dinner · short walk', ne: 'खाना · हिँडाइ' },
    { m: 60, k: 'revise', w: 1, t: 'Revision — 1-2-4-7 queue + MCQ drill', ne: 'पुनरावलोकन' },
    { m: 30, k: 'write', w: 1, t: 'Answer writing — 1 × 10-mark question', ne: 'उत्तर लेखन' },
  ];
  const fits = arr => arr.reduce((a, s) => a + s.m, 0) + t + 15 <= bedTarget;
  if (!fits(chain)) chain = [
    { m: 60, k: 'deep', w: 1, t: 'Evening deep — main theory', ne: 'गहिरो पढाइ' },
    { m: 25, k: 'rest', w: 0, t: 'Dinner', ne: 'खाना' },
    { m: 40, k: 'revise', w: 1, t: 'Revision — notes + MCQs', ne: 'पुनरावलोकन' },
  ];
  if (!fits(chain)) chain = [
    { m: 45, k: 'deep', w: 1, t: 'Core evening study', ne: 'साँझको पढाइ' },
    { m: 20, k: 'rest', w: 0, t: 'Dinner', ne: 'खाना' },
    { m: 30, k: 'revise', w: 1, t: 'Notes revision', ne: 'पुनरावलोकन' },
  ];
  chain.forEach(s => { add(t, t + s.m, s.k, s.w, s.t, s.ne); t += s.m; });
  const bed = t + 15;
  return { blocks: B, wake, bed, min: B.reduce((a, b) => a + (b.e - b.s) * b.w, 0), sleepH: (1440 - bed + wake) / 60 };
}

// Full-day plan — holidays (बिदा) and no-fixed-job occupations. ≈10 focused hours.
export function buildFreePlan() {
  const B = [];
  const add = (s, e, k, w, t, ne) => { if (e > s) B.push({ s, e, k, w, t, ne }); };
  add(330, 350, 'wake', 0, 'Wake · fresh · plan the day', 'उठ्नुहोस् · योजना');
  add(350, 470, 'deep', 1, 'Deep study — Paper II · शासन प्रणाली', 'गहिरो पढाइ');
  add(470, 500, 'prep', 0, 'Breakfast · freshen up', 'खाजा');
  add(500, 600, 'deep', 1, 'Deep study — Paper IV · सेवा सम्बन्धी', 'गहिरो पढाइ');
  add(600, 630, 'micro', 1, 'Current affairs + 10 bullet notes', 'समसामयिकी');
  add(630, 660, 'rest', 0, 'Break · walk · tea', 'ब्रेक');
  add(660, 780, 'deep', 1, 'Deep study — Paper III / weakest paper', 'गहिरो पढाइ');
  add(780, 840, 'rest', 0, 'Lunch · proper rest', 'खाजा');
  add(840, 930, 'write', 1, 'Answer writing — 3 × 10-mark + review', 'उत्तर लेखन');
  add(930, 990, 'revise', 1, 'AAT drill — 50 MCQ mock', 'MCQ अभ्यास');
  add(990, 1020, 'rest', 0, 'Walk · recharge', 'हिँडाइ');
  add(1020, 1080, 'revise', 1, 'Revision — 1-2-4-7 queue', 'पुनरावलोकन');
  add(1110, 1260, 'rest', 0, 'Evening free — family · calls · rest', 'साँझ स्वतन्त्र');
  add(1260, 1290, 'micro', 1, 'Headline sweep + tomorrow\u2019s plan', 'भोलिको योजना');
  return { blocks: B, wake: 330, bed: 1305, min: B.reduce((a, b) => a + (b.e - b.s) * b.w, 0), sleepH: 7.75 };
}

// ---------- 20 world-class study techniques (competitive exams) ----------
// cats: mem memory · foc focus · tim time · pra practice · min mind
export const SO_TEQ_CATS = [
  { id: 'all', e: '✨', n: 'All' },
  { id: 'mem', e: '🧠', n: 'Memory' },
  { id: 'foc', e: '🌊', n: 'Focus' },
  { id: 'tim', e: '⏱️', n: 'Time' },
  { id: 'pra', e: '🏋️', n: 'Practice' },
  { id: 'min', e: '💫', n: 'Mind' },
];
const catName = c => (SO_TEQ_CATS.find(x => x.id === c) || {}).n || c;

export const SO_TECHNIQUES = [
  {
    id: 'pareto', e: '🎯', cat: 'tim', name: '80/20 Rule', ne: '८०/२० नियम',
    tag: '20% of topics carry 80% of the marks',
    why: 'The Pareto principle: marks are unevenly distributed. A handful of high-frequency topics has produced most questions historically — studying them first multiplies every hour you invest.',
    steps: [
      'Collect the last 10 years of question papers (all 3 written papers).',
      'Tag every topic by how often it appears — make a frequency table.',
      'Rank topics by marks-per-hour: frequency × weight ÷ study time.',
      'Make the top 20% exam-proof before touching anything else.',
      'Re-run the audit monthly — the 20% shifts as you mature.',
    ],
    best: ['Paper II', 'Paper IV', 'Start of prep'],
    tip: 'When you feel behind, cut breadth — never depth on the 20%.',
  },
  {
    id: 'recall', e: '🧠', cat: 'mem', name: 'Active Recall', ne: 'सक्रिय सम्झना',
    tag: 'Testing yourself beats rereading — every time',
    why: 'The testing effect: effortful retrieval strengthens memory far more than review. Every pull from memory widens the path — rereading only makes the book familiar, not you.',
    steps: [
      'Close the book after every topic.',
      'Write all you remember on blank paper — 5 minutes, no peeking.',
      'Open the book and mark the misses in red.',
      'Turn every miss into a question for tomorrow.',
      'Never count pages read — count questions answered.',
    ],
    best: ['Theory papers', 'AAT', 'Daily'],
    tip: 'If recall feels hard, that is the feeling of learning — not failing.',
  },
  {
    id: 'spaced', e: '🔁', cat: 'mem', name: 'Spaced Repetition', ne: 'अन्तराल पुनरावृत्ति',
    tag: 'The 1-2-4-7 rule — revise before forgetting begins',
    why: 'The forgetting curve drops fastest in the first 48 hours. Each well-timed revision flattens it — day 1, 2, 4 and 7 reviews cost little but make memory nearly permanent.',
    steps: [
      'Revise a topic the same evening you study it (day 1).',
      'Revise again after 2 days, then 4, then 7 — keep a simple queue.',
      'Revise from 1-page notes, never from the book.',
      'A topic that survives day 7 joins the Sunday weekly sweep.',
      'Recall failed? Restart the cycle for that topic.',
    ],
    best: ['Notes', 'Current affairs', 'All papers'],
    tip: 'Ten short revisions beat one long one — schedule them like medicine.',
  },
  {
    id: 'pomodoro', e: '🍅', cat: 'foc', name: 'Pomodoro Sprints', ne: 'पोमोडोरो',
    tag: '25-minute sprints with 5-minute breaks',
    why: 'Focus tires in waves. Short timed sprints create urgency (a tiny deadline), and fixed breaks stop burnout before it starts — perfect after a full workday when energy runs low.',
    steps: [
      'Pick ONE task for the sprint — one topic, one question set.',
      'Set 25 minutes; phone in another room, timer visible.',
      'Work till the bell — no pausing, no quick checks.',
      'Take 5 minutes off — stand, water, window. No screens.',
      'Every 4 sprints, take 20–30 minutes off.',
    ],
    best: ['Evening blocks', 'Low-energy days', 'MCQ drills'],
    tip: 'Can\u2019t do 25? Run 15 — a short sprint still beats an open-ended hour.',
  },
  {
    id: 'feynman', e: '👨‍🏫', cat: 'min', name: 'Feynman Technique', ne: 'फाइनम्यान',
    tag: 'If you can\u2019t explain it simply, you don\u2019t know it',
    why: 'Named for the Nobel physicist: explaining in plain words exposes fake understanding instantly. Teaching is the highest form of recall — explainers remember far more than readers.',
    steps: [
      'Pick one concept — संघीयता, budget cycle, Maslow.',
      'Explain it aloud in simple Nepali, as if to a class-10 student.',
      'Note every stumble or jargon used as a shield.',
      'Return to the source ONLY for those exact gaps.',
      'Repeat until the explanation flows without notes.',
    ],
    best: ['Paper II', 'Interview', 'Group test'],
    tip: 'As a teacher you own this one — your class is your lab. Teach to learn.',
  },
  {
    id: 'interleaving', e: '🔀', cat: 'pra', name: 'Interleaving', ne: 'मिश्रित अभ्यास',
    tag: 'Mix papers in one session — sharper recall',
    why: 'Blocked study (AAA-BBB) feels smooth but builds fragile memory. Mixing (A-B-A-C) forces the brain to choose the right strategy each time — exactly what mixed exam papers demand.',
    steps: [
      'Rotate inside one block: 25 min Paper II → 25 min Paper IV.',
      'Mix question types too — theory, MCQ, answer writing.',
      'Keep it deliberate: two topics max per block.',
      'Feeling harder than blocked study is normal — that IS the mechanism.',
      'Use the schedule\u2019s alternate-day rule as your backbone.',
    ],
    best: ['Evening study', 'Revision weeks', 'Final month'],
    tip: 'Exam papers are interleaved by design — train the way you\u2019ll be tested.',
  },
  {
    id: 'deliberate', e: '🏋️', cat: 'pra', name: 'Deliberate Practice', ne: 'उद्देश्यपूर्ण अभ्यास',
    tag: 'Practice at the edge of ability, with feedback',
    why: 'Repetition alone plateaus. Skill grows in the discomfort zone: attempts slightly beyond current level + immediate feedback + targeted repair. Comfortable practice maintains; uncomfortable practice grows.',
    steps: [
      'Find your weakest question type — data answer? case? essay flow?',
      'Practice ONLY that type for a full week, 1–2 attempts daily.',
      'Score yourself against a model answer the same evening.',
      'Fix ONE specific flaw per attempt — structure, data, or speed.',
      'When it gets easy, move to the next-weakest edge.',
    ],
    best: ['Answer writing', 'Weak areas', 'Final 60 days'],
    tip: 'Average practice makes you average — targeted discomfort makes you selected.',
  },
  {
    id: 'pastpapers', e: '📜', cat: 'pra', name: 'Past-Paper Mining', ne: 'पुराना प्रश्नपत्र',
    tag: '10 years of questions = the real syllabus',
    why: 'PSC repeats themes, phrasing and structures far more than candidates realize. Mining past papers shows what examiners actually reward — turning 100 pages of syllabus into a prioritized map.',
    steps: [
      'Collect the last 10 years\u2019 papers across all groups.',
      'Solve by hand — reading solutions teaches nothing.',
      'Group questions by topic; the repeats are your core list.',
      'Build model answer skeletons for the top 30 questions.',
      'Redo the full set in the final month at exam speed.',
    ],
    best: ['All papers', 'Medium term', 'Marks hacking'],
    tip: 'A question solved twice is worth ten topics read once.',
  },
  {
    id: 'mock', e: '⏱️', cat: 'pra', name: 'Mock Exam Simulation', ne: 'मक एक्जाम',
    tag: 'Simulate the real 3 hours — same clock, same pen',
    why: 'Exam skill is separate from knowledge: pacing, question selection, hand speed, nerves. Only full simulation trains the real skill — and it converts exam-day anxiety into familiarity.',
    steps: [
      'Every Sunday: one full 3-hour paper, same time as the real slot.',
      'Same conditions — black pen, no phone, printed paper, proper desk.',
      'Practice scan-first: bank sure marks before ambitions.',
      'Track time-per-question and the 15-minute review buffer.',
      'Log every error into the mistake notebook after each mock.',
    ],
    best: ['Sundays', 'Final 3 months', 'Speed'],
    tip: 'Your first full mock must happen 60+ days out — never on exam day.',
  },
  {
    id: 'errorlog', e: '📔', cat: 'pra', name: 'Mistake Notebook', ne: 'गल्ती खाता',
    tag: 'Your mistakes are a private question bank',
    why: 'Errors repeat because the correction is forgotten, not the error. A written mistake log turns every slip into a flashcard — your highest-yield revision material by the final month.',
    steps: [
      'Keep one notebook (or note app) ONLY for mistakes.',
      'Record: question → my answer → correct answer → why I erred.',
      'Tag each: concept gap / misread / time pressure / guess.',
      'Re-read the log weekly; kill one pattern at a time.',
      'Clear an entry only after getting it right 3 times.',
    ],
    best: ['MCQs', 'Mock season', 'Negative marking'],
    tip: 'In a −20% marking exam, killing silly errors IS scoring marks.',
  },
  {
    id: 'cornell', e: '📓', cat: 'mem', name: 'Cornell Notes', ne: 'कर्नेल नोट',
    tag: 'Notes built for recall, not for reading',
    why: 'The split page forces processing: a narrow cue column turns every revision into self-testing. Notes designed for review are shorter, sharper, and re-readable in minutes.',
    steps: [
      'Split the page: right 70% notes · left 30% cues · bottom summary.',
      'Notes: keywords, arrows, abbreviations — never copied sentences.',
      'After study, fill cues as questions (\u201c3 tiers of government?\u201d).',
      'Write a 2-line summary at the bottom in your own words.',
      'Revise by covering notes and answering cues.',
    ],
    best: ['Note-making', 'Paper II', 'Revision'],
    tip: 'One page of cues can rebuild a whole chapter — that\u2019s the goal.',
  },
  {
    id: 'mindmap', e: '🗺️', cat: 'mem', name: 'Mind Maps', ne: 'माइन्ड म्याप',
    tag: 'See the whole topic on one page',
    why: 'Linear notes hide structure; maps show it. Radiating branches mirror how memory links ideas — perfect for governance topics with many connected parts.',
    steps: [
      'Topic in the centre — e.g., संघीय संरचना.',
      'Main branches for parts, sub-branches for details — one keyword each.',
      'Color-code branches; draw arrows for relationships.',
      'Add tiny icons — visuals glue memory (dual coding!).',
      'Redraw the map from memory a week later — the redraw IS the revision.',
    ],
    best: ['Paper II', 'Constitution', 'Answer planning'],
    tip: 'Redraw your map in the exam\u2019s 2-minute planning window — instant outline.',
  },
  {
    id: 'palace', e: '🏛️', cat: 'mem', name: 'Memory Palace', ne: 'स्मृति महल',
    tag: 'Park lists inside rooms you know by heart',
    why: 'Spatial memory is the oldest, strongest memory system humans have. Attaching abstract lists to vivid places and images makes unmemorable sequences (articles, committees) sticky by default.',
    steps: [
      'Choose a route you know cold — your home, your walk to school.',
      'Number 10–20 fixed stations along it.',
      'Convert list items into vivid, absurd images at each station.',
      'Walk the route mentally — your morning walk is perfect for this.',
      'One palace per theme: संवैधानिक निकाय, committees, schedules.',
    ],
    best: ['Lists', 'AAT', 'Committees & articles'],
    tip: 'The weirder the image, the stronger the hook — boring images fall off.',
  },
  {
    id: 'dualcode', e: '🎨', cat: 'mem', name: 'Dual Coding', ne: 'डुअल कोडिङ',
    tag: 'Words + pictures = two memory channels',
    why: 'The brain stores verbal and visual information separately; combining them doubles retrieval routes. Diagrams also score better — examiners reward visible structure.',
    steps: [
      'Turn every process into a flowchart — budget cycle, O&M, promotion.',
      'Turn comparisons into tables — UK vs USA, संघ vs प्रदेश.',
      'Draw them yourself — the drawing IS the encoding.',
      'Reuse your diagrams inside written answers, labelled.',
      'Keep a diagram sheet per paper — 10–15 total.',
    ],
    best: ['Answer writing', 'Paper IV', 'Process topics'],
    tip: 'One good flowchart in an answer can lift it a full grade band.',
  },
  {
    id: 'sq3r', e: '📖', cat: 'foc', name: 'SQ3R Reading', ne: 'एस-क्यू-थ्री-आर',
    tag: 'Survey → Question → Read → Recite → Review',
    why: 'Cover-to-cover reading wastes attention on what was never asked. SQ3R loads questions FIRST, so the brain reads like a hunter, not a tourist — retention jumps without extra hours.',
    steps: [
      'Survey: skim headings, maps, summary — 3 minutes.',
      'Question: turn each heading into a question you want answered.',
      'Read: hunt YOUR questions, not every line.',
      'Recite: close the book, say the answers aloud.',
      'Review: same evening, then the 1-2-4-7 queue.',
    ],
    best: ['Thick books', 'Standard texts', 'First read'],
    tip: 'Never start reading without a question in your head.',
  },
  {
    id: 'frog', e: '🐸', cat: 'tim', name: 'Eat the Frog', ne: 'कठिन पहिले',
    tag: 'Hardest task first — every single day',
    why: 'Willpower peaks early and decays with every decision. Doing the hardest topic in your freshest hour guarantees it gets done — and every later task feels lighter by comparison.',
    steps: [
      'Each night, write tomorrow\u2019s frog: the ONE hardest task.',
      'Kill it in your first study block — before messages, before easy topics.',
      'Keep it small enough to finish in 60–90 minutes.',
      'Reward the kill — then the day runs on momentum.',
      'Frog not done? It becomes tomorrow\u2019s frog — no escape.',
    ],
    best: ['Morning block', 'Weekdays', 'Procrastination'],
    tip: 'Win the first hour and the whole day follows.',
  },
  {
    id: 'timeblock', e: '🕐', cat: 'tim', name: 'Time Blocking', ne: 'समय ब्लकिङ',
    tag: 'Give every hour a job before the day starts',
    why: 'Unscheduled time dissolves into \u201cI\u2019ll study after...\u201d. Pre-assigned blocks remove the deciding — the exhausting part — so you only execute. The job-aware schedule above is your block plan.',
    steps: [
      'Every evening, assign tomorrow\u2019s blocks: paper, topic, task.',
      'Match block to energy: deep → morning, drill → evening.',
      'Protect blocks like meetings — not movable by mood.',
      'Add a 30-minute buffer block for life\u2019s surprises.',
      'In the evening review: which block died, and why?',
    ],
    best: ['Job holders', 'Daily planning', 'Consistency'],
    tip: 'A planned average day beats a spontaneous perfect one.',
  },
  {
    id: 'flashreview', e: '⚡', cat: 'tim', name: '2-Minute Flash Review', ne: '२-मिनेट रिभिजन',
    tag: 'Micro-revision: 2 minutes, anywhere, anytime',
    why: 'Memory loves frequency more than duration. Two-minute reviews scattered through the day accumulate into hours of retrieval practice without ever feeling like study.',
    steps: [
      'Carry 20 pocket questions — cards or a note app.',
      'Rule: every idle 2 minutes = 1 card or 5 MCQs.',
      'Triggers: queue, bus stop, kettle boiling, ad break.',
      'Wrong card? Back of the deck — never out.',
      'Evening: restock 5 new cards for tomorrow.',
    ],
    best: ['Job time', 'Commute', 'Busy days'],
    tip: '20 idle minutes a day = 120 revisions a month = free marks.',
  },
  {
    id: 'sleep', e: '😴', cat: 'min', name: 'Sleep Consolidation', ne: 'निद्रा शक्ति',
    tag: 'Memory is written at night — protect 7–8 hours',
    why: 'Sleep is when the brain replays and files the day\u2019s learning; cutting it erases study you already paid for. A pre-sleep review rides the consolidation wave — the cheapest memory boost that exists.',
    steps: [
      'Fixed sleep & wake times — the schedule above already sets them.',
      'Last-15-minutes rule: flip through today\u2019s notes before lights out.',
      'Finish the block, then sleep — never study till dropping.',
      'After 10 PM screens off — blue light steals deep sleep.',
      'After night shifts: revise only, heavy study when rested.',
    ],
    best: ['Every night', 'Exam week', 'Health'],
    tip: 'Sleep is not the reward for studying — it\u2019s part of studying.',
  },
  {
    id: 'deepwork', e: '🌊', cat: 'foc', name: 'Deep Work 90s', ne: 'डिप वर्क',
    tag: '90-minute undistracted immersion, phone gone',
    why: 'Hard material needs long unbroken immersion where full concentration compounds. One protected 90-minute block outperforms a scattered afternoon of half-attention.',
    steps: [
      'Schedule one 90-minute deep block daily — morning is ideal.',
      'Phone in ANOTHER room — not silent, gone.',
      'Define the exit goal: \u201cसंविधान Part-1 finished + notes made\u201d.',
      'Distraction urge? Note it on paper, return to the task.',
      'End with 2-minute recall: what did I just build?',
    ],
    best: ['Morning block', 'Holidays', 'Hard topics'],
    tip: 'Focus is a place you go — build the room, then enter it.',
  },
].map(t => ({ ...t, catN: catName(t.cat) }));
