import fs from 'node:fs'
import https from 'node:https'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { Readable } from 'node:stream'
import { loadEnv, type Plugin } from 'vite'
import { readDrawingImage } from '../src/server/readDrawing.ts'

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
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

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}
  const result: Record<string, string> = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    result[trimmed.slice(0, index)] = trimmed.slice(index + 1).replace(/^["']|["']$/g, '')
  }
  return result
}

/** 개발 서버의 기본 연결 재사용이 Gemini 요청을 멈추게 해서, 호출마다 새 연결을 연다. */
function directFetch(url: string, init?: RequestInit): Promise<Response> {
  const agent = new https.Agent({ keepAlive: false })
  return new Promise((resolve, reject) => {
    const close = () => agent.destroy()
    const req = https.request(
      url,
      {
        method: init?.method ?? 'GET',
        headers: init?.headers as https.RequestOptions['headers'],
        agent,
        timeout: 45_000,
      },
      (incoming) => {
        const chunks: Buffer[] = []
        incoming.on('data', (chunk: Buffer) => chunks.push(chunk))
        incoming.on('end', () => {
          close()
          resolve(
            new Response(Buffer.concat(chunks), {
              status: incoming.statusCode ?? 500,
              headers: {
                'content-type': String(incoming.headers['content-type'] ?? 'application/json'),
              },
            }),
          )
        })
      },
    )
    req.on('error', (error) => {
      close()
      reject(error)
    })
    req.on('timeout', () => req.destroy(new Error('timeout')))
    if (init?.signal) {
      const abort = () => req.destroy(new Error('aborted'))
      if (init.signal.aborted) abort()
      else init.signal.addEventListener('abort', abort, { once: true })
    }
    if (typeof init?.body === 'string') {
      req.setHeader('Content-Length', Buffer.byteLength(init.body))
      req.write(init.body)
    }
    req.end()
  })
}

/** 로컬에서만 Gemini 키를 서버에 두고 /api/drawing/read 를 연다. */
export function devDrawingPlugin(): Plugin {
  return {
    name: 'dev-drawing-read',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]
        if (pathname !== '/api/drawing/read') {
          next()
          return
        }
        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'POST만 받을 수 있어요.' })
          return
        }

        try {
          const env = loadEnv(server.config.mode, process.cwd(), '')
          const scriptsEnv = readEnvFile(path.join(process.cwd(), 'scripts', '.env'))
          const request = toRequest(req)
          const body = (await request.json()) as { image?: unknown }
          const apiKey = env.GEMINI_API_KEY || scriptsEnv.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
          const result = await readDrawingImage(body.image, {
            apiKey,
            model: env.GEMINI_MODEL || scriptsEnv.GEMINI_MODEL || process.env.GEMINI_MODEL,
            fetchImpl: directFetch,
          })
          if (!result.ok) {
            sendJson(res, result.status, { error: result.error })
            return
          }
          sendJson(res, 200, result.body)
        } catch (error) {
          const message = error instanceof Error ? error.message : '그림을 읽지 못했어요.'
          sendJson(res, 400, { error: message })
        }
      })
    },
  }
}
