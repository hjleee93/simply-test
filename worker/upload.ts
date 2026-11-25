import { createClient } from '@supabase/supabase-js'
import {
  extensionForImage,
  imageObjectKey,
  isAdminImageKind,
  publicImageUrl,
  type AdminImageKind,
} from '../src/lib/imageUpload'

interface ImageUploadEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  ADMIN_EMAILS?: string
  IMAGES: {
    put(
      key: string,
      value: ReadableStream | ArrayBuffer | string,
      options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
    ): Promise<unknown>
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function allowedEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

async function requireAdmin(request: Request, env: ImageUploadEnv): Promise<Response | null> {
  const header = request.headers.get('Authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
  if (!token) return json({ error: '다시 로그인해 주세요.' }, 401)

  const allowlist = allowedEmails(env.ADMIN_EMAILS)
  if (allowlist.size === 0) {
    return json({ error: 'ADMIN_EMAILS 가 설정되지 않았어요.' }, 500)
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase.auth.getUser(token)
  const email = data.user?.email?.trim().toLowerCase()
  if (error || !email || !allowlist.has(email)) {
    return json({ error: '허용되지 않은 계정이에요.' }, 403)
  }
  return null
}

export async function handleImageUpload(request: Request, env: ImageUploadEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'POST만 받을 수 있어요.' }, 405)

  const denied = await requireAdmin(request, env)
  if (denied) return denied

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ error: '파일을 읽지 못했어요.' }, 400)
  }

  const file = form.get('file')
  const kind = form.get('kind')
  const testId = form.get('testId')
  if (!(file instanceof File) || typeof testId !== 'string' || !isAdminImageKind(kind)) {
    return json({ error: '파일과 테스트 id가 필요해요.' }, 400)
  }

  let key: string
  try {
    const extension = extensionForImage(file.type, file.size)
    key = imageObjectKey(testId, kind as AdminImageKind, extension)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : '올릴 수 없는 파일이에요.' }, 400)
  }

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
  })

  return json({ url: publicImageUrl(key) })
}
