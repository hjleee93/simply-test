import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function getOgImagePath(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === '/') return '/og/home.png'
  if (normalized === '/tests') return '/og/list.png'
  const testMatch = normalized.match(/^\/tests\/([^/]+)/)
  if (testMatch) return `/og/${testMatch[1]}.png`
  return '/og/home.png'
}

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
  indexable: boolean
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
      indexable: true,
    },
    {
      path: '/tests',
      title: og.list.title,
      description: og.list.description,
      type: 'website',
      indexable: true,
    },
    ...og.tests.flatMap((test) => [
      {
        path: `/tests/${test.id}`,
        title: `${test.title} | ${siteName}`,
        description: test.description,
        type: 'website',
        indexable: true,
      },
      {
        path: `/tests/${test.id}/play`,
        title: `${test.title} 진행 중 | ${siteName}`,
        description: test.description,
        type: 'website',
        indexable: false,
      },
      {
        path: `/tests/${test.id}/result`,
        title: `${test.title} 결과 | ${siteName}`,
        description: test.description,
        type: 'article',
        indexable: false,
      },
    ]),
  ]
}

function escapeAttr(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toCanonicalUrl(origin: string, routePath: string) {
  if (!origin) return routePath
  return `${origin}${routePath === '/' ? '/' : routePath}`
}

function getRobotsContent(route: RouteOg) {
  return route.indexable ? 'index, follow' : 'noindex, nofollow'
}

function getCanonicalPath(route: RouteOg) {
  if (route.path.endsWith('/result') || route.path.endsWith('/play')) {
    return route.path.replace(/\/(result|play)$/, '')
  }
  return route.path
}

function applyOgPlaceholders(
  html: string,
  meta: {
    title: string
    description: string
    image: string
    url: string
    canonicalUrl: string
    type: string
    robots: string
  },
) {
  let result = html
    .replaceAll('__OG_TITLE__', escapeAttr(meta.title))
    .replaceAll('__OG_DESCRIPTION__', escapeAttr(meta.description))
    .replaceAll('__OG_TYPE__', escapeAttr(meta.type))
    .replaceAll('__OG_IMAGE__', meta.image)
    .replaceAll('__ROBOTS__', escapeAttr(meta.robots))
    .replaceAll('__CANONICAL_URL__', escapeAttr(meta.canonicalUrl))

  if (meta.url) {
    result = result.replaceAll('__OG_URL__', meta.url)
  } else {
    result = result.replace(/    <meta property="og:url" content="__OG_URL__" \/>\n/, '')
  }

  return result
}

function buildSitemapXml(origin: string, routes: RouteOg[]) {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((route) => route.indexable)
    .map((route) => {
      const priority =
        route.path === '/' ? '1.0' : route.path === '/tests' ? '0.8' : '0.9'
      const loc = toCanonicalUrl(origin, route.path)
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function buildRobotsTxt(origin: string) {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /tests/*/play',
    'Disallow: /tests/*/result',
  ]

  if (origin) {
    lines.push('', `Sitemap: ${origin}/sitemap.xml`)
  }

  return `${lines.join('\n')}\n`
}

function injectOgMeta(siteUrl: string, og: OgConfig): Plugin {
  const origin = siteUrl.replace(/\/$/, '')
  const routes = getAllRouteOg(og, og.siteName)
  const homeMeta = routes[0] ?? {
    path: '/',
    title: og.home.title,
    description: og.home.description,
    type: 'website',
    indexable: true,
  }
  let htmlTemplate = ''
  let outDir = 'dist'

  const toOg = (route: RouteOg) => {
    const imagePath = getOgImagePath(route.path)
    return {
      title: route.title,
      description: route.description,
      image: origin ? `${origin}${imagePath}` : imagePath,
      url: origin ? toCanonicalUrl(origin, route.path) : '',
      canonicalUrl: toCanonicalUrl(origin, getCanonicalPath(route)),
      type: route.type,
      robots: getRobotsContent(route),
    }
  }

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

      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemapXml(origin, routes))
      fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobotsTxt(origin))
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
