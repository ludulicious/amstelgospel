import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const contentRoot = fileURLToPath(new URL('./content/', import.meta.url))
const contentRoutes = ['pages', 'events'].flatMap((folder) =>
  readdirSync(`${contentRoot}${folder}`)
    .filter((file) => file.endsWith('.md'))
    .map(
      (file) =>
        `${folder === 'events' ? '/agenda' : ''}/${file.replace(/\.md$/, '')}`,
    ),
)

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      icons: [
        'lucide:arrow-up-right',
        'lucide:arrow-right',
        'lucide:arrow-left',
        'lucide:heart',
        'lucide:audio-lines',
        'lucide:mic-vocal',
        'lucide:mail',
        'lucide:play',
        'lucide:expand',
        'lucide:info',
        'lucide:menu',
        'lucide:x',
      ],
    },
  },
  devtools: { enabled: false },
  ui: { colorMode: false, fonts: false },
  app: {
    head: {
      htmlAttrs: { lang: 'nl' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#291b32' }],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...contentRoutes],
      failOnError: true,
    },
  },
  experimental: { payloadExtraction: true },
})
