import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTest } from '../lib/useTests'
import { trackPageView } from '../lib/analytics'
import { buildQuizJsonLd, buildWebSiteJsonLd } from '../lib/jsonLd'
import { getOgImagePath } from '../lib/ogImages'
import { getDefaultRouteMeta, getStaticRouteMeta } from '../lib/routeMeta'
import { DEFAULT_OG, SITE_NAME, getSiteOrigin, toAbsoluteUrl } from '../lib/site'

export interface PageMetaProps {
  title?: string
  description?: string
  imagePath?: string
  url?: string
  canonicalPath?: string
  type?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const JSON_LD_ID = 'page-json-ld'

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function upsertJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  let element = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null

  if (!element) {
    element = document.createElement('script')
    element.id = JSON_LD_ID
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

function removeJsonLd() {
  document.getElementById(JSON_LD_ID)?.remove()
}

export default function PageMeta({
  title = DEFAULT_OG.title,
  description = DEFAULT_OG.description,
  imagePath = DEFAULT_OG.imagePath,
  url,
  canonicalPath,
  type = DEFAULT_OG.type,
  noindex = false,
  jsonLd,
}: PageMetaProps) {
  useLayoutEffect(() => {
    const pageUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
    const imageUrl = toAbsoluteUrl(imagePath)
    const canonicalUrl = canonicalPath
      ? toAbsoluteUrl(canonicalPath)
      : pageUrl.replace(/\?.*$/, '') || toAbsoluteUrl('/')

    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:locale', DEFAULT_OG.locale)
    if (pageUrl) upsertMeta('property', 'og:url', pageUrl)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)

    upsertLink('canonical', canonicalUrl)

    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow')
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove()
    }

    if (jsonLd) {
      upsertJsonLd(jsonLd)
    } else {
      removeJsonLd()
    }
  }, [title, description, imagePath, url, canonicalPath, type, noindex, jsonLd])

  return null
}

function getCanonicalPath(pathname: string) {
  if (pathname.endsWith('/play') || pathname.endsWith('/result')) {
    return pathname.replace(/\/(play|result)$/, '')
  }
  return pathname
}

const TEST_ROUTE_RE = /^\/tests\/([^/]+)(?:\/(play|result))?\/?$/

export function RoutePageMeta() {
  const { pathname, search } = useLocation()
  const testRouteMatch = pathname.match(TEST_ROUTE_RE)
  const testId = testRouteMatch?.[1]
  const subpage = testRouteMatch?.[2]
  const { test, loading } = useTest(testId)

  useEffect(() => {
    trackPageView(`${pathname}${search}`)
  }, [pathname, search])

  if (testId) {
    const canonicalPath = `/tests/${testId}`
    const origin = getSiteOrigin()

    if (loading) {
      return null
    }

    if (!test) {
      return (
        <PageMeta
          title={`테스트를 찾을 수 없어요 | ${SITE_NAME}`}
          description={DEFAULT_OG.description}
          imagePath={getOgImagePath(canonicalPath)}
          canonicalPath={canonicalPath}
          noindex
        />
      )
    }

    const titleSuffix = subpage === 'play' ? ' 진행 중' : subpage === 'result' ? ' 결과' : ''
    const jsonLd = !subpage && origin ? buildQuizJsonLd(test, origin) : undefined

    return (
      <PageMeta
        title={`${test.title}${titleSuffix} | ${SITE_NAME}`}
        description={test.description}
        imagePath={getOgImagePath(canonicalPath)}
        type={subpage === 'result' ? 'article' : 'website'}
        canonicalPath={canonicalPath}
        noindex={Boolean(subpage)}
        jsonLd={jsonLd}
      />
    )
  }

  const meta = getStaticRouteMeta(pathname) ?? getDefaultRouteMeta(pathname)
  const origin = getSiteOrigin()
  const jsonLd = pathname === '/' && origin ? buildWebSiteJsonLd(origin) : undefined

  return (
    <PageMeta
      title={meta.title}
      description={meta.description}
      imagePath={meta.imagePath}
      type={meta.type}
      canonicalPath={getCanonicalPath(meta.path)}
      noindex={meta.indexable === false}
      jsonLd={jsonLd}
    />
  )
}
