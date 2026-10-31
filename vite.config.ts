import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createClient } from '@supabase/supabase-js'
import { defineConfig, loadEnv, type Plugin } from 'vite'

function getOgImagePath(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === '/') return '/og/home.png'
  if (normalized === '/tests') return '/og/list.png'
  const testMatch = normalized.match(/^\/tests\/([^/]+)/)
  if (testMatch) return `/og/${testMatch[1]}.png`
  return '/og/home.png'
}

type SiteOgConfig = {
  siteName: string
  home: { title: string; description: string }
  list: { title: string; description: string }
}

type TestRouteSource = {
  id: string
  title: string
  description: string
  category: string
  questionCount: number
  character: string
  resultTemplate: string | null
}

type FullTestData = {
  id: string
  title: string
  description: string
  category: string
  character: string
  scoringMode: string
  resultTemplate: string | null
  requiresGender: boolean
  resultLabel: string | null
  minScorePerAnswer: number | null
  questions: unknown[]
  results: unknown[]
}

/** src/lib/testCategories.ts 의 라벨과 반드시 같이 맞춰서 바꿔야 한다. */
const CATEGORY_LABELS: Record<string, string> = {
  workplace: '직장생활',
  relationship: '인간관계',
  romance: '연애',
  self: '자아탐구',
}

/** src/data 의 MAIN_PAGE_TEST_LIMIT 과 같이 맞춰서 바꿔야 한다. */
const HOME_FEATURED_LIMIT = 10

type RouteOg = {
  path: string
  title: string
  description: string
  type: string
  indexable: boolean
}

function buildWebSiteJsonLd(origin: string, siteName: string): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      alternateName: '심플리테스트',
      url: origin,
      inLanguage: 'ko-KR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      alternateName: '심플리테스트',
      url: origin,
      logo: `${origin}/brand-logo.png`,
    },
  ]
}

function buildQuizJsonLd(test: TestRouteSource, origin: string): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: test.title,
      description: test.description,
      url: `${origin}/tests/${test.id}`,
      inLanguage: 'ko-KR',
      numberOfQuestions: test.questionCount,
      educationalLevel: 'general',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '테스트 목록',
          item: `${origin}/tests`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: test.title,
          item: `${origin}/tests/${test.id}`,
        },
      ],
    },
  ]
}

function getRouteJsonLd(routePath: string, origin: string, siteName: string, tests: TestRouteSource[]): string {
  if (!origin) return ''
  
  let jsonLd: object[] | null = null
  
  if (routePath === '/') {
    jsonLd = buildWebSiteJsonLd(origin, siteName)
  } else {
    const match = routePath.match(/^\/tests\/([^/]+)$/)
    if (match) {
      const test = tests.find((item) => item.id === match[1])
      if (test) {
        jsonLd = buildQuizJsonLd(test, origin)
      }
    }
  }
  
  if (!jsonLd) return ''
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
}

function loadSiteOgConfig(): SiteOgConfig {
  const ogPath = fileURLToPath(new URL('./src/lib/og.json', import.meta.url))
  return JSON.parse(fs.readFileSync(ogPath, 'utf8')) as SiteOgConfig
}

/** 테스트 콘텐츠는 Supabase에 있다. 빌드 시점 기준 이미 공개된(publish_at <= now) 테스트만
 *  가져와서 정적 OG/sitemap을 만든다 — 미래에 공개될 테스트는 다음 빌드에서 반영된다. */
async function loadPublishedTests(
  supabaseUrl: string,
  supabaseAnonKey: string,
): Promise<{ routes: TestRouteSource[]; fullTests: Map<string, FullTestData> }> {
  if (!supabaseUrl || !supabaseAnonKey) return { routes: [], fullTests: new Map() }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })

  if (error) {
    console.warn(`[vite] Supabase에서 테스트 목록을 불러오지 못했어요: ${error.message}`)
    return { routes: [], fullTests: new Map() }
  }

  const fullTests = new Map<string, FullTestData>()
  const routes: TestRouteSource[] = []

  for (const row of data ?? []) {
    routes.push({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      questionCount: Array.isArray(row.questions) ? row.questions.length : 0,
      character: row.character ?? 'adapted',
      resultTemplate: row.result_template ?? null,
    })

    fullTests.set(row.id, {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      character: row.character ?? 'adapted',
      scoringMode: row.scoring_mode ?? 'simple',
      resultTemplate: row.result_template ?? null,
      requiresGender: row.requires_gender ?? false,
      resultLabel: row.result_label ?? null,
      minScorePerAnswer: row.min_score_per_answer ?? null,
      questions: row.questions ?? [],
      results: row.results ?? [],
    })
  }

  return { routes, fullTests }
}

