import og from './og.json' with { type: 'json' }

export const SITE_NAME = og.siteName
export const SITE_NAME_KO = '심플리테스트'
export const INSTAGRAM_HANDLE = 'ssimplytest'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
/** TODO: 문의용 이메일을 넣으면 푸터·정책 페이지에 노출된다. 비어 있으면 인스타그램 DM으로 안내한다. */
export const CONTACT_EMAIL = 'help@simply-test.co.kr'
/** 개인정보처리방침·이용약관 시행일 */
export const POLICY_EFFECTIVE_DATE = '2026년 11월 26일'

export const DEFAULT_OG = {
  title: og.home.title,
  description: og.home.description,
  imagePath: '/characters/pixel/main_hero.png',
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
  if (/^https?:\/\//i.test(path)) return path
  const origin = getSiteOrigin()
  if (!origin) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
