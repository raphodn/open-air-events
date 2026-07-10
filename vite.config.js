import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import constants from './src/constants.js'
import { statcounterHtml } from './src/utils/statcounter.js'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'statcounter',
      transformIndexHtml(html) {
        // Only inject Statcounter in production
        if (process.env.NODE_ENV === 'production') {
          return html.replace(
            '<!-- Statcounter placeholder -->',
            statcounterHtml
          )
        }
        return html
      }
    },
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'favicon.png'],
      manifest: {
        name: constants.APP_NAME,
        short_name: constants.APP_NAME,
        description: constants.APP_DESCRIPTION,
        theme_color: '#0A3A5A',
        background_color: '#F6C24A',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
