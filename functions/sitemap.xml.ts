import { createClient } from '@supabase/supabase-js'

interface Env {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_SITE_URL: string
  ASSETS: Fetcher
}

interface TestRow {
  id: string
  title: string
  updated_at: string | null
  publish_at: string
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
    const lastmod = formatDate(test.updated_at ?? test.publish_at)
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context
  const origin = (env.VITE_SITE_URL || 'https://simply-test.co.kr').replace(/\/$/, '')

  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    const fallback = await env.ASSETS.fetch(new Request(new URL('/sitemap.xml', request.url)))
    return new Response(fallback.body, {
      status: fallback.status,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  try {
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
    const { data, error } = await supabase
      .from('tests')
      .select('id, title, updated_at, publish_at')
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })

    if (error) throw error

    const xml = buildSitemapXml(origin, data ?? [])

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
