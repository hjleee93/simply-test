import { readDrawingImage } from '../src/server/readDrawing'

interface DrawingEnv {
  GEMINI_API_KEY?: string
  GEMINI_MODEL?: string
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export async function handleDrawingRead(request: Request, env: DrawingEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'POST만 받을 수 있어요.' }, 405)

  let image: unknown
  try {
    const body = (await request.json()) as { image?: unknown }
    image = body.image
  } catch {
    return json({ error: '그림을 읽지 못했어요.' }, 400)
  }

  const result = await readDrawingImage(image, {
    apiKey: env.GEMINI_API_KEY ?? '',
    model: env.GEMINI_MODEL,
  })
  if (!result.ok) return json({ error: result.error }, result.status)
  return json(result.body)
}