function getAllRouteOg(og: SiteOgConfig, tests: TestRouteSource[], siteName: string): RouteOg[] {
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
    ...tests.flatMap((test) => [
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

const escapeHtml = escapeXml

/** 네이버 Yeti 등 JS를 거의 실행하지 않는 크롤러도 실제 텍스트를 읽을 수 있도록,
 *  빌드 시점에 각 라우트의 정적 HTML에 실제 콘텐츠를 미리 그려 넣는다.
 *  React는 createRoot().render() 로 #root 를 그대로 덮어쓰므로 하이드레이션 충돌은 없다. */
function testLinkItem(test: TestRouteSource): string {
  const label = CATEGORY_LABELS[test.category] ?? ''
  return `<li class="mb-3 rounded-2xl bg-white p-4 shadow-[0_2px_18px_-6px_rgba(31,21,53,0.12)] list-none">
      <a href="/tests/${escapeAttr(test.id)}" class="block">
        ${label ? `<span class="mb-1 inline-block text-[11px] font-bold text-accent">${escapeHtml(label)}</span>` : ''}
        <p class="mb-1 text-[15px] font-extrabold text-ink">${escapeHtml(test.title)}</p>
        <p class="text-sm leading-snug text-muted">${escapeHtml(test.description)}</p>
      </a>
    </li>`
}

function buildHomeContent(tests: TestRouteSource[]): string {
  const featured = tests.slice(0, HOME_FEATURED_LIMIT)
  return `<div class="mx-auto max-w-[480px] px-5 pb-8 pt-6">
    <div class="pb-10 pt-6 text-center">
      <div class="mx-auto mb-2 flex h-60 items-center justify-center">
        <picture>
          <source srcset="/characters/pixel/main_hero.webp" type="image/webp" />
          <img src="/characters/pixel/main_hero.png" alt="토끼, 곰, 강아지, 고양이, 여우가 함께 모여 있는 모습" width="1050" height="656" fetchpriority="high" class="h-full w-auto object-contain" />
        </picture>
      </div>
      <h1 class="mt-5 text-[30px] font-black leading-[1.25] tracking-tight text-ink">나도 몰랐던<br />내 진짜 모습</h1>
      <p class="mx-auto mt-3 max-w-[260px] text-[15px] leading-relaxed text-muted">귀엽게 그려진 캐릭터가<br />당신의 숨겨진 성향을 알려줘요</p>
    </div>
    <h2 class="mb-3 text-center text-sm font-extrabold text-muted">인기 테스트</h2>
    <ul>${featured.map(testLinkItem).join('')}</ul>
    <p class="mt-4 text-center"><a href="/tests" class="text-sm font-bold text-accent">전체 테스트 보기 (${tests.length}개) →</a></p>
  </div>`
}

function buildListContent(tests: TestRouteSource[]): string {
  return `<div class="mx-auto max-w-[480px] px-5 pb-8 pt-6">
    <h1 class="text-[26px] font-black leading-tight text-ink">테스트 목록</h1>
    <p class="mt-2 text-[15px] leading-relaxed text-muted">궁금한 거 골라보세요~</p>
    <ul class="mt-5">${tests.map(testLinkItem).join('')}</ul>
  </div>`
}

function buildTestContent(test: TestRouteSource, allTests: TestRouteSource[]): string {
  const label = CATEGORY_LABELS[test.category] ?? ''
  const related = allTests.filter((other) => other.id !== test.id).slice(0, 3)
  return `<div class="mx-auto max-w-[480px] px-5 pb-8 pt-6">
    ${label ? `<span class="inline-flex items-center rounded-full bg-accent-soft px-3.5 py-1.5 text-[13px] font-bold text-accent-hover">${escapeHtml(label)}</span>` : ''}
    <h1 class="mt-3 text-[26px] font-black leading-tight text-ink">${escapeHtml(test.title)}</h1>
    <p class="mt-3 text-[15px] leading-relaxed text-muted">${escapeHtml(test.description)}</p>
    <p class="mt-2 text-xs font-bold text-muted">${test.questionCount}문항</p>
    <p class="mt-6"><a href="/tests/${escapeAttr(test.id)}/play" class="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-accent px-5 text-base font-bold text-white">테스트 시작하기</a></p>
    ${
      related.length
        ? `<h2 class="mb-3 mt-10 text-sm font-extrabold text-muted">다른 테스트도 해보세요</h2><ul>${related.map(testLinkItem).join('')}</ul>`
        : ''
    }
  </div>`
}

function getRouteContent(routePath: string, tests: TestRouteSource[]): string {
  if (routePath === '/') return buildHomeContent(tests)
  if (routePath === '/tests') return buildListContent(tests)
  const match = routePath.match(/^\/tests\/([^/]+)$/)
  if (match) {
    const test = tests.find((item) => item.id === match[1])
    if (test) return buildTestContent(test, tests)
  }
  return ''
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
    jsonLd: string
    isHomePage?: boolean
  },
  content = '',
  inlineData = '',
) {
  const heroPreload = meta.isHomePage
    ? '<!-- Preload hero image for LCP -->\n    <link rel="preload" href="/characters/pixel/main_hero.webp" as="image" type="image/webp" fetchpriority="high" />'
    : ''

  let result = html
    .replaceAll('__OG_TITLE__', escapeAttr(meta.title))
    .replaceAll('__OG_DESCRIPTION__', escapeAttr(meta.description))
    .replaceAll('__OG_TYPE__', escapeAttr(meta.type))
    .replaceAll('__OG_IMAGE__', meta.image)
    .replaceAll('__ROBOTS__', escapeAttr(meta.robots))
    .replaceAll('__CANONICAL_URL__', escapeAttr(meta.canonicalUrl))
    .replace('__PRERENDER_CONTENT__', content)
    .replace('__JSON_LD__', meta.jsonLd)
    .replace('__HERO_PRELOAD__', heroPreload)
    .replace('__INLINE_DATA__', inlineData)

  if (meta.url) {
    result = result.replaceAll('__OG_URL__', meta.url)
  } else {
    result = result.replace(/ {4}<meta property="og:url" content="__OG_URL__" \/>\n/, '')
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
    'Disallow: /admin',
    'Disallow: /admin/',
  ]

  if (origin) {
    lines.push('', `Sitemap: ${origin}/sitemap.xml`)
  }

  return `${lines.join('\n')}\n`
}

function toRfc822(date: string): string {
  return new Date(date).toUTCString()
}

function buildRssXml(origin: string, tests: TestRouteSource[]): string {
  const items = tests.map((test) => `    <item>
      <title>${escapeXml(test.title)}</title>
      <link>${escapeXml(origin)}/tests/${escapeXml(test.id)}</link>
      <description>${escapeXml(test.description)}</description>
      <pubDate>${toRfc822(new Date().toISOString())}</pubDate>
      <guid isPermaLink="true">${escapeXml(origin)}/tests/${escapeXml(test.id)}</guid>
    </item>`)

  const lastBuildDate = toRfc822(new Date().toISOString())

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>심플리테스트 | Simply Test</title>
    <link>${escapeXml(origin)}</link>
    <description>귀엽게 그려진 캐릭터가 당신의 숨겨진 성향을 알려주는 심리 테스트 모음</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(origin)}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`
}

function build404Html(origin: string, og: SiteOgConfig): string {
  const imagePath = '/og/home.png'
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#FBF3E6" />
    <meta name="description" content="페이지를 찾을 수 없습니다." />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:site_name" content="${escapeAttr(og.siteName)}" />
    <meta property="og:title" content="페이지를 찾을 수 없어요 | ${escapeAttr(og.siteName)}" />
    <meta property="og:description" content="페이지를 찾을 수 없습니다." />
    <meta property="og:image" content="${origin}${imagePath}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ko_KR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="페이지를 찾을 수 없어요 | ${escapeAttr(og.siteName)}" />
    <meta name="twitter:description" content="페이지를 찾을 수 없습니다." />
    <meta name="twitter:image" content="${origin}${imagePath}" />
    <title>페이지를 찾을 수 없어요 | ${escapeAttr(og.siteName)}</title>
    <style>
      body{font-family:'Pretendard Variable','Pretendard','Apple SD Gothic Neo','Noto Sans KR',sans-serif;background:#fbf3e6;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center}
      .container{text-align:center;padding:2rem}
      h1{font-size:1.5rem;color:#1f1535;margin-bottom:0.5rem}
      p{color:#756884;margin-bottom:1.5rem}
      a{display:inline-flex;align-items:center;justify-content:center;height:3rem;padding:0 1.5rem;background:#e0527c;color:#fff;border-radius:9999px;text-decoration:none;font-weight:700}
      a:hover{background:#c8456b}
    </style>
  </head>
  <body>
    <div class="container">
      <h1>페이지를 찾을 수 없어요</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </div>
  </body>
</html>
`
}

/** 로컬 개발에서만 미공개(publish_at 미래) 테스트까지 보여준다.
 *  content는 항상 Supabase가 원본이며, service_role은 Vite 서버 측에서만 사용한다. */
function localUnpublishedTestsPreview(): Plugin {
  return {
    name: 'local-unpublished-tests-preview',
    configureServer(server) {
      server.middlewares.use('/__dev/tests', async (_req, res) => {
        const env = loadEnv(server.config.mode, process.cwd(), '')
        const scriptsEnvPath = path.join(process.cwd(), 'scripts', '.env')
        if (fs.existsSync(scriptsEnvPath)) {
          const dotenv = await import('dotenv')
          dotenv.config({ path: scriptsEnvPath })
        }

        const supabaseUrl = process.env.SUPABASE_URL || env.VITE_SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceRoleKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                '로컬 미공개 프리뷰에는 scripts/.env 의 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 필요해요.',
            }),
          )
          return
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey)
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .order('publish_at', { ascending: false })

        if (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message }))
          return
        }

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data ?? []))
      })
    },
  }
}

