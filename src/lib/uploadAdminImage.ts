import { getAdminSession } from './adminAuth'
import { IMAGE_UPLOAD_PATH, type AdminImageKind } from './imageUpload'

export async function uploadAdminImage(
  file: File,
  kind: AdminImageKind,
  testId: string,
): Promise<string> {
  const session = await getAdminSession()
  if (!session) throw new Error('다시 로그인해 주세요.')

  const body = new FormData()
  body.set('file', file)
  body.set('kind', kind)
  body.set('testId', testId.trim())

  const response = await fetch(IMAGE_UPLOAD_PATH, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
    body,
  })

  const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null
  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || '이미지를 올리지 못했어요.')
  }
  return payload.url
}
