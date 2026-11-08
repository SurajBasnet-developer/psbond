// Programs, quotes, vibes, affirmations, relationship wisdom, challenges, meditations.

export const PROGRAMS = [
  // ---- Male ----
  { id: 'm-arms', name: 'Arms Power', section: 'male', cat: 'Biceps + Triceps', mins: 12, level: 'Beginner',
    desc: 'Build sleeve-filling arms. Curls, extensions and presses in one tight circuit.',
    items: ['bicep-curl', 'hammer-curl', 'overhead-ext', 'diamond-pushup', 'bench-dip', 'concentration-curl'] },
  { id: 'm-chest-back', name: 'Chest & Back', section: 'male', cat: 'Upper Body', mins: 14, level: 'Intermediate',
    desc: 'Push and pull balance for a powerful, upright frame.',
    items: ['pushup', 'wide-pushup', 'dumbbell-row', 'superman', 'bird-dog', 'pushup'] },
  { id: 'm-shoulders', name: 'Boulder Shoulders', section: 'male', cat: 'Shoulders', mins: 11, level: 'Intermediate',
    desc: 'Presses and raises that build the V-taper everyone notices.',
    items: ['shoulder-press', 'lateral-raise', 'pike-pushup', 'arm-circles', 'shoulder-press'] },
  { id: 'm-legs', name: 'Leg Day Engine', section: 'male', cat: 'Legs', mins: 14, level: 'Beginner',
    desc: 'Squats, lunges and holds. Never skip this — legs drive all growth.',
    items: ['squat', 'lunge', 'wall-sit', 'calf-raise', 'glute-bridge', 'squat'] },
  { id: 'm-core', name: 'Core Forge', section: 'male', cat: 'Abs', mins: 10, level: 'Intermediate',
    desc: 'Carve a solid midsection with planks, bicycles and raises.',
    items: ['plank', 'crunch', 'bicycle', 'leg-raise', 'mountain-climber'] },
  { id: 'm-full', name: 'Full Body Burn', section: 'male', cat: 'Full Body', mins: 16, level: 'Advanced',
    desc: 'The complete package — strength, heart and grit in one session.',
    items: ['jumping-jack', 'pushup', 'squat', 'burpee', 'mountain-climber', 'shadow-box', 'plank'] },
  { id: 'm-morning', name: 'Morning Ignition', section: 'male', cat: 'Quick Start', mins: 7, level: 'Beginner',
    desc: 'Wake the body up in 7 minutes. Perfect before a shower.',
    items: ['jumping-jack', 'high-knees', 'squat', 'pushup', 'calf-raise'] },

  // ---- Female ----
  { id: 'f-slim', name: 'Slim Down Start', section: 'female', cat: 'Fat Burn', mins: 12, level: 'Beginner',
    desc: 'Gentle, joint-friendly cardio to melt fat and lift energy.',
    items: ['warmup-march', 'side-step', 'low-jack', 'high-knees-f', 'skater', 'cool-stretch'] },
  { id: 'f-waist', name: 'Belly & Waist', section: 'female', cat: 'Core', mins: 11, level: 'Beginner',
    desc: 'Target the waistline with twists, crunches and leg raises.',
    items: ['crunch-f', 'russian-twist', 'leg-raise-f', 'plank-f', 'hip-bridge'] },
  { id: 'f-glutes', name: 'Glutes & Legs Sculpt', section: 'female', cat: 'Lower Body', mins: 12, level: 'Beginner',
    desc: 'Lift, shape and strengthen — the area that changes fastest.',
    items: ['sumo-squat', 'glute-kick', 'side-leg-lift', 'hip-bridge', 'sumo-squat'] },
  { id: 'f-arms', name: 'Toned Arms', section: 'female', cat: 'Arms', mins: 8, level: 'Beginner',
    desc: 'Firm, defined arms with beginner-friendly progressions.',
    items: ['wall-pushup', 'knee-pushup', 'arm-circles', 'plank-f'] },
  { id: 'f-full', name: 'Full-Body Meltdown', section: 'female', cat: 'Fat Burn', mins: 15, level: 'Beginner',
    desc: 'The complete slim-down circuit. Sweat, smile, repeat.',
    items: ['warmup-march', 'sumo-squat', 'low-jack', 'knee-pushup', 'russian-twist', 'skater', 'high-knees-f', 'cool-stretch'] },
  { id: 'f-glow', name: 'Morning Glow Stretch', section: 'female', cat: 'Flexibility', mins: 9, level: 'Beginner',
    desc: 'Wake up glowing — gentle flow for body and mind.',
    items: ['cat-cow', 'cool-stretch', 'sun-flow', 'neck-roll', 'chest-open'] },

  // ---- Dance ----
  { id: 'd-latin', name: 'Latin Cardio', section: 'dance', cat: 'Dance', mins: 12, level: 'Beginner',
    desc: 'Salsa-inspired steps that torch calories with a smile.',
    items: ['groove-warmup', 'box-step', 'side-step', 'shimmy', 'freestyle'] },
  { id: 'd-hiphop', name: 'Hip-Hop Burn', section: 'dance', cat: 'Dance', mins: 12, level: 'Beginner',
    desc: 'Bounce, groove and sweat — street style.',
    items: ['groove-warmup', 'shimmy', 'arm-wave', 'freestyle', 'high-knees'] },
  { id: 'd-feelgood', name: 'Feel-Good Flow', section: 'dance', cat: 'Dance', mins: 9, level: 'Beginner',
    desc: 'Easy moves to shake off a heavy day.',
    items: ['side-step', 'groove-warmup', 'arm-wave', 'freestyle'] },

  // ---- Mind ----
  { id: 'x-calm-morning', name: 'Morning Calm', section: 'mind', cat: 'Movement', mins: 6, level: 'Beginner',
    desc: 'Gentle movement to start the day with a clear head.',
    items: ['neck-roll', 'shoulder-roll', 'chest-open', 'side-stretch'] },
  { id: 'x-heavy-day', name: 'Heavy Day Lifter', section: 'mind', cat: 'Movement', mins: 8, level: 'Beginner',
    desc: 'For low-mood days. Slow, kind movement that lifts energy gently.',
    items: ['shoulder-roll', 'forward-fold', 'mindful-walk', 'chest-open', 'cool-stretch'] },
  { id: 'x-unwind', name: 'Evening Unwind', section: 'mind', cat: 'Movement', mins: 7, level: 'Beginner',
    desc: 'Release the day from your shoulders before sleep.',
    items: ['neck-roll', 'forward-fold', 'side-stretch', 'cat-cow'] },
];

