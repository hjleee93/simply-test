import { resolveCharacterImage } from './characters'

/** 홈·목록 등 정적 페이지 기본 공유 이미지 (메인 히어로) */
export const DEFAULT_OG_IMAGE = '/characters/pixel/main_hero.png'

/** 테스트 thumbnailCharacter → og:image 에 쓸 경로/URL */
export function getTestOgImage(character: string | undefined): string {
  return resolveCharacterImage(character?.trim() || 'adapted')
}

export function getOgImagePath(_pathname?: string): string {
  return DEFAULT_OG_IMAGE
}
