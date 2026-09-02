/** 도트 스타일 캐릭터 경로 (기존 /characters/*.png 는 보존) */
export const PIXEL_CHARACTER_DIR = '/characters/pixel'

/** 로고·브랜드 마스코트 — 새싹 식물 아이콘 (얼굴 없음) */
export const BRAND_SPROUT_PATH = '/brand-sprout.png'

export function pixelCharacterPath(id: string): string {
  return `${PIXEL_CHARACTER_DIR}/${id}.png`
}

export function brandCharacterPath(): string {
  return BRAND_SPROUT_PATH
}
