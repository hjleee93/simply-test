/** 테스트별 전용 OG/트위터 공유 이미지 메타 (인트로·썸네일 character와 분리) */
export type TestOgImageMeta = {
  image: string
  width?: number
  height?: number
  alt?: string
}

/**
 * 테스트 id → 전용 공유 이미지.
 * 여기에 없는 테스트는 thumbnailCharacter/character 기반으로 폴백하며,
 * 기존 OG 출력은 바꾸지 않는다.
 */
export const TEST_OG_IMAGES: Record<string, TestOgImageMeta> = {
  'kkondae-test': {
    image: 'https://cdn.simply-test.co.kr/characters/pixel/kkondae/og_1200x630.jpg',
    width: 1200,
    height: 630,
    alt: '내가 꼰대일 가능성 테스트',
  },
}
