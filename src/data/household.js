// GharGym — strength training with what every Nepali home already has:
// water bottles & gagri, rice sacks (bhaari), bricks, towels and stairs.
// No equipment cost, no gym membership — full programme guidance offline.

export const GITEMS = [
  { id: 'all', label: 'All' },
  { id: 'water', label: '💧 Water', grad: 'linear-gradient(135deg,#38bdf8,#0369a1 55%,#0c4a6e)', desc: 'Bottles & 5L gagri' },
  { id: 'sack', label: '🌾 Rice sack', grad: 'linear-gradient(135deg,#fbbf24,#b45309 55%,#451a03)', desc: 'Daal–bhaari power' },
  { id: 'brick', label: '🧱 Brick & stone', grad: 'linear-gradient(135deg,#f87171,#b91c1c 55%,#450a0a)', desc: 'Budget iron' },
  { id: 'towel', label: '🪢 Towel & belt', grad: 'linear-gradient(135deg,#a78bfa,#5b21b6 55%,#1e1b4b)', desc: 'Iso & mobility' },
  { id: 'chair', label: '🪑 Chair & stairs', grad: 'linear-gradient(135deg,#34d399,#047857 55%,#064e3b)', desc: 'Push, dip, climb' },
];

export const itemMeta = id => GITEMS.find(i => i.id === id) || GITEMS[0];

