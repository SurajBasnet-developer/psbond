import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/apple-touch-icon.png',
        'icons/logo-192.png',
        'icons/logo-512.png',
        'icons/maskable-512.png',
        'icons/icon.svg'
      ],
      manifest: {
        name: 'BiggerBody — Train · Meditate · Grow',
        short_name: 'BiggerBody',
        description: 'Daily workouts for men & women, meditation, motivation, dance, mind-care and progress analytics. Works fully offline.',
        theme_color: '#0b0f1a',
        background_color: '#0b0f1a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['health', 'fitness', 'lifestyle'],
        icons: [
          { src: 'icons/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/logo-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // Open-Meteo sky — NetworkFirst with a 1-day fallback so Home can
            // always paint the last known weather fully offline (no key, free)
            urlPattern: /api\.open-meteo\.com/,
            handler: 'NetworkFirst',
            options: { cacheName: 'bb-wx-api', expiration: { maxEntries: 8, maxAgeSeconds: 86400 }, networkTimeoutSeconds: 10 },
          },
          {
            // news feed/proxy calls — keep the last good payload around
            urlPattern: /jina\.ai|allorigins\.win|codetabs\.com|rss2json\.com|corsproxy\.io/,
            handler: 'NetworkFirst',
            options: { cacheName: 'bb-news-api', expiration: { maxEntries: 40, maxAgeSeconds: 86400 * 3 }, networkTimeoutSeconds: 14 },
          },
          {
            // article + thumbnail images from the portals
            urlPattern: ({ request, url }) => request.destination === 'image' && !url.origin.includes(self?.location?.hostname ?? '__none__'),
            handler: 'CacheFirst',
            options: { cacheName: 'bb-news-img', expiration: { maxEntries: 60, maxAgeSeconds: 86400 * 14 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      }
    })
  ],
  build: {
    target: 'es2020'
  }
})
