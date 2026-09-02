/** 도트 스타일 캐릭터 경로 (기존 /characters/*.png 는 보존) */
export const PIXEL_CHARACTER_DIR = '/characters/pixel'

export function pixelCharacterPath(id: string): string {
  return `${PIXEL_CHARACTER_DIR}/${id}.png`
}
