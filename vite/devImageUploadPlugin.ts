import { spawn } from 'node:child_process'
import fs from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { Readable } from 'node:stream'
import { createClient } from '@supabase/supabase-js'
import { loadEnv, type Plugin } from 'vite'
import {
  extensionForImage,
  imageObjectKey,
  isAdminImageKind,
  publicImageUrl,
  type AdminImageKind,
} from '../src/lib/imageUpload.ts'

const R2_BUCKET = 'simply-test-assets'

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function toRequest(req: IncomingMessage): Request {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue
    headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  }
  const init: RequestInit & { duplex?: 'half' } = { method: req.method, headers }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = Readable.toWeb(req) as ReadableStream
    init.duplex = 'half'
  }
  return new Request(`http://${req.headers.host ?? '127.0.0.1'}${req.url}`, init)
}

function uploadConfig(mode: string) {
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const scriptsEnvPath = path.join(process.cwd(), 'scripts', '.env')
  const scriptsEnv = fs.existsSync(scriptsEnvPath) ? parseEnvFile(fs.readFileSync(scriptsEnvPath, 'utf8')) : {}
  const wrangler = readWranglerVars()
  const supabaseUrl =
    fileEnv.VITE_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    scriptsEnv.SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    wrangler.SUPABASE_URL ||
    ''
  const anonKey =
    fileEnv.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    wrangler.SUPABASE_ANON_KEY ||
    ''
  const emails =
    fileEnv.VITE_ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || process.env.ADMIN_EMAILS || ''
  return { supabaseUrl, anonKey, emails }
}

function parseEnvFile(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    result[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^["']|["']$/g, '')
  }
  return result
}

function readWranglerVars(): Record<string, string> {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'wrangler.jsonc'), 'utf8')
    const json = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    const parsed = JSON.parse(json) as { vars?: Record<string, string> }
    return parsed.vars ?? {}
  } catch {
    return {}
  }
}

function allowedEmails(raw: string | undefined): Set<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

function putRemoteObject(key: string, bytes: Buffer, contentType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      [
        '--yes',
        'wrangler@4',
        'r2',
        'object',
        'put',
        `${R2_BUCKET}/${key}`,
        '--pipe',
        '--content-type',
        contentType,
        '--cache-control',
        'public, max-age=31536000, immutable',
        '--remote',
        '--force',
      ],
      { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] },
    )
    let stderr = ''
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr.trim().slice(-500) || `이미지 업로드에 실패했어요. (${code})`))
    })
    if (!child.stdin) {
      reject(new Error('업로드 프로세스를 시작하지 못했어요.'))
      return
    }
    child.stdin.end(bytes)
  })
}

/** 로컬 관리자에서 고른 파일을 운영 R2(cdn.simply-test.co.kr)에 올린다. */
export function devImageUploadPlugin(): Plugin {
  return {
    name: 'dev-image-upload',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (pathname !== '/api/admin/uploads') {
          next()
          return
        }
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'POST만 받을 수 있어요.' })
          return
        }

        try {
          const config = uploadConfig(server.config.mode)
          const allowlist = allowedEmails(config.emails)
          if (!config.supabaseUrl || !config.anonKey) {
            sendJson(res, 500, { error: 'Supabase 설정이 필요해요.' })
            return
          }
          if (allowlist.size === 0) {
            sendJson(res, 500, { error: 'VITE_ADMIN_EMAILS 가 필요해요.' })
            return
          }

          const request = toRequest(req)
          const header = request.headers.get('Authorization') ?? ''
          const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
          if (!token) {
            sendJson(res, 401, { error: '다시 로그인해 주세요.' })
            return
          }

          const supabase = createClient(config.supabaseUrl, config.anonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
          const { data, error } = await supabase.auth.getUser(token)
          const email = data.user?.email?.trim().toLowerCase()
          if (error || !email || !allowlist.has(email)) {
            sendJson(res, 403, { error: '허용되지 않은 계정이에요.' })
            return
          }

          const form = await request.formData()
          const file = form.get('file')
          const kind = form.get('kind')
          const testId = form.get('testId')
          if (!(file instanceof File) || typeof testId !== 'string' || !isAdminImageKind(kind)) {
            sendJson(res, 400, { error: '파일과 테스트 id가 필요해요.' })
            return
          }

          const extension = extensionForImage(file.type, file.size)
          const key = imageObjectKey(testId, kind as AdminImageKind, extension)
          await putRemoteObject(key, Buffer.from(await file.arrayBuffer()), file.type)

          sendJson(res, 200, { url: publicImageUrl(key) })
        } catch (error) {
          const message = error instanceof Error ? error.message : '이미지를 올리지 못했어요.'
          sendJson(res, 400, { error: message })
        }
      })
    },
  }
}
