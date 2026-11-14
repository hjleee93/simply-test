/**
 * 캐릭터/CDN 이미지 캐시 버스팅.
 *
 * Cloudflare·브라우저가 `Cache-Control: immutable` 로 파일명을 영구 캐시하므로,
 * 같은 경로에 이미지를 덮어쓸 때 `?v=` 를 올려야 즉시 갱신된다.
 *
 * 버전 올리는 법:
 * 1) 특정 폴더만: ASSET_VERSIONS 에 폴더명(예: kkondae) 또는 테스트 id 키를 넣고 값을 올린다.
 * 2) 전체: GLOBAL_ASSET_VERSION 값을 올린다 (폴더/테스트 키가 없을 때 폴백).
 */

/** 전역 폴백 버전. 빈 문자열이면 폴더/테스트 키가 없는 URL에는 ?v= 를 붙이지 않는다. */
export const GLOBAL_ASSET_VERSION = ''

/**
 * 폴더명 또는 테스트 id → 버전 문자열.
 * 예: kkondae 이미지를 교체했다면 `kkondae: '20261114b'` 처럼 값만 바꾼다.
 */
export const ASSET_VERSIONS: Record<string, string> = {
  kkondae: '20261114',
}

const CDN_CHARACTER_BASE = 'https://cdn.simply-test.co.kr/characters/'

/** URL/경로/캐릭터 id 에서 버전 맵 키(폴더명)를 추출한다. */
export function getAssetFolderKey(urlOrPath: string): string | null {
  const path = urlOrPath.split(/[?#]/)[0] ?? ''
  if (!path) return null

  let relative: string | null = null

  if (path.startsWith(CDN_CHARACTER_BASE)) {
    relative = path.slice(CDN_CHARACTER_BASE.length)
  } else if (path.startsWith('/characters/')) {
    relative = path.slice('/characters/'.length)
  } else if (!path.startsWith('/') && !/^https?:\/\//i.test(path)) {
    // 캐릭터 id: 'kkondae/main' | 'steel'
    const idParts = path.replace(/\.(png|webp|jpe?g|gif)$/i, '').split('/').filter(Boolean)
    return idParts[0] ?? null
  } else {
    return null
  }

  const parts = relative
    .replace(/\.(png|webp|jpe?g|gif)$/i, '')
    .split('/')
    .filter(Boolean)
  if (parts.length === 0) return null

  // /characters/pixel/kkondae/... → kkondae
  // /characters/pixel/steel.png → steel
  if (parts[0] === 'pixel') {
    return parts[1] ?? 'pixel'
  }
  // /characters/halloween-villains/... → halloween-villains
  return parts[0] ?? null
}

export function getAssetVersion(urlOrPath: string, testId?: string): string | null {
  if (testId && ASSET_VERSIONS[testId]) return ASSET_VERSIONS[testId] ?? null
  const folder = getAssetFolderKey(urlOrPath)
  if (folder && ASSET_VERSIONS[folder]) return ASSET_VERSIONS[folder] ?? null
  if (GLOBAL_ASSET_VERSION) return GLOBAL_ASSET_VERSION
  return null
}

/** 캐릭터/CDN 이미지 URL에 ?v=<version> 을 붙인다. 버전이 없으면 그대로 반환. */
export function withAssetVersion(url: string, testId?: string): string {
  if (!url) return url
  const version = getAssetVersion(url, testId)
  if (!version) return url

  const hashIndex = url.indexOf('#')
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const qIndex = withoutHash.indexOf('?')
  const base = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash
  const existing = qIndex >= 0 ? withoutHash.slice(qIndex + 1) : ''
  const params = new URLSearchParams(existing)
  params.set('v', version)
  const qs = params.toString()
  return `${base}?${qs}${hash}`
}
