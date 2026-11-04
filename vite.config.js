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
        skipWaiting: true
      }
    })
  ],
  build: {
    target: 'es2020'
  }
})
