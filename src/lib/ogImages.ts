import { resolveCharacterImage } from './characters'

export type TestOgImageMeta = {
  image: string
  width?: number
  height?: number
  alt?: string
}

/** 홈·목록 등 정적 페이지 기본 공유 이미지 (메인 히어로) */
export const DEFAULT_OG_IMAGE = '/characters/pixel/main_hero.png'

export type CustomOgImage = {
  image?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

/** 관리자에 저장된 og_image가 있으면 그 값을 쓰고, 없으면 character 썸네일로 폴백한다. */
export function getTestOgImageMeta(
  character: string | undefined,
  _testId?: string,
  custom?: CustomOgImage | null,
): TestOgImageMeta {
  const image = custom?.image?.trim()
  if (image) {
    const meta: TestOgImageMeta = { image }
    if (
      typeof custom?.width === 'number' &&
      typeof custom?.height === 'number' &&
      custom.width > 0 &&
      custom.height > 0
    ) {
      meta.width = custom.width
      meta.height = custom.height
    }
    const alt = custom?.alt?.trim()
    if (alt) meta.alt = alt
    return meta
  }
  return { image: resolveCharacterImage(character?.trim() || 'adapted') }
}

/** 테스트 thumbnailCharacter → og:image 에 쓸 경로/URL. 관리자 og_image가 있으면 그 값을 우선한다. */
export function getTestOgImage(
  character: string | undefined,
  testId?: string,
  custom?: CustomOgImage | null,
): string {
  return getTestOgImageMeta(character, testId, custom).image
}

export function getOgImagePath(_pathname?: string): string {
  return DEFAULT_OG_IMAGE
}
