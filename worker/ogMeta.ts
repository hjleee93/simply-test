export type OgMetaPatch = {
  image: string
  width?: number
  height?: number
  alt?: string
}

function escapeAttr(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function removeMeta(html: string, attr: 'property' | 'name', key: string): string {
  return html.replace(
    new RegExp(`\\n?[ \\t]*<meta ${attr}="${key}" content="[^"]*" \\/>`, 'g'),
    '',
  )
}

function replaceMeta(
  html: string,
  attr: 'property' | 'name',
  key: string,
  content: string,
): string {
  const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`, 'g')
  const safe = escapeAttr(content)
  return html.replace(pattern, (_match, start: string, end: string) => `${start}${safe}${end}`)
}

export type PageMetaPatch = OgMetaPatch & {
  title: string
  description: string
  canonicalUrl: string
  pageUrl: string
  robots: string
  type: string
}

function replaceCanonical(html: string, href: string): string {
  const safe = escapeAttr(href)
  return html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    (_match, start: string, end: string) => `${start}${safe}${end}`,
  )
}

function replaceTitle(html: string, title: string): string {
  const safe = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  return html.replace(/<title>[^<]*<\/title>/, `<title>${safe}</title>`)
}

/** 배포 이후 생긴 테스트는 홈 HTML을 빌려 연다. 홈 본문과 구조화 데이터는 빼 둔다. */
export function adaptShellHtml(html: string, body: string): string {
  const withoutJsonLd = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/,
    '',
  )
  const open = '<div id="root">'
  const start = withoutJsonLd.indexOf(open)
  if (start === -1) return withoutJsonLd

  const openEnd = start + open.length
  let depth = 1
  let cursor = openEnd
  let closeAt = -1
  while (cursor < withoutJsonLd.length && depth > 0) {
    const nextOpen = withoutJsonLd.indexOf('<div', cursor)
    const nextClose = withoutJsonLd.indexOf('</div>', cursor)
    if (nextClose === -1) return withoutJsonLd
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1
      cursor = nextOpen + 4
    } else {
      depth -= 1
      closeAt = nextClose
      cursor = nextClose + '</div>'.length
    }
  }
  if (closeAt === -1) return withoutJsonLd
  return `${withoutJsonLd.slice(0, openEnd)}${body}${withoutJsonLd.slice(closeAt)}`
}

export type TestPageKind = 'detail' | 'play' | 'result'

export function testPageKind(pathname: string): TestPageKind {
  const match = pathname.match(/^\/tests\/[^/]+\/(play|result)\/?$/)
  if (match?.[1] === 'play') return 'play'
  if (match?.[1] === 'result') return 'result'
  return 'detail'
}

export function testPageTitle(title: string, kind: TestPageKind, siteName: string): string {
  const suffix = kind === 'play' ? ' 진행 중' : kind === 'result' ? ' 결과' : ''
  return `${title}${suffix} | ${siteName}`
}

/** 정적 HTML의 og:image / twitter:image 를 관리자에 저장된 값으로 바꾼다. */
export function patchOgImageTags(html: string, meta: OgMetaPatch): string {
  let next = removeMeta(html, 'property', 'og:image:width')
  next = removeMeta(next, 'property', 'og:image:height')
  next = removeMeta(next, 'name', 'twitter:image:alt')
  next = replaceMeta(next, 'property', 'og:image', meta.image)
  next = replaceMeta(next, 'name', 'twitter:image', meta.image)

  const extras: string[] = []
  if (meta.width != null && meta.height != null) {
    extras.push(
      `<meta property="og:image:width" content="${escapeAttr(String(meta.width))}" />`,
    )
    extras.push(
      `<meta property="og:image:height" content="${escapeAttr(String(meta.height))}" />`,
    )
  }
  if (meta.alt) {
    extras.push(`<meta name="twitter:image:alt" content="${escapeAttr(meta.alt)}" />`)
  }
  if (extras.length === 0) return next

  return next.replace(
    /(<meta property="og:image" content="[^"]*" \/>)/,
    `$1\n    ${extras.join('\n    ')}`,
  )
}

/** 홈 셸을 테스트 주소의 제목·설명·공유 이미지로 맞춘다. */
export function patchPageMeta(html: string, meta: PageMetaPatch): string {
  let next = patchOgImageTags(html, meta)
  next = replaceMeta(next, 'name', 'description', meta.description)
  next = replaceMeta(next, 'name', 'robots', meta.robots)
  next = replaceMeta(next, 'property', 'og:title', meta.title)
  next = replaceMeta(next, 'property', 'og:description', meta.description)
  next = replaceMeta(next, 'property', 'og:url', meta.pageUrl)
  next = replaceMeta(next, 'property', 'og:type', meta.type)
  next = replaceMeta(next, 'name', 'twitter:title', meta.title)
  next = replaceMeta(next, 'name', 'twitter:description', meta.description)
  next = replaceCanonical(next, meta.canonicalUrl)
  return replaceTitle(next, meta.title)
}

const TEST_PAGE = /^\/tests\/([^/]+)(?:\/(?:play|result))?\/?$/

export function testIdFromPath(pathname: string): string | null {
  const match = pathname.match(TEST_PAGE)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}
