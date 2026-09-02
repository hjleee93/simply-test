export const SITE_NAME = 'Simply Test'

export const DEFAULT_OG = {
  title: 'Simply Test | 나의 퇴사 임계점은 몇 %?',
  description:
    '귀여운 픽셀 캐릭터와 함께하는 심리 테스트. 3분이면 알 수 있는 나의 퇴사 임계점을 확인해보세요.',
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
