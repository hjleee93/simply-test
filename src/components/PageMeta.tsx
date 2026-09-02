import { useEffect } from 'react'
import { DEFAULT_OG, SITE_NAME, toAbsoluteUrl } from '../lib/site'

export interface PageMetaProps {
  title?: string
  description?: string
  imagePath?: string
  url?: string
  type?: string
}

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

export default function PageMeta({
  title = DEFAULT_OG.title,
  description = DEFAULT_OG.description,
  imagePath = DEFAULT_OG.imagePath,
  url,
  type = DEFAULT_OG.type,
}: PageMetaProps) {
  useEffect(() => {
    const pageUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
    const imageUrl = toAbsoluteUrl(imagePath)

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
  }, [title, description, imagePath, url, type])

  return null
}
