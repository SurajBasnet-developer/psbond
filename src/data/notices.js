// 📣 Announcements — admin-only push system with NO database and NO server.
// Notices live directly in this file (code is the database). The admin panel
// opens only at the unique secret link below and helps compose, preview on
// your own device, and generate the code snippet to paste right here.
// Users get a beautiful card on Home + a one-time device notification.
//
// 🔒 To rotate the secret link, edit ADMIN_ROUTE below (one line).

export const ADMIN_ROUTE = 'bb-admin-su7xkq92r4m8';

// fields: id (unique), emoji, type (info | good | warn | love),
// title, body, from / to ('YYYY-MM-DD', empty = forever), cta (optional).
export const NOTICES = [
  {
    id: 'n-2026-11-09-sky',
    emoji: '🌤️',
    type: 'good',
    title: 'Your sky just came alive!',
    body: 'The weather card on Home now paints living scenes — glowing suns, drifting clouds, dancing rain and lightning you can feel. Pick your exact district in Settings → Weather.',
    from: '2026-11-09',
    to: '2026-12-31',
    cta: { label: 'Choose your district', go: 'settings' },
  },
];
