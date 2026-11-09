# BiggerBody — Train · Meditate · Grow 💪❤️

A premium, offline-first **Progressive Web App** for daily fitness, meditation, motivation and mind-care — for both men and women. No database, no backend: everything runs on-device.

**Developed by Suraj Basnet** · Made with ❤️

## ✨ What's inside

| Section | Highlights |
|---|---|
| 💪 **Build & Power (Men)** | Biceps, triceps, shoulders, chest, back, legs, core & full-body programs with animated male coach |
| 🌸 **Slim & Glow (Women)** | Slim-down, core & waist, glutes, arms, flexibility — beginner-friendly with female coach |
| 🧘 **Mind Studio** | Guided meditations, breathwork (4-7-8, box), sleep sounds, SOS calm for anxiety & heavy days |
| 🕉️ **Hindu Books** | A free scripture library — **Bhagavad Gita (18 chapters), Hanuman Chalisa (full), Rudrashtakam, Devi hymns, Vedas, Upanishad wisdom, daily shlokas & purana stories** — bundled offline with a shloka-of-the-day, reader with font control, save-shelf & reading progress |
| 💃 **Dance** | Dance cardio programs + a live **beat engine** (house / lo-fi / afro) with tempo control |
| 💫 **Motivation** | Daily quotes (free APIs + offline fallback), affirmation board, shareable vibes |
| 📰 **News** | Read the real portals inside the app — **Onlinekhabar, eKantipur, Gorkhapatra, Shilapatra** — plus a headlines wire with a full **in-app reader** (font-size control, save-offline, share) |
| 💞 **Care** | Daily relationship wisdom (bonding, loyalty, communication) + gratitude journal |
| 📊 **Progress** | 14-day charts, streak calendar, XP levels, 12 achievements, water tracker, BMI, data export |
| 📚 **Library** | 55+ exercises, searchable, with a custom plan builder & shuffle generator |
| 🏠 **GharGym** | 25 strength moves with household kit — water bottles, gagri, rice sacks (bhaari), bricks, towels, stairs |
| 🙏 **Fast & Fest** | Shrawan Sombar & Sankranti auto-tracked from the BS calendar, weekly fast reminders, fasting-safe sessions + Teej/Dashain/Tihar/Chhath day guides |
| 🌤️ **Weather-Smart Days** | Free Open-Meteo sky for 14 Nepali cities or your GPS point — live temp, sunrise/sunset, 3-day forecast & smart tips (heat, rain, storm, fog, cold); on hot days the water goal automatically rises 8 → 10 glasses. Cached on-device, works offline |

### Premium features included (31)
Animated male & female coaches · smart interval timer with voice cues & beeps · full offline mode · generated soundscapes (rain, ocean, om, bowl, night — zero downloads) · breathing trainer · SOS grounding · dance beat engine · mind-care routines · analytics & streaks · achievements · XP levels · daily challenges · hydration tracker · BMI calculator · custom workouts · unlimited library · shuffle generator · relationship wisdom · gratitude journal · sleep sounds · screen wake-lock · haptics · installable app with splash screen · dark & light themes · data export · GharGym (household equipment workouts) · fast & festival mode · **live news reader** · **offline pedometer** · **Hindu books library** · **date in notifications** · **weather-smart days**.

### 📅 Date, always in sight (Android · iOS)
- A slim **date strip is pinned at the top of every screen** — today's Bikram Sambat (Nepali) date, the English date, and today's festival (if any), refreshed right after midnight and on each app reopen.
- **Daily date notification** (Settings → *Date notice — Android & iOS*): pick a time and BiggerBody puts today's full date in your device's notification shade — Android out of the box; iOS 16.4+ once the app is added to the Home Screen. Fired on-device from the same offline calendar — no server, no cost.

### 🌤️ Weather-smart days
- A **Today's sky card on Home**: live temperature & condition from the free **Open-Meteo** API (no key, no account), sunrise/sunset chips, smart advice lines (heat, rain, thunderstorm, fog, cold mornings) and a 3-day mini forecast with a one-tap refresh.
- **Animated sky scenes, zero images**: pure-CSS weather art that matches the live sky — a pulsing sun with rotating rays, a moon with twinkling stars, drifting clouds, falling rain, a blinking lightning bolt, swaying snow and rolling fog (both in the big scene and as tiny animated icons in the 3-day chips).
- **Hydration that follows the sky**: when it is 28 °C or hotter, the daily water goal automatically moves from **8 to 10 glasses** on Home and in Progress — with a small "hot day" hint. Turn it off in Settings → *Weather*.
- **Your place**: pick one of 14 Nepali cities or tap *Use my location* for GPS. The last sky is cached on-device (plus a service-worker cache), so the card still paints offline with your last good weather.

## 🚀 Run it

```bash
npm install
npm run dev        # development
npm run build      # production build (dist/)
npm run preview    # serve the production build
```

## 📱 Install as an app

- **Android / Chrome / Edge:** open the site → "Install app" button (or install icon in the address bar)
- **iOS / Safari:** Share → **Add to Home Screen**
- **Desktop:** install icon in the browser address bar

Once installed it runs full-screen with a splash screen and works **completely offline** (service worker precaches everything).

## 🛠 Tech

- [Vite](https://vitejs.dev/) + vanilla JS (fast, no framework bloat)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox service worker + web manifest)
- News: live RSS + Google-News wires fetched via a resilient CORS proxy chain, parsed with DOMParser; article extraction via reader services; feed & image responses cached by the service worker
- Hand-built animated SVG coaches (requestAnimationFrame, joint-based transforms)
- Web Audio API for beeps, voice cues, soundscapes and the dance beat engine
- localStorage for all progress — no database needed
