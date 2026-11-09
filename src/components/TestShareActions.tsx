import { useState } from 'react'
import { cn } from '../lib/cn'
import { copyLink, shareLink } from '../lib/shareResult'
import { isKakaoShareEnabled, shareToKakao } from '../lib/kakaoShare'
import { trackShare } from '../lib/analytics'
import { KakaoIcon, ShareIcon } from './icons'
import { ui } from '../lib/ui'

interface TestShareActionsProps {
  testId: string
  title: string
  description: string
}

export default function TestShareActions({ testId, title, description }: TestShareActionsProps) {
  const [message, setMessage] = useState<string | null>(null)
  const kakaoEnabled = isKakaoShareEnabled()

  const handleShare = async () => {
    setMessage(null)
    const url = window.location.href
    const shared = await shareLink({ title, text: description, url })

    if (shared) {
      trackShare('web_share', testId)
      return
    }

    const copied = await copyLink(url)
    if (copied) {
      trackShare('link_copy', testId)
      setMessage('링크가 복사되었어요!')
    } else {
      setMessage('복사 실패… 주소창에서 복사해 주세요')
    }
  }

  const handleKakaoShare = async () => {
    setMessage(null)
    try {
      const imageUrl =
        document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? ''
      const shared = await shareToKakao({ title, description, imageUrl, url: window.location.href })

      if (shared) {
        trackShare('kakao', testId)
      } else {
        setMessage('카카오톡 공유를 사용할 수 없어요')
      }
    } catch {
      setMessage('카카오톡 공유 실패… 다시 눌러주세요')
    }
  }

  return (
    <div className="mb-5 flex flex-col gap-2">
      <div className={cn('grid gap-2', kakaoEnabled ? 'grid-cols-2' : 'grid-cols-1')}>
        <button type="button" className={cn(ui.btnSecondary, 'px-2 text-sm')} onClick={handleShare}>
          <ShareIcon className="h-[18px] w-[18px]" />
          공유하기
        </button>
        {kakaoEnabled ? (
          <button
            type="button"
            className="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-[#FEE500] px-2 text-sm font-bold text-[#391b1b] shadow-[0_2px_12px_-4px_rgba(31,21,53,0.16)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleKakaoShare}
          >
            <KakaoIcon className="h-[18px] w-[18px]" />
            카톡으로 공유
          </button>
        ) : null}
      </div>
      {message ? <p className="text-center text-sm font-semibold text-muted">{message}</p> : null}
    </div>
  )
}
