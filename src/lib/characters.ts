/** 도트 스타일 캐릭터 경로 (기존 /characters/*.png 는 보존) */
export const PIXEL_CHARACTER_DIR = '/characters/pixel'

/** 워터마크용 소형 마스코트 아이콘 — 새싹 식물 (얼굴 없음) */
export const BRAND_SPROUT_PATH = '/brand-sprout.png'

/** 전체 로고 — 곰 캐릭터 + "Simply Test" + "심리테스트" 워드마크 한 장 */
export const BRAND_LOGO_PATH = '/brand-logo.png'

export function pixelCharacterPath(id: string): string {
  return `${PIXEL_CHARACTER_DIR}/${id}.png`
}

/**
 * 썸네일 캐릭터 값을 실제 이미지 경로로 변환한다.
 * - http(s):// 로 시작하면 외부 이미지 URL 그대로 사용
 * - / 로 시작하면 public 기준 절대 경로로 사용
 * - 그 외에는 기존처럼 pixel 캐릭터 id로 간주
 */
export function resolveCharacterImage(value: string): string {
  if (/^https?:\/\//.test(value) || value.startsWith('/')) return value
  return pixelCharacterPath(value)
}

export function brandCharacterPath(): string {
  return BRAND_SPROUT_PATH
}

export function brandLogoPath(): string {
  return BRAND_LOGO_PATH
}
