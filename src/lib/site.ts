import og from './og.json' with { type: 'json' }

export const SITE_NAME = og.siteName

export const DEFAULT_OG = {
  title: og.home.title,
  description: og.home.description,
  imagePath: '/og-image.png',
  type: 'website',
  locale: 'ko_KR',
} as const

export function getSiteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function toAbsoluteUrl(path: string): string {
  const origin = getSiteOrigin()
  if (!origin) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
