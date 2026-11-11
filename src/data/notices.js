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
    id: "n-2026-11-11-hsc37",
    emoji: "📣",
    type: "warn",
    title: "Bhaitika",
    body: "भाईटिकाको शुभ साहित ११:०७ मा रहेको छ । सम्पूर्णमा शुभकामना ।  HAPPY TIHAR",
    from: '',
    to: '',
    cta: null,
  },
];