// ---------- Quotes ----------
export const LOCAL_QUOTES = [
  { q: 'Take care of your body. It is the only place you have to live.', a: 'Jim Rohn' },
  { q: 'The last three or four reps is what makes the muscle grow.', a: 'Arnold Schwarzenegger' },
  { q: 'You do not have to be extreme, just consistent.', a: 'Unknown' },
  { q: 'A one hour workout is 4% of your day. No excuses.', a: 'Unknown' },
  { q: 'Strength does not come from what you can do. It comes from overcoming what you once could not.', a: 'Rikki Rogers' },
  { q: 'The pain you feel today will be the strength you feel tomorrow.', a: 'Arnold Schwarzenegger' },
  { q: 'Discipline is choosing between what you want now and what you want most.', a: 'Abraham Lincoln' },
  { q: 'Your body can stand almost anything. It is your mind you have to convince.', a: 'Unknown' },
  { q: 'Sweat is fat crying.', a: 'Unknown' },
  { q: 'Do something today that your future self will thank you for.', a: 'Sean Patrick Flanery' },
  { q: 'Motivation gets you going. Habit keeps you growing.', a: 'John C. Maxwell' },
  { q: 'The only bad workout is the one that did not happen.', a: 'Unknown' },
  { q: 'Little by little, a little becomes a lot.', a: 'Tanzanian proverb' },
  { q: 'Fall in love with taking care of yourself — mind, body and spirit.', a: 'Unknown' },
  { q: 'Progress is progress, no matter how small.', a: 'Unknown' },
  { q: 'You are stronger than your excuses.', a: 'Unknown' },
  { q: 'Energy and persistence conquer all things.', a: 'Benjamin Franklin' },
  { q: 'What seems impossible today will one day become your warm-up.', a: 'Unknown' },
  { q: 'Be stronger than your strongest excuse.', a: 'Unknown' },
  { q: 'The expert in anything was once a beginner.', a: 'Helen Hayes' },
  { q: 'Movement is medicine.', a: 'Unknown' },
  { q: 'Rest is part of the training, not the absence of it.', a: 'Unknown' },
  { q: 'Comparison is the thief of joy — compete with yesterday\'s you.', a: 'Theodore Roosevelt (adapted)' },
  { q: 'Show up for yourself the way you show up for others.', a: 'Unknown' },
];

