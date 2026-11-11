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
