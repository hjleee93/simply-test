import { useRef } from 'react'
import { cn } from '../lib/cn'
import { CheckIcon, HomeIcon, RefreshIcon } from './icons'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import Logo from './Logo'
import ResultCharacter from './ResultCharacter'
import ResultShareActions from './ResultShareActions'
import StickerCard from './StickerCard'

interface HalloweenResultCardProps {
  result: TestResult
  matchPercent: number
  testTitle: string
  resultLabel: string
  onRetry: () => void
  onHome: () => void
}

function SectionTitle({ emoji, children }: { emoji: string; children: string }) {
  return (
    <h3 className="mb-3 text-[15px] font-extrabold text-ink">
      {emoji} {children}
    </h3>
  )
}

export default function HalloweenResultCard({
  result,
  matchPercent,
  testTitle,
  resultLabel,
  onRetry,
  onHome,
}: HalloweenResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const shareText =
    result.shareText ?? `내 안의 영화 빌런은 ${result.title}! ${result.keyword}`

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        <ResultCharacter
          resultId={result.id}
          emoji={result.emoji}
          image={result.characterImage}
        />

        <section className="text-center">
          <p className="mb-1 text-sm font-bold text-[#7346a8]">
            {result.emoji} 당신의 {resultLabel}
          </p>
          <p className="text-[22px] font-extrabold leading-snug text-[#2a1450]">
            당신은 「{result.title}」 재질입니다.
          </p>
          <span className="mt-3 inline-block rounded-md border-2 border-[#2a1450] bg-[#ffb247] px-3 py-1 text-sm font-bold text-[#2a1450]">
            🎭 {result.keyword}
          </span>
          <p className="mt-2 text-xs font-bold text-[#7346a8]">
            빌런 일치도 {matchPercent}%
          </p>
        </section>

        <div className="my-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
          <span className="h-px w-8 bg-gray-200" />
          🎃 빌런 분석 리포트 🎃
          <span className="h-px w-8 bg-gray-200" />
        </div>

        <section className="mb-4">
          <SectionTitle emoji="🦹">내 안의 빌런 본성</SectionTitle>
          <StickerCard>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
              {result.description}
            </p>
          </StickerCard>
        </section>

        {result.strengths?.length ? (
          <section className="mb-4">
            <SectionTitle emoji="⚡">타고난 빌런력</SectionTitle>
            <StickerCard soft>
              <ul className="space-y-2">
                {result.strengths.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StickerCard>
          </section>
        ) : null}

        {result.blindSpots?.length ? (
          <section className="mb-4">
            <SectionTitle emoji="🚨">폭주 주의보</SectionTitle>
            <StickerCard>
              <ul className="space-y-2">
                {result.blindSpots.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink">
                    <span className="font-extrabold text-muted">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StickerCard>
          </section>
        ) : null}

        {result.situations?.length ? (
          <section className="mb-4">
            <SectionTitle emoji="🪄">찰떡 코스튬 포인트</SectionTitle>
            <StickerCard soft>
              <ul className="space-y-2">
                {result.situations.map((item) => (
                  <li key={item} className="text-[15px] leading-snug text-ink">
                    · {item}
                  </li>
                ))}
              </ul>
            </StickerCard>
          </section>
        ) : null}

        {result.advice ? (
          <section className="mb-4">
            <SectionTitle emoji="💬">오늘 밤의 빌런 대사</SectionTitle>
            <StickerCard className="text-center">
              <p className="text-[15px] font-extrabold leading-relaxed text-ink">
                “{result.advice}”
              </p>
            </StickerCard>
          </section>
        ) : null}

        {result.viralHint ? (
          <p className="mb-4 text-center text-[13px] leading-relaxed text-muted">
            {result.viralHint}
          </p>
        ) : null}

        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-muted">
          <Logo showText iconClassName="h-4 w-4" className="gap-1" />
          <span>· {testTitle}</span>
        </p>
      </div>

      <div className="mt-6">
        <ResultShareActions
          shareRef={shareRef}
          thresholdPercent={matchPercent}
          resultTitle={result.title}
          shareText={shareText}
          shareTitle={`${resultLabel} 테스트 결과`}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button
          type="button"
          className={cn(ui.btnPrimary, 'wiggle-hover !bg-[#f47721] hover:!bg-[#ff923f]')}
          onClick={onRetry}
        >
          <RefreshIcon className="h-[18px] w-[18px]" />
          다시 해보기
        </button>
        <button
          type="button"
          className={`${ui.btnSecondary} !bg-[#211044] !text-[#eadff7] hover:!bg-[#32175a]`}
          onClick={onHome}
        >
          <HomeIcon className="h-[18px] w-[18px]" />
          홈으로
        </button>
      </div>
    </div>
  )
}