// ---------- Positive vibes (shown during workouts) ----------
export const VIBES = [
  'You are stronger than yesterday 💪', 'Power through — you own this 🔥', 'Beautiful things take time ✨',
  'Every rep is a vote for the new you 🗳️', 'Breathe. You were built for this 🌬️', 'That burn? That is change happening 🔥',
  'Proud of you for showing up 💛', 'Your future self is cheering right now 📣', 'Form first. Ego last. 🧠',
  'One more rep than last time — that is growth 📈', 'You did not come this far to stop here 🚀',
  'Sweat now, smile later 😅', 'Strong is the new beautiful ✨', 'Your only competition is you 🪞',
  'Small steps, big destinations 🏔️', 'Discipline is self-love in action 💛', 'Feel the power returning ⚡',
  'Rest is coming — earn it first ⏳', 'Champions are built on days like this 🏆', 'Keep going, gorgeous soul 🌸',
  'Your body is listening — speak strength 🗣️', 'This is the rep that changes everything 💫',
  'Slow is smooth, smooth is fast 🌊', 'You are capable of amazing things 🌟',
];

// ---------- Affirmations (tap board) ----------
export const AFFIRMATIONS = [
  'I am becoming stronger every single day.', 'My body deserves my love and patience.',
  'I choose progress over perfection.', 'I am proud of myself for showing up.',
  'My worth is not a number on a scale.', 'I have survived every hard day so far. That is proof.',
  'I release what I cannot control.', 'I am allowed to rest without guilt.',
  'Discipline is how I respect my future.', 'I am the kind of person who keeps promises to myself.',
  'My small efforts are stacking into something great.', 'I radiate energy, calm and confidence.',
  'Today I move, and movement changes everything.', 'I am healing, growing and glowing.',
  'I do not need to be perfect. I need to begin.', 'My consistency is my superpower.',
];

