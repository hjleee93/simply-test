import {
  interpretDrawing,
  normalizeElements,
  type DrawingReadResult,
} from '../lib/drawingReading.ts'

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash'

const MAX_IMAGE_CHARS = 4_000_000

const PROMPT = `너는 손그림을 묘사하는 관찰자다. 심리, 성격, 감정을 판단하지 마라.
실제로 보이는 요소만 골라라. 애매하면 넣지 마라.
id는 house(집), tree(나무), person(사람), path(길·도로), sun(해), flower(꽃), animal(동물), door(문), window(창문)만 쓴다.
size는 그림 전체 대비 small, medium, large.
place는 left, center, right, top, bottom, spread.
detail은 보이는 특징을 한국어 한 문장으로 쓰고, 감정 단어는 넣지 마라. 없으면 빈 문자열.
선이 거의 없으면 blank를 true로 하고 elements는 빈 배열로 둔다.
JSON만 반환한다.
{"blank":false,"elements":[{"id":"house","size":"medium","place":"center","detail":"세모 지붕과 네모 몸통이 있다"}]}`

type GeminiResponse = {
  candidates?: Array<{
    finishReason?: string
    content?: { parts?: Array<{ text?: string; thought?: boolean }> }
  }>
  error?: { message?: string }
  promptFeedback?: { blockReason?: string }
}

export type DrawingReadFailure = { ok: false; status: number; error: string }
export type DrawingReadSuccess = { ok: true; body: DrawingReadResult }

function fail(status: number, error: string): DrawingReadFailure {
  return { ok: false, status, error }
}

function parseImage(image: unknown): { mimeType: string; data: string } | DrawingReadFailure {
  if (typeof image !== 'string' || image.length > MAX_IMAGE_CHARS) {
    return fail(400, '그림 파일이 너무 크거나 비어 있어요.')
  }
  const match = image.match(/^data:(image\/(?:png|jpeg));base64,([A-Za-z0-9+/=]+)$/)
  if (!match) return fail(400, 'PNG 그림만 읽을 수 있어요.')
  return { mimeType: match[1], data: match[2] }
}

function modelText(payload: GeminiResponse): string {
  const parts = payload.candidates?.[0]?.content?.parts ?? []
  const visible = parts
    .filter((part) => !part.thought)
    .map((part) => part.text ?? '')
    .join('')
    .trim()
  if (visible) return visible
  return parts.map((part) => part.text ?? '').join('').trim()
}

function parseModelJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return JSON.parse(fenced?.[1]?.trim() ?? text)
}

async function askGemini(
  mimeType: string,
  data: string,
  apiKey: string,
  model: string,
  maxOutputTokens: number,
  disableThinking: boolean,
  doFetch: (url: string, init?: RequestInit) => Promise<Response>,
): Promise<Response> {
  const generationConfig: Record<string, unknown> = {
    temperature: 0.2,
    maxOutputTokens,
    responseMimeType: 'application/json',
  }
  if (disableThinking) generationConfig.thinkingConfig = { thinkingBudget: 0 }

  return doFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      signal: AbortSignal.timeout(50_000),
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: PROMPT },
              { inlineData: { mimeType, data } },
            ],
          },
        ],
        generationConfig,
      }),
    },
  )
}

function geminiFailure(status: number, payload: GeminiResponse, model: string): DrawingReadFailure {
  const message = payload.error?.message ?? ''
  if (status === 404) {
    return fail(502, `모델 ${model} 을 찾지 못했어요. .env 의 GEMINI_MODEL 을 바꿔 보세요.`)
  }
  if (status === 429) {
    return fail(429, '오늘 Gemini 무료 한도에 걸렸어요. 잠시 뒤 다시 시도해 주세요.')
  }
  if (status === 400 && /api key|API_KEY/i.test(message)) {
    return fail(401, 'Gemini API 키가 거절됐어요. .env 의 GEMINI_API_KEY 를 확인해 주세요.')
  }
  return fail(502, message.slice(0, 240) || '그림을 읽지 못했어요.')
}

async function loadGemini(
  mimeType: string,
  data: string,
  apiKey: string,
  model: string,
  disableThinking: boolean,
  maxOutputTokens: number,
  doFetch: (url: string, init?: RequestInit) => Promise<Response>,
): Promise<{ ok: true; response: Response; payload: GeminiResponse } | DrawingReadFailure> {
  let response: Response
  try {
    response = await askGemini(mimeType, data, apiKey, model, maxOutputTokens, disableThinking, doFetch)
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')
    if (timedOut) return fail(504, 'Gemini 응답이 시간 안에 오지 않았어요. 한 번 더 눌러 주세요.')
    return fail(502, 'Gemini에 연결하지 못했어요. 잠시 뒤 다시 시도해 주세요.')
  }

  try {
    const payload = (await response.json()) as GeminiResponse
    return { ok: true, response, payload }
  } catch {
    return fail(502, 'Gemini 응답을 읽지 못했어요.')
  }
}

export async function readDrawingImage(
  image: unknown,
  options: { apiKey: string; model?: string; fetchImpl?: (url: string, init?: RequestInit) => Promise<Response> },
): Promise<DrawingReadSuccess | DrawingReadFailure> {
  const apiKey = options.apiKey.trim()
  if (!apiKey) {
    return fail(500, 'GEMINI_API_KEY 가 없어요. 프로젝트 .env 에 넣고 개발 서버를 다시 시작해 주세요.')
  }

  const parsed = parseImage(image)
  if ('ok' in parsed) return parsed

  const model = options.model?.trim() || DEFAULT_GEMINI_MODEL
  const doFetch = options.fetchImpl ?? fetch
  const loaded = await loadGemini(parsed.mimeType, parsed.data, apiKey, model, true, 1024, doFetch)
  if (!loaded.ok) return loaded

  let payload = loaded.payload
  const thinkingRejected =
    loaded.response.status === 400 && /thinking/i.test(payload.error?.message ?? '')
  const truncated = loaded.response.ok && payload.candidates?.[0]?.finishReason === 'MAX_TOKENS'
  if (thinkingRejected || truncated) {
    const retry = await loadGemini(
      parsed.mimeType,
      parsed.data,
      apiKey,
      model,
      !thinkingRejected,
      4096,
      doFetch,
    )
    if (!retry.ok) return retry
    payload = retry.payload
    if (!retry.response.ok) return geminiFailure(retry.response.status, payload, model)
  } else if (!loaded.response.ok) {
    return geminiFailure(loaded.response.status, payload, model)
  }

  if (payload.promptFeedback?.blockReason) {
    return fail(422, '이 그림은 읽기 요청이 거절됐어요. 다른 그림으로 시도해 주세요.')
  }

  const text = modelText(payload)
  if (!text) return fail(502, 'Gemini가 빈 응답을 돌려줬어요.')

  let raw: unknown
  try {
    raw = parseModelJson(text)
  } catch {
    return fail(502, '그림 관찰 결과를 해석하지 못했어요.')
  }

  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const elements = normalizeElements(record.elements)
  const blank = elements.length === 0
  return {
    ok: true,
    body: {
      model,
      blank,
      elements,
      lines: interpretDrawing(elements),
    },
  }
}
