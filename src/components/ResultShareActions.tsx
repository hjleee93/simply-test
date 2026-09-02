import { useState, type RefObject } from 'react'
import { cn } from '../lib/cn'
import {
  buildResultFilename,
  captureElementAsPng,
  downloadImage,
  shareImage,
} from '../lib/shareResult'
import { ui } from '../lib/ui'

interface ResultShareActionsProps {
  shareRef: RefObject<HTMLDivElement | null>
  thresholdPercent: number
  resultTitle: string
  shareText: string
}

export default function ResultShareActions({
  shareRef,
  thresholdPercent,
  resultTitle,
  shareText,
}: ResultShareActionsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const capture = async () => {
    if (!shareRef.current) return null
    return captureElementAsPng(shareRef.current)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const blob = await capture()
      if (!blob) return

      const filename = buildResultFilename(thresholdPercent, resultTitle)
      downloadImage(blob, filename)
      setMessage('저장 완료! 갤러리에서 확인해보세요 📸')
    } catch {
      setMessage('앗, 저장이 안 됐어요. 다시 눌러주세요 🥲')
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const blob = await capture()
      if (!blob) return

      const filename = buildResultFilename(thresholdPercent, resultTitle)
      const shared = await shareImage(blob, filename, {
        title: '나의 퇴사 임계점 테스트 결과',
        text: shareText,
      })

      if (!shared) {
        downloadImage(blob, filename)
        setMessage('공유가 안 돼서 저장해드렸어요!')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('공유 실패… 저장 버튼 써주세요 🙏')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={cn(ui.btnPrimary, 'wiggle-hover px-2 text-sm')}
          onClick={handleShare}
          disabled={isSaving}
        >
          {isSaving ? '만드는 중…' : '자랑하기 📤'}
        </button>
        <button
          type="button"
          className={cn(ui.btnSecondary, 'px-2 text-sm')}
          onClick={handleSave}
          disabled={isSaving}
        >
          저장 📷
        </button>
      </div>
      {message ? <p className="text-center text-sm font-semibold text-muted">{message}</p> : null}
    </div>
  )
}