// ---------- Relationship wisdom ----------
export const RELATIONSHIP = [
  { cat: 'Communication', t: 'The 24-hour rule', d: 'If something hurts, say it within 24 hours — gently. Resentment is just love that went unspoken too long.' },
  { cat: 'Bonding', t: 'Six-second kisses', d: 'Couples who hug or kiss for 6+ seconds daily bond deeper. Long enough for oxytocin — the connection hormone — to flow.' },
  { cat: 'Loyalty', t: 'Defend them in their absence', d: 'True loyalty is speaking well of your partner when they are not in the room. What you say shapes what you feel.' },
  { cat: 'Trust', t: 'Small promises, kept', d: 'Trust is built in tiny moments: being on time, doing what you said, remembering the small thing. Reliability is romance.' },
  { cat: 'Communication', t: 'Ask, do not assume', d: 'The sentence "I may be wrong, but I felt..." prevents 90% of fights. Feelings are valid; assumptions are not facts.' },
  { cat: 'Bonding', t: 'The daily download', d: 'Take 10 minutes daily to share your day — the good, the bad, the boring. Couples who talk daily stay close for decades.' },
  { cat: 'Loyalty', t: 'Protect the bubble', d: 'Never share private fights publicly or online. What happens between you two belongs between you two.' },
  { cat: 'Trust', t: 'Transparency beats permission', d: 'Do not ask "am I allowed?" — simply be so open that there is nothing to hide. Freedom and honesty grow together.' },
  { cat: 'Bonding', t: 'Five to one ratio', d: 'Healthy couples give 5 positive interactions for every negative one. A compliment, a touch, a thank you — deposit daily.' },
  { cat: 'Communication', t: 'Listen to understand', d: 'Do not listen to reply. Put the phone down, face them, and try to feel what they feel. Being heard is being loved.' },
  { cat: 'Loyalty', t: 'Choose them daily', d: 'Love is a feeling, but loyalty is a decision — made every ordinary Tuesday, not just on anniversaries.' },
  { cat: 'Trust', t: 'Fight the problem, not each other', d: 'Say "we against the problem" — not "me against you." You are teammates, and the goal is understanding.' },
  { cat: 'Bonding', t: 'Learn their love language', d: 'People give love the way they want to receive it. Ask yours: words, time, gifts, service or touch — then speak theirs.' },
  { cat: 'Communication', t: 'The soft start-up', d: 'How a conversation starts decides how it ends. Begin hard topics with appreciation, not accusation.' },
  { cat: 'Bonding', t: 'Novelty is glue', d: 'New experiences together — a new walk, dish, or game — release dopamine and bond you like the first date did.' },
  { cat: 'Loyalty', t: 'Boundaries with others', d: 'Loyalty includes clear boundaries with people who flirt with what is yours. Respect is shown, not just felt.' },
  { cat: 'Trust', t: 'Repair attempts matter', d: 'A joke, a touch, a "can we restart?" — successful couples make repair attempts mid-fight and accept them.' },
  { cat: 'Bonding', t: 'Appreciate out loud', d: 'Notice the effort: the coffee made, the errand run, the patience shown. Gratitude spoken is love multiplied.' },
  { cat: 'Communication', t: 'No scorekeeping', d: 'Love is not 50/50 — it is both giving 100% on different days. Keeping score turns teammates into opponents.' },
  { cat: 'Trust', t: 'Consistency over intensity', d: 'Grand gestures are loud, but quiet consistency is what makes someone feel truly safe with you.' },
  { cat: 'Bonding', t: 'Dream together', d: 'Couples who plan and dream together — trips, homes, goals — stay bonded to a shared future, not just a shared past.' },
  { cat: 'Communication', t: 'Timeout signal', d: 'Agree on a word that pauses any fight. 20 minutes apart, then return. Escalation never solved anything.' },
  { cat: 'Loyalty', t: 'Celebrate their wins', d: 'Be genuinely happy for their success — as loud as you would be for your own. Jealousy is a slow poison; pride is a fertilizer.' },
  { cat: 'Trust', t: 'Say the scary thing', d: 'The conversation you are most afraid to have is usually the one that will set you free. Kindness + honesty.' },
  { cat: 'Bonding', t: 'Touch daily', d: 'Holding hands, a hand on the shoulder, a hug from behind — daily touch keeps the bond physical, not just verbal.' },
  { cat: 'Communication', t: 'Curiosity never ends', d: 'Keep asking questions. People change; stay interested in who they are becoming, not just who they were.' },
  { cat: 'Loyalty', t: 'Be their safe place', d: 'Home should be where they can be fully themselves — unfiltered, unjudged. Safety is the deepest form of intimacy.' },
  { cat: 'Trust', t: 'Forgive forward', d: 'Forgiveness does not mean forgetting; it means dropping the weapon. You forgive to be free, not to lose.' },
  { cat: 'Bonding', t: 'Inside jokes are gold', d: 'Shared laughter and private jokes create a world only you two live in. Protect and grow that world.' },
  { cat: 'Communication', t: 'Gratitude before gripe', d: 'Before raising an issue, name one thing they did well this week. Hard words land softer on appreciated hearts.' },
  { cat: 'Loyalty', t: 'Grow together, not apart', d: 'Read, train, learn — side by side. Two people growing in the same direction never drift apart.' },
  { cat: 'Trust', t: 'Respect the difference', d: 'You are teammates, not clones. Honor how they differ from you — that is half the adventure.' },
];

// ---------- Daily challenges ----------
export const CHALLENGES = [
  { t: '50 squats today', kind: 'count', n: 50, xp: 30 },
  { t: 'Hold a plank 3 times (30s+)', kind: 'info', xp: 25 },
  { t: 'Drink 8 glasses of water', kind: 'water', xp: 20 },
  { t: '10-minute walk after every meal', kind: 'info', xp: 30 },
  { t: '100 push-ups total today', kind: 'count', n: 100, xp: 40 },
  { t: '5 minutes of stretching', kind: 'info', xp: 20 },
  { t: 'Take the stairs every time', kind: 'info', xp: 15 },
  { t: 'Dance to 3 songs', kind: 'info', xp: 25 },
  { t: 'Meditate for 5 minutes', kind: 'info', xp: 25 },
  { t: 'No sugar until dinner', kind: 'info', xp: 30 },
  { t: '60 seconds of high knees', kind: 'info', xp: 20 },
  { t: 'Write 3 things you are grateful for', kind: 'gratitude', xp: 20 },
  { t: 'Say something kind to someone', kind: 'info', xp: 15 },
  { t: 'Sleep before midnight', kind: 'info', xp: 30 },
];

