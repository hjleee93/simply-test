import { useRef } from 'react'
import { cn } from '../lib/cn'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { HomeIcon, LightbulbIcon, RefreshIcon } from './icons'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import Logo from './Logo'
import ResultShareActions from './ResultShareActions'

interface MemeResultCardProps {
  result: TestResult
  thresholdPercent: number
  answeredCount: number
  testTitle: string
  testId: string
  resultLabel: string
  onRetry: () => void
  onHome: () => void
}

export default function MemeResultCard({
  result,
  thresholdPercent,
  answeredCount,
  testTitle,
  testId,
  resultLabel,
  onRetry,
  onHome,
}: MemeResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const knownCount = Math.round((thresholdPercent / 100) * answeredCount)
  const shareText =
    result.shareText ??
    `${testTitle} ${answeredCount}문제 중 ${knownCount}문제 · ${result.title}`
  const imageSrc = result.characterImage
    ? resolveCharacterImage(result.characterImage)
    : null
  const imageWebp = result.characterImage
    ? resolveCharacterWebp(result.characterImage)
    : null

  return (
    <div>
      <div ref={shareRef} className="rounded-sm border-2 border-ink bg-[#f7f3ea] px-4 py-5">
        <p className="text-center text-sm font-bold text-[#5c564e]">당신의 결과는?</p>

        <div className="relative mx-auto mt-3 w-fit px-2">
          <p className="text-center text-[28px] font-black leading-none text-ink">
            {answeredCount}문제 중{' '}
            <span className="relative inline-block px-1">
              {knownCount}문제
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-x-1 -inset-y-2 rounded-[50%] border-[3px] border-[#e11d48]"
              />
            </span>
          </p>
        </div>

        <div className="mt-5 overflow-hidden border-2 border-ink bg-white">
          {imageSrc ? (
            <picture>
              {imageWebp ? <source srcSet={imageWebp} type="image/webp" /> : null}
              <img
                src={imageSrc}
                alt=""
                width={720}
                height={720}
                className="mx-auto block w-full max-w-[360px] object-contain"
              />
            </picture>
          ) : (
            <p className="py-10 text-center text-6xl" aria-hidden>
              {result.emoji}
            </p>
          )}

          <div className="border-t-2 border-ink bg-ink px-4 py-3 text-center">
            <p className="text-lg font-black text-white">{result.title}</p>
            <span className="mt-1 inline-block border border-white/40 bg-white px-2 py-0.5 text-xs font-bold text-ink">
              {result.keyword}
            </span>
          </div>

          <p className="whitespace-pre-line px-4 py-4 text-left text-[15px] leading-relaxed text-ink">
            {result.description}
          </p>
        </div>

        {result.advice ? (
          <div className="mt-4 border border-dashed border-ink/40 bg-white/70 px-4 py-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-extrabold text-ink">
              <LightbulbIcon className="h-3.5 w-3.5 text-[#e11d48]" />
              채점 코멘트
            </p>
            <p className="text-[15px] leading-relaxed text-ink">{result.advice}</p>
          </div>
        ) : null}

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs font-bold text-[#5c564e]">
          <Logo showText iconClassName="h-4 w-4" className="gap-1" />
          <span>· {testTitle}</span>
        </p>
      </div>

      <div className="mt-6">
        <ResultShareActions
          shareRef={shareRef}
          thresholdPercent={thresholdPercent}
          resultTitle={result.title}
          shareText={shareText}
          shareTitle={`${resultLabel} 결과`}
          testId={testId}
          resultId={result.id}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button type="button" className={cn(ui.btnPrimary, 'wiggle-hover !rounded-sm !bg-ink hover:!bg-[#333]')} onClick={onRetry}>
          <RefreshIcon className="h-[18px] w-[18px]" />
          다시 해보기
        </button>
        <button type="button" className={cn(ui.btnSecondary, '!rounded-sm')} onClick={onHome}>
          <HomeIcon className="h-[18px] w-[18px]" />
          홈으로
        </button>
      </div>
    </div>
  )
}
