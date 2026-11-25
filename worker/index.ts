import { createClient } from '@supabase/supabase-js'
import { getTestOgImageMeta } from '../src/lib/ogImages'
import {
  adaptShellHtml,
  patchOgImageTags,
  patchPageMeta,
  testIdFromPath,
  testPageKind,
  testPageTitle,
} from './ogMeta'
import ogConfig from '../src/lib/og.json'
import { handleImageUpload } from './upload'

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SITE_URL: string
  ADMIN_EMAILS?: string
  ASSETS: Fetcher
  IMAGES: {
    put(
      key: string,
      value: ReadableStream | ArrayBuffer | string,
      options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
    ): Promise<unknown>
  }
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

interface TestOgRow {
  id: string
  title: string
  description: string
  character: string
  og_image: string | null
  og_image_width: number | null
  og_image_height: number | null
}

function toAbsoluteImageUrl(origin: string, image: string): string {
  if (/^https?:\/\//i.test(image)) return image
  if (!origin) return image
  return `${origin}${image.startsWith('/') ? image : `/${image}`}`
}

async function fetchTestOg(env: Env, testId: string): Promise<TestOgRow | null> {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from('tests')
    .select('id, title, description, character, og_image, og_image_width, og_image_height')
    .eq('id', testId)
    .lte('publish_at', new Date().toISOString())
    .maybeSingle()

  if (error) throw error
  return data
}

function htmlResponse(html: string, status: number, source?: Headers): Response {
  const headers = new Headers(source)
  headers.delete('content-length')
  headers.delete('content-encoding')
  headers.set('Content-Type', 'text/html; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=60')
  return new Response(html, { status, headers })
}

async function cancelBody(response: Response) {
  try {
    await response.body?.cancel()
  } catch {
    // 이미 읽힌 본문은 무시한다.
  }
}

/** 마지막 배포 이후 공개된 테스트는 정적 파일이 없다. 홈 셸을 그 주소로 열어 준다. */
async function handleMissingTestPage(
  request: Request,
  env: Env,
  testId: string,
  missing: Response,
): Promise<Response> {
  let row: TestOgRow | null
  try {
    row = await fetchTestOg(env, testId)
  } catch (err) {
    console.error('Published test lookup failed:', err)
    return missing
  }
  if (!row) return missing

  const shellUrl = new URL('/', request.url)
  const shell = await env.ASSETS.fetch(new Request(shellUrl))
  if (!shell.ok) {
    await cancelBody(shell)
    return missing
  }

  await cancelBody(missing)
  const url = new URL(request.url)
  const origin = (env.SITE_URL || url.origin).replace(/\/$/, '')
  const kind = testPageKind(url.pathname)
  const canonicalPath = `/tests/${row.id}`
  const og = getTestOgImageMeta(row.character, row.id, {
    image: row.og_image,
    width: row.og_image_width,
    height: row.og_image_height,
    alt: row.title,
  })
  const title = testPageTitle(row.title, kind, ogConfig.siteName)
  const html = patchPageMeta(
    adaptShellHtml(
      await shell.text(),
      `<main><h1>${escapeXml(row.title)}</h1><p>${escapeXml(row.description)}</p></main>`,
    ),
    {
      title,
      description: row.description,
      canonicalUrl: `${origin}${canonicalPath}`,
      pageUrl: `${origin}${url.pathname}`,
      robots: kind === 'detail' ? 'index, follow' : 'noindex, nofollow',
      type: kind === 'result' ? 'article' : 'website',
      image: toAbsoluteImageUrl(origin, og.image),
      width: og.width,
      height: og.height,
      alt: og.alt,
    },
  )
  return htmlResponse(html, 200)
}

async function handleTestHtml(request: Request, env: Env, testId: string): Promise<Response> {
  const assetResponse = await env.ASSETS.fetch(request)
  const contentType = assetResponse.headers.get('content-type') ?? ''
  if (!assetResponse.ok) {
    if (!contentType.includes('text/html')) return assetResponse
    return handleMissingTestPage(request, env, testId, assetResponse)
  }
  if (!contentType.includes('text/html')) return assetResponse

  let row: TestOgRow | null
  try {
    row = await fetchTestOg(env, testId)
  } catch (err) {
    console.error('OG image lookup failed:', err)
    return assetResponse
  }
  if (!row) return assetResponse

  const origin = (env.SITE_URL || 'https://simply-test.co.kr').replace(/\/$/, '')
  const og = getTestOgImageMeta(row.character, row.id, {
    image: row.og_image,
    width: row.og_image_width,
    height: row.og_image_height,
    alt: row.title,
  })
  const html = patchOgImageTags(await assetResponse.text(), {
    image: toAbsoluteImageUrl(origin, og.image),
    width: og.width,
    height: og.height,
    alt: og.alt,
  })

  return htmlResponse(html, assetResponse.status, assetResponse.headers)
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

    if (pathname === '/api/admin/uploads') {
      return handleImageUpload(request, env)
    }

    const testId = request.method === 'GET' ? testIdFromPath(pathname) : null
    if (testId) {
      return handleTestHtml(request, env, testId)
    }

    return env.ASSETS.fetch(request)
  },
}
