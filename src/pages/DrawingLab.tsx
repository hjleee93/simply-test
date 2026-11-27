import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import PageLayout from '../components/PageLayout'
import PageMeta from '../components/PageMeta'
import {
  elementLabel,
  placeLabel,
  type DrawingReadResult,
} from '../lib/drawingReading'
import { ui } from '../lib/ui'

type Tool = 'pen' | 'eraser'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 560

function pointFromEvent(event: ReactPointerEvent<HTMLCanvasElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  }
}

function hasInk(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return false
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let dark = 0
  for (let index = 0; index < data.length; index += 16) {
    if (data[index] < 245 || data[index + 1] < 245 || data[index + 2] < 245) dark += 1
    if (dark > 24) return true
  }
  return false
}

export default function DrawingLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastRef = useRef({ x: 0, y: 0 })
  const undoRef = useRef<ImageData[]>([])
  const [tool, setTool] = useState<Tool>('pen')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<DrawingReadResult | null>(null)

  function context() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !ctx) return null
    return ctx
  }

  const prepareCanvas = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return
    canvasRef.current = node
    if (node.dataset.ready === '1') return
    const ctx = node.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    node.dataset.ready = '1'
  }, [])

  function remember() {
    const canvas = canvasRef.current
    const ctx = context()
    if (!canvas || !ctx) return
    const stack = undoRef.current
    stack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    if (stack.length > 8) stack.shift()
  }

  function style(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : '#1f1535'
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = tool === 'eraser' ? 36 : 14
  }

  function onPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    const ctx = context()
    if (!ctx) return
    event.currentTarget.setPointerCapture(event.pointerId)
    remember()
    setResult(null)
    setError('')
    drawingRef.current = true
    const point = pointFromEvent(event)
    lastRef.current = point
    style(ctx)
    ctx.beginPath()
    ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  function onPointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const ctx = context()
    if (!ctx || !drawingRef.current) return
    const point = pointFromEvent(event)
    const last = lastRef.current
    style(ctx)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastRef.current = point
  }

  function onPointerUp() {
    drawingRef.current = false
  }

  function undo() {
    const ctx = context()
    const snapshot = undoRef.current.pop()
    if (!ctx || !snapshot) return
    ctx.putImageData(snapshot, 0, 0)
    setResult(null)
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    const ctx = context()
    if (!canvas || !ctx) return
    remember()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setResult(null)
    setError('')
  }

  async function readDrawing() {
    const canvas = canvasRef.current
    if (!canvas || busy) return
    if (!hasInk(canvas)) {
      setError('선을 조금 더 그려 주세요.')
      setResult(null)
      return
    }

    setBusy(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/drawing/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: canvas.toDataURL('image/png') }),
      })
      const body = (await response.json()) as DrawingReadResult & { error?: string }
      if (!response.ok) {
        setError(body.error || '그림을 읽지 못했어요.')
        return
      }
      setResult(body)
    } catch {
      setError('서버에 연결하지 못했어요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageLayout backTo="/" backLabel="홈">
      <PageMeta
        title="그림 읽기 실험 | 심플리테스트"
        description="그린 그림에서 집, 나무, 사람 같은 요소를 찾아보는 실험 화면"
        noindex
      />
      <p className="text-[13px] font-bold text-muted">실험</p>
      <h1 className={`mt-1 ${ui.pageTitle}`}>집, 나무, 사람을 그려 보세요</h1>
      <p className={`mt-2 ${ui.pageDesc}`}>
        떠오르는 대로 그려도 돼요. 그림에서 보이는 요소만 찾고, 그 다음 문장은 미리 정한 규칙으로 만들어요.
      </p>

      <div className="mt-5 overflow-hidden rounded-md border border-ink/15 bg-white">
        <canvas
          ref={prepareCanvas}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          aria-label="그림판"
          className="block aspect-[900/560] w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ['pen', '펜'],
            ['eraser', '지우개'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`inline-flex h-10 items-center rounded-md px-3 text-sm font-bold ${
              tool === id ? 'border border-ink/15 bg-white text-ink' : 'text-muted'
            }`}
            onClick={() => setTool(id)}
          >
            {label}
          </button>
        ))}
        <button type="button" className={ui.btnGhost} onClick={undo}>
          되돌리기
        </button>
        <button type="button" className={ui.btnGhost} onClick={clearCanvas}>
          지우기
        </button>
      </div>

      <button
        type="button"
        className={`mt-4 ${ui.btnPrimary} disabled:cursor-wait disabled:opacity-60`}
        disabled={busy}
        onClick={readDrawing}
      >
        {busy ? '읽고 있어요' : '그림 읽어보기'}
      </button>

      {error ? <p className="mt-4 text-[15px] font-bold text-accent">{error}</p> : null}

      {result ? (
        <div className="mt-6 flex flex-col gap-3">
          <section className={ui.sticker}>
            <h2 className={ui.sectionTitle}>그림에서 찾은 것</h2>
            {result.elements.length === 0 ? (
              <p className="text-[15px] text-ink">특정할 수 있는 요소가 없었어요.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {result.elements.map((element) => (
                  <li key={element.id} className="text-[15px] leading-relaxed text-ink">
                    <span className="font-bold">{elementLabel(element.id)}</span>
                    <span className="text-muted">
                      {' '}
                      · {element.size === 'small' ? '작게' : element.size === 'large' ? '크게' : '중간'}
                      {placeLabel(element.place) ? ` · ${placeLabel(element.place)}` : ''}
                    </span>
                    {element.detail ? <span className="mt-0.5 block text-muted">{element.detail}</span> : null}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[12px] text-muted">모델 {result.model}</p>
          </section>

          {result.lines.map((line) => (
            <section key={`${line.title}-${line.question}`} className={ui.sticker}>
              <h2 className="text-[15px] font-bold text-ink">{line.observation}</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">{line.question}</p>
            </section>
          ))}
        </div>
      ) : null}
    </PageLayout>
  )
}
