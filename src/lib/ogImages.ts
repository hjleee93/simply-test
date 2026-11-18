import { resolveCharacterImage } from './characters'
import { TEST_OG_IMAGES, type TestOgImageMeta } from './testOgOverrides'

export type { TestOgImageMeta }
export { TEST_OG_IMAGES }

/** 홈·목록 등 정적 페이지 기본 공유 이미지 (메인 히어로) */
export const DEFAULT_OG_IMAGE = '/characters/pixel/main_hero.png'

/** getTestOgImageMeta 입력 — DB og_* 가 있으면 최우선 */
export type TestOgImageSource = {
  character?: string | null
  testId?: string
  title?: string | null
  ogImage?: string | null
  ogImageWidth?: number | null
  ogImageHeight?: number | null
}

/**
 * 테스트 OG/트위터 이미지 해석 우선순위:
 * 1) Supabase tests.og_image (+ width/height)
 * 2) src/lib/testOgOverrides.ts 코드 오버라이드
 * 3) thumbnail/character → resolveCharacterImage
 *
 * alt 는 테스트 title 을 쓴다 (전용 OG일 때 og:image:alt / twitter:image:alt).
 */
export function getTestOgImageMeta(source: TestOgImageSource): TestOgImageMeta {
  const alt = source.title?.trim() || undefined
  const dbImage = source.ogImage?.trim()

  if (dbImage) {
    return {
      image: dbImage,
      width: source.ogImageWidth ?? undefined,
      height: source.ogImageHeight ?? undefined,
      alt,
    }
  }

  if (source.testId) {
    const override = TEST_OG_IMAGES[source.testId]
    if (override) {
      return {
        ...override,
        alt: alt ?? override.alt,
      }
    }
  }

  return {
    image: resolveCharacterImage(source.character?.trim() || 'adapted'),
    alt,
  }
}

/** @deprecated 객체 인자 getTestOgImageMeta 사용 권장 */
export function getTestOgImage(character: string | undefined, testId?: string): string {
  return getTestOgImageMeta({ character, testId }).image
}

export function getOgImagePath(_pathname?: string): string {
  return DEFAULT_OG_IMAGE
}