function getTestSlugFromPath(routePath: string): string | null {
  const match = routePath.match(/^\/tests\/([^/]+)$/)
  return match ? match[1] : null
}

function buildPageInlineScript(tests: TestRouteSource[], fullTests: Map<string, FullTestData>, routePath: string): string {
  const testsJson = JSON.stringify(tests.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    character: t.character,
    resultTemplate: t.resultTemplate,
  })))

  const testSlug = getTestSlugFromPath(routePath)
  if (testSlug) {
    const fullTest = fullTests.get(testSlug)
    if (fullTest) {
      return `<script>window.__TESTS__=${testsJson};window.__TEST__=${JSON.stringify(fullTest)}</script>`
    }
  }

  return `<script>window.__TESTS__=${testsJson}</script>`
}

function injectOgMeta(siteUrl: string, og: SiteOgConfig, tests: TestRouteSource[], fullTests: Map<string, FullTestData>): Plugin {
  const origin = siteUrl.replace(/\/$/, '')
  const routes = getAllRouteOg(og, tests, og.siteName)
  const homeMeta = routes[0] ?? {
    path: '/',
    title: og.home.title,
    description: og.home.description,
    type: 'website',
    indexable: true,
  }
  let htmlTemplate = ''
  let outDir = 'dist'
  let isBuild = false

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
      jsonLd: getRouteJsonLd(route.path, origin, og.siteName, tests),
      isHomePage: route.path === '/',
    }
  }

  return {
    name: 'inject-og-meta',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === 'build'
    },
    transformIndexHtml(html) {
      htmlTemplate = html
      const content = isBuild ? getRouteContent('/', tests) : ''
      const inlineData = isBuild ? buildPageInlineScript(tests, fullTests, '/') : ''
      return applyOgPlaceholders(html, toOg(homeMeta), content, inlineData)
    },
    closeBundle() {
      if (!htmlTemplate) return

      for (const route of routes) {
        if (route.path === '/') continue

        const dest = path.join(outDir, route.path, 'index.html')
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        const content = getRouteContent(route.path, tests)
        const inlineData = buildPageInlineScript(tests, fullTests, route.path)
        fs.writeFileSync(dest, applyOgPlaceholders(htmlTemplate, toOg(route), content, inlineData))
      }

      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemapXml(origin, routes))
      fs.writeFileSync(path.join(outDir, 'rss.xml'), buildRssXml(origin, tests))
      fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobotsTxt(origin))
      fs.writeFileSync(path.join(outDir, '404.html'), build404Html(origin, og))
    },
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL ?? ''
  const og = loadSiteOgConfig()
  const { routes: tests, fullTests } = await loadPublishedTests(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

  return {
    plugins: [react(), tailwindcss(), localUnpublishedTestsPreview(), injectOgMeta(siteUrl, og, tests, fullTests)],
  }
})
