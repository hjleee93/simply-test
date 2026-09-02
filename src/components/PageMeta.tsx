import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getTest } from '../data'
import { trackPageView } from '../lib/analytics'
import { buildQuizJsonLd, buildWebSiteJsonLd } from '../lib/jsonLd'
import { getRouteMeta } from '../lib/routeMeta'
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

function getRouteJsonLd(pathname: string): Record<string, unknown> | undefined {
  const origin = getSiteOrigin()
  if (!origin) return undefined

  if (pathname === '/') {
    return buildWebSiteJsonLd(origin)
  }

  const testDetailMatch = pathname.match(/^\/tests\/([^/]+)$/)
  if (testDetailMatch) {
    const test = getTest(testDetailMatch[1])
    if (test) return buildQuizJsonLd(test, origin)
  }

  return undefined
}

function getCanonicalPath(pathname: string) {
  if (pathname.endsWith('/play') || pathname.endsWith('/result')) {
    return pathname.replace(/\/(play|result)$/, '')
  }
  return pathname
}

export function RoutePageMeta() {
  const { pathname, search } = useLocation()
  const meta = getRouteMeta(pathname)
  const jsonLd = getRouteJsonLd(pathname)

  useLayoutEffect(() => {
    trackPageView(`${pathname}${search}`)
  }, [pathname, search])

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
