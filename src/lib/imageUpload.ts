export const IMAGE_UPLOAD_PATH = '/api/admin/uploads'
export const IMAGE_CDN_BASE = 'https://cdn.simply-test.co.kr'
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

export type AdminImageKind = 'thumbnail' | 'og'

export function extensionForImage(type: string, size: number): string {
  if (size <= 0) throw new Error('파일이 비어 있어요.')
  if (size > MAX_IMAGE_BYTES) throw new Error('이미지는 8MB 이하만 올릴 수 있어요.')
  const extension = IMAGE_EXTENSIONS[type]
  if (!extension) throw new Error('PNG, JPG, WEBP만 올릴 수 있어요.')
  return extension
}

export function imageObjectKey(testId: string, kind: AdminImageKind, extension: string): string {
  const slug = testId.trim()
  if (!/^[a-z0-9][a-z0-9_-]{0,80}$/.test(slug)) {
    throw new Error('테스트 id는 영문 소문자, 숫자, 하이픈만 사용할 수 있어요.')
  }
  return `characters/${slug}/${kind}-${crypto.randomUUID()}.${extension}`
}

export function publicImageUrl(key: string): string {
  return `${IMAGE_CDN_BASE}/${key}`
}

export function isAdminImageKind(value: unknown): value is AdminImageKind {
  return value === 'thumbnail' || value === 'og'
}
