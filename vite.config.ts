import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

type OgConfig = {
  siteName: string
  home: { title: string; description: string }
  list: { title: string; description: string }
  tests: { id: string; title: string; description: string }[]
}

type RouteOg = {
  path: string
  title: string
  description: string
  type: string
}

function loadOgConfig(): OgConfig {
  const ogPath = fileURLToPath(new URL('./src/lib/og.json', import.meta.url))
  return JSON.parse(fs.readFileSync(ogPath, 'utf8')) as OgConfig
}

function getAllRouteOg(og: OgConfig, siteName: string): RouteOg[] {
  return [
    {
      path: '/',
      title: og.home.title,
      description: og.home.description,
      type: 'website',
    },
    {
      path: '/tests',
      title: og.list.title,
      description: og.list.description,
      type: 'website',
    },
    ...og.tests.flatMap((test) => [
      {
        path: `/tests/${test.id}`,
        title: `${test.title} | ${siteName}`,
        description: test.description,
        type: 'website',
      },
      {
        path: `/tests/${test.id}/play`,
        title: `${test.title} 진행 중 | ${siteName}`,
        description: test.description,
        type: 'website',
      },
      {
        path: `/tests/${test.id}/result`,
        title: `${test.title} 결과 | ${siteName}`,
        description: test.description,
        type: 'article',
      },
    ]),
  ]
}

function escapeAttr(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function applyOgPlaceholders(
  html: string,
  meta: { title: string; description: string; image: string; url: string; type: string },
) {
  let result = html
    .replaceAll('__OG_TITLE__', escapeAttr(meta.title))
    .replaceAll('__OG_DESCRIPTION__', escapeAttr(meta.description))
    .replaceAll('__OG_TYPE__', escapeAttr(meta.type))
    .replaceAll('__OG_IMAGE__', meta.image)

  if (meta.url) {
    result = result.replaceAll('__OG_URL__', meta.url)
  } else {
    result = result.replace(/    <meta property="og:url" content="__OG_URL__" \/>\n/, '')
  }

  return result
}

function injectOgMeta(siteUrl: string, og: OgConfig): Plugin {
  const origin = siteUrl.replace(/\/$/, '')
  const ogImage = origin ? `${origin}/og-image.png` : '/og-image.png'
  const routes = getAllRouteOg(og, og.siteName)
  const homeMeta = routes[0] ?? {
    path: '/',
    title: og.home.title,
    description: og.home.description,
    type: 'website',
  }
  let htmlTemplate = ''
  let outDir = 'dist'

  const toOg = (route: RouteOg) => ({
    title: route.title,
    description: route.description,
    image: ogImage,
    url: origin ? `${origin}${route.path === '/' ? '/' : route.path}` : '',
    type: route.type,
  })

  return {
    name: 'inject-og-meta',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      htmlTemplate = html
      return applyOgPlaceholders(html, toOg(homeMeta))
    },
    closeBundle() {
      if (!htmlTemplate) return

      for (const route of routes) {
        if (route.path === '/') continue

        const dest = path.join(outDir, route.path, 'index.html')
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, applyOgPlaceholders(htmlTemplate, toOg(route)))
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL ?? ''
  const og = loadOgConfig()

  return {
    plugins: [react(), tailwindcss(), injectOgMeta(siteUrl, og)],
  }
})
