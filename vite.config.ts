import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  base: '/real-life-grind/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Real-Life Grind',
        short_name: 'RLG',
        start_url: '/real-life-grind/',
        scope: '/real-life-grind/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
          {
            src: '/real-life-grind/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/real-life-grind/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2}', '!storybook/**'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          },
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-calls',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 5 * 60
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      $lib: resolve(__dirname, 'src/lib')
    }
  }
});