export const GHAREX = [
  // ---- 💧 Water: bottles & gagri ----
  {
    id: 'w-goblet', item: 'water', emoji: '🥤',
    name: 'Gagri Goblet Squat', nepali: 'गाग्री गोब्लेट स्क्वाट',
    muscles: 'Legs & glutes', dose: '3 × 12',
    steps: [
      'Hold a 5L gagri or big bottle by its sides at chest height.',
      'Feet shoulder-width, toes slightly out.',
      'Squat down until thighs are parallel, chest tall.',
      'Drive up through the heels and finish tall.',
    ],
    tip: 'More water = more weight. Open the cap and pour a little out to start light.',
  },
  {
    id: 'w-row', item: 'water', emoji: '🥤',
    name: 'One-Arm Bottle Row', nepali: 'बोतल एक-हात तान्ने',
    muscles: 'Back & arms', dose: '3 × 10 each arm',
    steps: [
      'Hinge at the hip, back flat, holding the bottle in one hand.',
      'Pull it to your hip while squeezing the shoulder blade.',
      'Lower slowly on a 2-count.',
      'Complete reps, then switch hands.',
    ],
    tip: 'Rest your knee on a chair to keep the lower back safe.',
  },
  {
    id: 'w-overhead', item: 'water', emoji: '🥤',
    name: 'Gagri Overhead Press', nepali: 'गाग्री ओभरहेड प्रेस',
    muscles: 'Shoulders & triceps', dose: '3 × 10',
    steps: [
      'Gagri at shoulder height, elbows in front of the body.',
      'Press straight overhead to full lockout.',
      'Lower slowly with control to the shoulder.',
      'Keep ribs down — do not lean back.',
    ],
    tip: 'Brace your abs like someone is about to poke your stomach.',
  },
  {
    id: 'w-swing', item: 'water', emoji: '💦',
    name: 'Gagri Swing', nepali: 'गाग्री स्विङ',
    muscles: 'Full body & heart', dose: '3 × 15',
    steps: [
      'Two-hand grip on the gagri handle, feet wide.',
      'Snap hips forward hard — the gagri floats up to chest height.',
      'Let it swing back between your legs and hinge again.',
      'Breathe out sharply at the top.',
    ],
    tip: 'The power comes from hips, not arms. Water sloshing = extra core work.',
  },
  {
    id: 'w-lateral', item: 'water', emoji: '🥤',
    name: 'Bottle Lateral Raise', nepali: 'बोतल साइड रेज',
    muscles: 'Shoulders', dose: '3 × 12',
    steps: [
      'Small bottle in each hand, arms by your side.',
      'Raise straight out to shoulder level, slightly leading with elbows.',
      'Pause a moment, then lower on a 3-count.',
      'Shoulders stay down and relaxed.',
    ],
    tip: 'Lighter is better here — slow tempo beats heavy swinging.',
  },

  // ---- 🌾 Rice sack ----
  {
    id: 's-hug', item: 'sack', emoji: '🌾',
    name: 'Sack Hug Squat', nepali: 'भारी गोब्लेट स्क्वाट',
    muscles: 'Legs & core', dose: '3 × 12',
    steps: [
      'Hug a sack of rice/dal tightly to your chest.',
      'Squat down — let it pull you down slightly.',
      'Stand tall and pause 1 second at the top.',
      'Chest up the whole time.',
    ],
    tip: 'The awkward shifting weight makes your core work like nothing else.',
  },
  {
    id: 's-deadlift', item: 'sack', emoji: '🌾',
    name: 'Sack Deadlift', nepali: 'भारी डेडलिफ्ट',
    muscles: 'Hamstrings, back & grip', dose: '3 × 10',
    steps: [
      'Stand over a grounded sack, hip-width feet.',
      'Hinge down with a flat back and grip it tight.',
      'Stand up keeping it close to the body, squeeze glutes at the top.',
      'Lower it back with a controlled hinge.',
    ],
    tip: 'Digging in fingers builds grip — skip the gloves, go bare hands.',
  },
  {
    id: 's-carry', item: 'sack', emoji: '🧳',
    name: 'Sack Shoulder Carry', nepali: 'भारी काँधमा बोक्ने',
    muscles: 'Core & traps', dose: '2 × 30 sec each side',
    steps: [
      'Swing one sack up onto the top of one shoulder.',
      'Stand tall, abs braced, chin neutral.',
      'Walk forward 20–30 steps.',
      'Swap the sack to the other shoulder and repeat.',
    ],
    tip: 'Look straight ahead — the wobble is the point. Village-load walking, upgraded.',
  },
  {
    id: 's-clean', item: 'sack', emoji: '💪',
    name: 'Sack Ground-to-Shoulder', nepali: 'भारी काँध फ्याँको',
    muscles: 'Full body power', dose: '3 × 8 each side',
    steps: [
      'Sack on the ground in front of you.',
      'Drop hips and pull it up into a squat-hug.',
      'Explode up and flip it onto one shoulder.',
      'Set it down and repeat on the other side.',
    ],
    tip: 'The hardest move here — start with half a sack (10–15kg) and no ego.',
  },
  {
    id: 's-twist', item: 'sack', emoji: '🌾',
    name: 'Sack Russian Twist', nepali: 'भारी घुमाउरो',
    muscles: 'Obliques', dose: '3 × 16',
    steps: [
      'Sit with knees bent, heels down, sack hugged at chest.',
      'Lean back slightly and rotate side to side.',
      'Let your eyes move last, not first.',
      'Keep the back long — no rounding.',
    ],
    tip: 'Tap the ground beside your hip with the sack on each rep.',
  },

  // ---- 🧱 Brick & stone ----
  {
    id: 'b-renegade', item: 'brick', emoji: '🧱',
    name: 'Brick Renegade Row', nepali: 'इँट रो',
    muscles: 'Back & core', dose: '3 × 8 each arm',
    steps: [
      'Pushup position, a brick under each hand, feet wide.',
      'Brace hard and row one brick up to your ribs.',
      'Lower it flat, then row the other side.',
      'Hips stay level the whole set.',
    ],
    tip: 'Wider feet = less swaying. Squeeze glutes before every row.',
  },
  {
    id: 'b-press', item: 'brick', emoji: '🧱',
    name: 'Brick Floor Press', nepali: 'इँट फ्लोर प्रेस',
    muscles: 'Chest & triceps', dose: '3 × 12',
    steps: [
      'Lie on your back, a brick in each hand over your chest.',
      'Elbows at 45°, press both toward the ceiling.',
      'Lower slowly until the backs of your arms touch.',
      'Repeat without dropping the tempo.',
    ],
    tip: 'Bricks are light — make them heavy with slow 3-count lowering.',
  },
  {
    id: 'b-curl', item: 'brick', emoji: '🧱',
    name: 'Brick Biceps Curl', nepali: 'इँट कर्ल',
    muscles: 'Biceps', dose: '3 × 15',
    steps: [
      'One or two bricks fist-held in one hand.',
      'Curl up with the elbow pinned to your side.',
      'Squeeze the biceps 1 second at the top.',
      'Lower on a slow 2-count.',
    ],
    tip: 'Perfect lightweight for clean form and mind–muscle focus.',
  },
  {
    id: 'b-farmer', item: 'brick', emoji: '🚶',
    name: 'Brick Farmer Carry', nepali: 'इँट क्यारी',
    muscles: 'Core & grip', dose: '2–3 walks',
    steps: [
      'Bricks (or smooth half-kg stones) in each hand.',
      'Walk tall, 30 steps, shoulders back, eyes ahead.',
      'Do not lean — this is posture work, not carrying shopping uphill.',
      'Rest and repeat.',
    ],
    tip: 'Go slow. This is walking posture work, not a race.',
  },
  {
    id: 'b-tricep', item: 'brick', emoji: '🧱',
    name: 'Brick Overhead Triceps', nepali: 'इँट ट्राइसेप्स',
    muscles: 'Triceps', dose: '3 × 12',
    steps: [
      'Hold a brick in both hands straight overhead.',
      'Bend the elbows so it lowers behind your head.',
      'Feel the stretch, then extend fully.',
      'Elbows stay pointed up, not flared out.',
    ],
    tip: 'A towel wrapped around the brick gives your hands better grip.',
  },

  // ---- 🪢 Towel & belt ----
  {
    id: 't-pull', item: 'towel', emoji: '🪢',
    name: 'Towel Biceps Iso-Pull', nepali: 'ताउल बाइसेप्स',
    muscles: 'Biceps', dose: '3 × 10 sec holds',
    steps: [
      'Loop a towel under one foot while seated or standing on it.',
      'Hold the ends like you are about to curl.',
      'Pull against your foot — hard — like a curl.',
      'Hold at full flex for 10 sec, 3 rounds each arm.',
    ],
    tip: 'Pull angle gives resistance — no weights needed.',
  },
  {
    id: 't-apart', item: 'towel', emoji: '🧘',
    name: 'Towel Pull-Apart', nepali: 'काँध खोल्ने',
    muscles: 'Shoulders & chest', dose: '2 × 15',
    steps: [
      'Wide towel stretched between both hands.',
      'Pull it apart and move it overhead, behind and back.',
      'Feel the chest and front shoulders open.',
      'Breathe deeply through the stretch.',
    ],
    tip: 'The daily antidote to 8 hours of mobile-scroll hunching.',
  },
  {
    id: 't-slide', item: 'towel', emoji: '🤸',
    name: 'Towel Ab Slide', nepali: 'ताउल स्लाइड',
    muscles: 'Core', dose: '3 × 10',
    steps: [
      'Kneel; towel flat on a smooth floor under your hands.',
      'Slide hands forward, abs braced, back flat.',
      'Pull yourself back in with your core.',
      'Repeat without folding at the hips.',
    ],
    tip: 'Slide just 10 cm the first set — this one humbles everyone.',
  },
  {
    id: 't-row', item: 'towel', emoji: '🪢',
    name: 'Towel Railing Row', nepali: 'ताउल रो',
    muscles: 'Back', dose: '3 × 12',
    steps: [
      'Loop a towel around a stair railing or strong bar.',
      'Arms straight, lean back until the towel is taut.',
      'Row your chest toward it, squeeze the mid back.',
      'Control the return — no jerking.',
    ],
    tip: 'Lower back angle = easier. Move feet closer for more difficulty.',
  },

  // ---- 🪑 Chair & stairs ----
  {
    id: 'c-incline', item: 'chair', emoji: '🪑',
    name: 'Chair Incline Pushup', nepali: 'कुर्सी पुशअप',
    muscles: 'Chest & arms', dose: '3 × 12',
    steps: [
      'Hands on the chair seat, body in a straight line.',
      'Lower your chest to the edge with control.',
      'Press back up fully.',
      'Do 8–12 controlled reps.',
    ],
    tip: 'Hold the chair against a wall so it does not slide.',
  },
  {
    id: 'c-dip', item: 'chair', emoji: '🪑',
    name: 'Chair Triceps Dip', nepali: 'कुर्सी ट्राइसेप्स डिप',
    muscles: 'Triceps', dose: '3 × 10',
    steps: [
      'Sit on the edge, hands beside hips, fingers forward.',
      'Feet out in front, hips just off the seat.',
      'Bend elbows behind you to about 90°.',
      'Press back up without hunching shoulders.',
    ],
    tip: 'Keep hips close to the chair. Shrugging = doing it wrong.',
  },
  {
    id: 'c-squat', item: 'chair', emoji: '🪑',
    name: 'Sit-to-Stand Squat', nepali: 'कुर्सीबाट उठ्ने स्क्वाट',
    muscles: 'Legs & glutes', dose: '3 × 15',
    steps: [
      'Stand in front of a chair, feet hip-width.',
      'Control yourself down to tap the seat lightly.',
      'Stand fully upright without using hands.',
      'Keep a proud chest all the way.',
    ],
    tip: 'The best beginner and elders exercise — safe, effective, free.',
  },
  {
    id: 'c-stepup', item: 'chair', emoji: '🪜',
    name: 'Stair Step-Up', nepali: 'सिँढी स्टेप अप',
    muscles: 'Legs & glutes', dose: '3 × 10 each leg',
    steps: [
      'Stand at the bottom of the stairs.',
      'Step one foot onto the second step.',
      'Drive through that leg to full standing on it.',
      'Lower slowly back, all reps on one leg, then switch.',
    ],
    tip: 'Hold the railing lightly for balance — but let the leg do the work.',
  },
  {
    id: 'c-climb', item: 'chair', emoji: '🏃',
    name: 'Stair Climb Sprint', nepali: 'सिँढी दौड',
    muscles: 'Heart & legs', dose: '4–5 rounds',
    steps: [
      'Climb stairs fast (1–2 floors) at a safe pace.',
      'Walk back down slowly — recovery.',
      'Repeat 4–5 rounds.',
      'Finish with a slow walk to cool your breathing.',
    ],
    tip: 'Best zero-cost home cardio. Be careful on the way down — your knees are doing the braking.',
  },
  {
    id: 'c-plank', item: 'chair', emoji: '🪑',
    name: 'Feet-Elevated Plank', nepali: 'उचालो प्लाङ्क',
    muscles: 'Core', dose: '3 × 30 sec',
    steps: [
      'Feet on the lowest stair, hands on floor.',
      'One straight rigid line head to heels.',
      'Squeeze abs and glutes, breathe.',
      'Hold 20–40 seconds.',
    ],
    tip: 'Elevating the feet makes the plank about 30% harder.',
  },
];
