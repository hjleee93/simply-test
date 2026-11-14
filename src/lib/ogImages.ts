import { withAssetVersion } from './assetVersions'
import { resolveCharacterImage } from './characters'
import { TEST_OG_IMAGES, type TestOgImageMeta } from './testOgOverrides'

export type { TestOgImageMeta }
export { TEST_OG_IMAGES }

/** 홈·목록 등 정적 페이지 기본 공유 이미지 (메인 히어로) */
export const DEFAULT_OG_IMAGE = '/characters/pixel/main_hero.png'

/** 테스트별 전용 OG 메타. 없으면 character → resolveCharacterImage 폴백. */
export function getTestOgImageMeta(
  character: string | undefined,
  testId?: string,
): TestOgImageMeta {
  if (testId) {
    const override = TEST_OG_IMAGES[testId]
    if (override) {
      return {
        ...override,
        image: withAssetVersion(override.image, testId),
      }
    }
  }
  return { image: resolveCharacterImage(character?.trim() || 'adapted') }
}

/** 테스트 thumbnailCharacter → og:image 에 쓸 경로/URL. testId가 있으면 전용 OG 우선. */
export function getTestOgImage(character: string | undefined, testId?: string): string {
  return getTestOgImageMeta(character, testId).image
}

export function getOgImagePath(_pathname?: string): string {
  return withAssetVersion(DEFAULT_OG_IMAGE)
}