// ---------- Meditations ----------
export const MEDITATIONS = [
  { id: 'med-morning', name: 'Morning Calm', mins: 5, sound: 'bowl', e: '🌅',
    script: ['Feel the breath entering, cool and fresh.', 'Notice the body waking — toes, legs, chest.', 'Let thoughts arrive like guests. Let them leave.', 'Set one gentle intention for today.', 'Carry this calm with you like sunlight.'] },
  { id: 'med-anxiety', name: 'Anxiety Rescue', mins: 8, sound: 'rain', e: '🌊',
    script: ['You are safe in this moment. Breathe.', 'Name the worry silently — then let it float by.', 'Feel your feet on the floor. Ground yourself.', 'Exhale longer than you inhale. Slowly.', 'This feeling is a wave. Waves always pass.', 'Return to the breath. Again. And again.'] },
  { id: 'med-sleep', name: 'Deep Sleep', mins: 10, sound: 'om', e: '🌙',
    script: ['Soften your jaw. Your shoulders. Your hips.', 'Breathe out the day with each exhale.', 'Relax from the crown of your head downward.', 'Heavy, warm, safe. Let gravity hold you.', 'No need to do anything. Just rest here.'] },
  { id: 'med-gratitude', name: 'Gratitude Bath', mins: 6, sound: 'ocean', e: '🙏',
    script: ['Think of one person you are glad exists.', 'Recall one moment this week that made you smile.', 'Thank your body — it carried you everywhere.', 'Thank this breath. It never asked for anything.', 'Let the gratitude warm your chest.'] },
  { id: 'med-focus', name: 'Focus Reset', mins: 5, sound: 'night', e: '🎯',
    script: ['Sit tall. Close or soften your eyes.', 'Follow one full breath — start to end.', 'When the mind wanders, smile and return.', 'One breath is one rep of attention.', 'Calm is a skill. You are training it now.'] },
];

export const SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', e: '🌧️', d: 'Soft rainfall for deep calm' },
  { id: 'ocean', name: 'Ocean Waves', e: '🌊', d: 'Rhythmic waves on a quiet shore' },
  { id: 'bowl', name: 'Singing Bowl', e: '🔔', d: 'Warm resonating harmonics' },
  { id: 'om', name: 'Deep Om', e: '🕉️', d: '136.1 Hz — the om frequency' },
  { id: 'night', name: 'Night Garden', e: '🌙', d: 'Soft evening air and crickets' },
];

export const BREATH_PATTERNS = [
  { id: '478', name: '4-7-8 Relax', phases: [['Breathe in', 4], ['Hold', 7], ['Breathe out', 8]], d: 'The anxiety killer. Best before sleep.' },
  { id: 'box', name: 'Box Breathing', phases: [['Breathe in', 4], ['Hold', 4], ['Breathe out', 4], ['Hold', 4]], d: 'Navy SEAL focus. Best before stress.' },
  { id: 'coherent', name: 'Coherent 5-5', phases: [['Breathe in', 5], ['Breathe out', 5]], d: 'Balanced calm for any moment.' },
  { id: 'energize', name: 'Energize 6-2', phases: [['Breathe in', 6], ['Hold', 2], ['Breathe out', 4]], d: 'Gentle wake-up without coffee.' },
];

export const SOS_STEPS = [
  'Name 5 things you can see around you.',
  'Name 4 things you can touch right now.',
  'Name 3 things you can hear.',
  'Name 2 things you can smell.',
  'Name 1 thing you can taste.',
  'Now follow one slow breath, all the way in… and all the way out.',
  'You are here. You are safe. This moment is yours.',
];

