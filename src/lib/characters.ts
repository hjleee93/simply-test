/** 도트 스타일 캐릭터 경로 — 최적화된 로컬 이미지 사용 */
export const PIXEL_CHARACTER_DIR = '/characters/pixel'

/** CDN 폴백 (로컬에 없는 이미지용) */
export const PIXEL_CHARACTER_CDN = 'https://cdn.simply-test.co.kr/characters/pixel'

/** 워터마크용 소형 마스코트 아이콘 — 새싹 식물 (얼굴 없음) */
export const BRAND_SPROUT_PATH = '/brand-sprout.png'

/** 전체 로고 — 곰 캐릭터 + "Simply Test" + "심리테스트" 워드마크 한 장 */
export const BRAND_LOGO_PATH = '/brand-logo.png'

/** 로컬에 최적화된 이미지가 있는 캐릭터 ID 목록 */
const LOCAL_OPTIMIZED_CHARACTERS = new Set([
  'main_hero',
  'adapted',
  'steel',
  'subtle',
  'kkondae/main',
  'relationship/main',
  'workplace/survival',
  'jinsang/main',
])

export function pixelCharacterPath(id: string): string {
  if (LOCAL_OPTIMIZED_CHARACTERS.has(id)) {
    return `${PIXEL_CHARACTER_DIR}/${id}.png`
  }
  return `${PIXEL_CHARACTER_CDN}/${id}.png`
}

export function pixelCharacterWebpPath(id: string): string | null {
  if (LOCAL_OPTIMIZED_CHARACTERS.has(id)) {
    return `${PIXEL_CHARACTER_DIR}/${id}.webp`
  }
  return null
}

/** CDN base URL for character images */
const CDN_CHARACTER_BASE = 'https://cdn.simply-test.co.kr/characters/'

/**
 * 썸네일 캐릭터 값을 WebP 경로로 변환한다.
 * - CDN URL (cdn.simply-test.co.kr/characters/...) → 로컬 /characters/...webp
 * - /characters/...png → /characters/...webp
 * - 그 외 절대 경로 → null
 * - pixel 캐릭터 id → 로컬에 있으면 WebP 경로, 없으면 null
 */
export function resolveCharacterWebp(value: string): string | null {
  if (value.startsWith(CDN_CHARACTER_BASE) && value.endsWith('.png')) {
    const localPath = value.replace(CDN_CHARACTER_BASE, '/characters/').replace(/\.png$/, '.webp')
    return localPath
  }
  if (/^https?:\/\//.test(value)) return null
  if (value.startsWith('/characters/') && value.endsWith('.png')) {
    return value.replace(/\.png$/, '.webp')
  }
  if (value.startsWith('/')) return null
  return pixelCharacterWebpPath(value)
}

/**
 * 썸네일 캐릭터 값을 이미지 경로로 변환한다.
 * - CDN URL (cdn.simply-test.co.kr/characters/...) → 로컬 /characters/...
 * - http(s):// 외부 URL → 그대로 사용
 * - / 로 시작하는 절대 경로 → 그대로 사용
 * - 그 외 pixel 캐릭터 id → 로컬 또는 CDN 경로
 */
export function resolveCharacterImage(value: string): string {
  if (value.startsWith(CDN_CHARACTER_BASE) && value.endsWith('.png')) {
    return value.replace(CDN_CHARACTER_BASE, '/characters/')
  }
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value
  return pixelCharacterPath(value)
}

export function brandCharacterPath(): string {
  return BRAND_SPROUT_PATH
}

export function brandLogoPath(): string {
  return BRAND_LOGO_PATH
}
