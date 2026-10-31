import { createClient } from '@supabase/supabase-js'

interface Env {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_SITE_URL: string
}

interface TestRow {
  id: string
  title: string
  description: string
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

function toRfc822(date: string): string {
  return new Date(date).toUTCString()
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context
  const origin = (env.VITE_SITE_URL || 'https://simply-test.co.kr').replace(/\/$/, '')

  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
    return new Response('RSS feed unavailable: missing configuration', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  try {
    const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
    const { data, error } = await supabase
      .from('tests')
      .select('id, title, description, publish_at')
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })

    if (error) throw error

    const xml = buildRssXml(origin, data ?? [])

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('RSS generation failed:', err)
    return new Response('RSS feed generation failed', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
