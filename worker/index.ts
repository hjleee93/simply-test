import { createClient } from '@supabase/supabase-js'

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SITE_URL: string
  ASSETS: Fetcher
}

interface TestRow {
  id: string
  title: string
  description: string
  publish_at: string
  created_at: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(date: string | null | undefined): string {
  if (!date) return new Date().toISOString().slice(0, 10)
  return new Date(date).toISOString().slice(0, 10)
}

function toRfc822(date: string): string {
  return new Date(date).toUTCString()
}

function buildSitemapXml(origin: string, tests: TestRow[]): string {
  const urls: string[] = []

  urls.push(`  <url>
    <loc>${escapeXml(origin)}/</loc>
    <lastmod>${formatDate(null)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`)

  urls.push(`  <url>
    <loc>${escapeXml(origin)}/tests</loc>
    <lastmod>${formatDate(null)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`)

  for (const test of tests) {
    const lastmod = formatDate(test.publish_at)
    urls.push(`  <url>
    <loc>${escapeXml(origin)}/tests/${escapeXml(test.id)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

function buildRssXml(origin: string, tests: TestRow[]): string {
  const items = tests.map((test) => `    <item>
      <title>${escapeXml(test.title)}</title>
      <link>${escapeXml(origin)}/tests/${escapeXml(test.id)}</link>
      <description>${escapeXml(test.description)}</description>
      <pubDate>${toRfc822(test.publish_at)}</pubDate>
      <guid isPermaLink="true">${escapeXml(origin)}/tests/${escapeXml(test.id)}</guid>
    </item>`)

  const lastBuildDate = tests.length > 0 ? toRfc822(tests[0].publish_at) : toRfc822(new Date().toISOString())

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

async function fetchPublishedTests(env: Env): Promise<TestRow[]> {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration missing')
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('tests')
    .select('id, title, description, publish_at, created_at')
    .lte('publish_at', new Date().toISOString())
    .order('publish_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function handleSitemap(request: Request, env: Env): Promise<Response> {
  const origin = (env.SITE_URL || 'https://simply-test.co.kr').replace(/\/$/, '')

  try {
    const tests = await fetchPublishedTests(env)
    const xml = buildSitemapXml(origin, tests)

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('Sitemap generation failed, falling back to static:', err)
    const fallback = await env.ASSETS.fetch(new Request(new URL('/sitemap.xml', request.url)))
    return new Response(fallback.body, {
      status: fallback.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}

async function handleRss(request: Request, env: Env): Promise<Response> {
  const origin = (env.SITE_URL || 'https://simply-test.co.kr').replace(/\/$/, '')

  try {
    const tests = await fetchPublishedTests(env)
    const xml = buildRssXml(origin, tests)

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('RSS generation failed, falling back to static:', err)
    const fallback = await env.ASSETS.fetch(new Request(new URL('/rss.xml', request.url)))
    return new Response(fallback.body, {
      status: fallback.status,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === '/sitemap.xml') {
      return handleSitemap(request, env)
    }

    if (pathname === '/rss.xml') {
      return handleRss(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