export const ACHIEVEMENTS = [
  { id: 'first', e: '🌱', n: 'First Step', d: 'Complete your first workout' },
  { id: 's3', e: '🔥', n: '3-Day Flame', d: '3-day streak' },
  { id: 's7', e: '⚡', n: 'Week Warrior', d: '7-day streak' },
  { id: 's30', e: '👑', n: 'Monthly Legend', d: '30-day streak' },
  { id: 'w10', e: '🏋️', n: 'Ten Club', d: '10 workouts completed' },
  { id: 'w50', e: '🦾', n: 'Iron Fifty', d: '50 workouts completed' },
  { id: 'med5', e: '🧘', n: 'Quiet Mind', d: '5 meditations done' },
  { id: 'dance3', e: '💃', n: 'Move & Groove', d: '3 dance sessions' },
  { id: 'grat5', e: '🙏', n: 'Grateful Heart', d: '5 gratitude entries' },
  { id: 'water7', e: '💧', n: 'Hydration Hero', d: 'Hit water goal 7 days' },
  { id: 'kcal1k', e: '🔥', n: 'Torch Master', d: 'Burn 1,000 total kcal' },
  { id: 'min120', e: '⏱️', n: 'Two Hour Club', d: '120 total active minutes' },
  { id: 'step1k', e: '👟', n: 'First 1K', d: '1,000 total steps counted' },
  { id: 'step10k', e: '🏆', n: 'Step Champion', d: '10,000 steps in a single day' },
];

export const LEVELS = [
  { at: 0, name: 'Rookie' }, { at: 300, name: 'Starter' }, { at: 800, name: 'Grinder' },
  { at: 1600, name: 'Athlete' }, { at: 3000, name: 'Beast' }, { at: 5000, name: 'Legend' }, { at: 8000, name: 'Titan' },
];

export const PREMIUM_FEATURES = [
  ['🎬', 'Animated coaches', 'Male & female SVG coaches demonstrate every movement in real time.'],
  ['⏱️', 'Smart interval timer', 'Work / rest phases, beeps, voice cues and screen wake-lock.'],
  ['📴', 'Full offline mode', 'Every workout, quote and sound works without internet. Install once, train anywhere.'],
  ['💬', 'Daily motivation', 'Fresh quotes from free APIs, cached for offline days.'],
  ['🧘', 'Meditation studio', '5 guided sessions with a real-time breathing ring.'],
  ['🎵', 'Generated soundscapes', 'Rain, ocean, om and more — synthesized on your device, zero downloads.'],
  ['🌬️', 'Breathwork trainer', '4-7-8, box breathing and energizing patterns with visual guidance.'],
  ['🆘', 'SOS calm mode', 'A 60-second grounding exercise for panic or heavy moments.'],
  ['💃', 'Dance workouts', 'Cardio disguised as fun, with a built-in beat engine.'],
  ['💚', 'Mind-care section', 'Gentle routines designed for low-mood and anxious days.'],
  ['📊', 'Progress analytics', '14-day charts, streak calendar, calories and minutes tracked.'],
  ['🏃', 'Step counter', 'An offline pedometer — count steps from your phone\'s motion sensor toward a daily goal, with distance & calories.'],
  ['🏆', '14 achievements', 'Badges that celebrate every milestone on your journey.'],
  ['⚡', 'XP & levels', 'Rookie to Titan — every minute counts toward your rank.'],
  ['🎯', 'Daily challenges', 'A fresh micro-goal every day to keep momentum alive.'],
  ['💧', 'Hydration tracker', '8-glass daily tracker with gentle reminders.'],
  ['🧮', 'BMI calculator', 'Know your numbers, track your healthy range.'],
  ['🛠️', 'Custom workouts', 'Build your own session from the full exercise library.'],
  ['♾️', 'Unlimited library', '50+ exercises across 4 worlds, searchable and filterable.'],
  ['🎲', 'Shuffle generator', 'Infinite random workouts when you cannot decide.'],
  ['💞', 'Relationship wisdom', 'A new research-backed relationship tip every single day.'],
  ['🙏', 'Gratitude journal', 'Three good things a day — the cheapest happiness hack.'],
  ['🌙', 'Sleep sounds', 'Drift off with generated rain, waves and om.'],
  ['🗣️', 'Voice coaching', 'Your device speaks each exercise and phase change.'],
  ['📱', 'Install anywhere', 'A true app on Android, iOS, Windows, macOS and Linux.'],
  ['🌗', 'Dark & light themes', 'Premium looks in both modes, automatically.'],
  ['📦', 'Data export', 'Your progress belongs to you — export anytime.'],
];
