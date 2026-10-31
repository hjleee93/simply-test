import { useEffect, useState, type RefObject } from 'react'
import { cn } from '../lib/cn'
import { DownloadIcon, LinkIcon, ShareIcon } from './icons'
import {
  buildResultFilename,
  captureElementAsPng,
  copyLink,
  downloadImage,
  needsManualImageSave,
  shareImage,
  shareLink,
} from '../lib/shareResult'
import { trackShare } from '../lib/analytics'
import { ui } from '../lib/ui'

interface ResultShareActionsProps {
  shareRef: RefObject<HTMLDivElement | null>
  thresholdPercent: number
  resultTitle: string
  shareText: string
  shareTitle?: string
  testId: string
  resultId?: string
}

export default function ResultShareActions({
  shareRef,
  thresholdPercent,
  resultTitle,
  shareText,
  shareTitle = '테스트 결과',
  testId,
  resultId,
}: ResultShareActionsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const capture = async () => {
    if (!shareRef.current) return null
    return captureElementAsPng(shareRef.current)
  }

  const openPreview = (blob: Blob) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(blob)
    })
    setPreviewBlob(blob)
  }

  const closePreview = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setPreviewBlob(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const blob = await capture()
      if (!blob) return

      const filename = buildResultFilename(thresholdPercent, resultTitle)

      if (needsManualImageSave()) {
        openPreview(blob)
        setMessage('이미지를 길게 눌러 앨범에 저장하세요')
        trackShare('download', testId, resultId)
        return
      }

      downloadImage(blob, filename)
      trackShare('download', testId, resultId)
      setMessage('저장 완료! 갤러리에서 확인해보세요')
    } catch {
      setMessage('앗, 저장이 안 됐어요. 다시 눌러주세요')
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
        title: shareTitle,
        text: shareText,
      })

      if (shared) {
        trackShare('web_share', testId, resultId)
      } else {
        if (needsManualImageSave()) {
          openPreview(blob)
          setMessage('이미지를 길게 눌러 저장하거나, 아래 공유를 눌러주세요')
          return
        }

        downloadImage(blob, filename)
        trackShare('download', testId, resultId)
        setMessage('공유가 안 돼서 저장해드렸어요!')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('공유 실패… 저장 버튼 써주세요')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    const shared = await shareLink({
      title: shareTitle,
      text: shareText,
      url,
    })

    if (shared) {
      trackShare('web_share', testId, resultId)
      return
    }

    const copied = await copyLink(url)
    if (copied) {
      trackShare('link_copy', testId, resultId)
      setMessage('링크가 복사되었어요!')
    } else {
      setMessage('복사 실패… 주소창에서 복사해 주세요')
    }
  }

  const handlePreviewShare = async () => {
    if (!previewBlob) return

    try {
      const filename = buildResultFilename(thresholdPercent, resultTitle)
      const shared = await shareImage(previewBlob, filename, {
        title: shareTitle,
        text: shareText,
      })
      if (shared) {
        trackShare('web_share', testId, resultId)
      } else {
        setMessage('이 브라우저에서는 길게 눌러 저장해야 해요')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage('공유 실패… 이미지를 길게 눌러 저장해 주세요')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          className={cn(ui.btnPrimary, 'wiggle-hover px-2 text-sm')}
          onClick={handleShare}
          disabled={isSaving}
        >
          {isSaving ? (
            '만드는 중…'
          ) : (
            <>
              <ShareIcon className="h-[18px] w-[18px]" />
              자랑하기
            </>
          )}
        </button>
        <button
          type="button"
          className={cn(ui.btnSecondary, 'px-2 text-sm')}
          onClick={handleCopyLink}
          disabled={isSaving}
        >
          <LinkIcon className="h-[18px] w-[18px]" />
          링크
        </button>
        <button
          type="button"
          className={cn(ui.btnSecondary, 'px-2 text-sm')}
          onClick={handleSave}
          disabled={isSaving}
        >
          <DownloadIcon className="h-[18px] w-[18px]" />
          저장
        </button>
      </div>
      {message ? <p className="text-center text-sm font-semibold text-muted">{message}</p> : null}

      {previewUrl ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/80 p-4">
          <div className="mx-auto flex h-full w-full max-w-[480px] flex-col gap-3">
            <p className="pt-2 text-center text-sm font-bold text-white">
              이미지를 길게 눌러 앨범에 저장하세요
            </p>
            <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-cream">
              <img src={previewUrl} alt="테스트 결과" className="mx-auto w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2 pb-[env(safe-area-inset-bottom)]">
              <button type="button" className={ui.btnPrimary} onClick={handlePreviewShare}>
                공유해서 저장
              </button>
              <button type="button" className={ui.btnSecondary} onClick={closePreview}>
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
