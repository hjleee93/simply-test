import { useRef } from 'react'
import { cn } from '../lib/cn'
import type { KkondaeInsight } from '../lib/kkondae'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import Logo from './Logo'
import ResultCharacter from './ResultCharacter'
import ResultShareActions from './ResultShareActions'
import StickerCard from './StickerCard'

interface KkondaeResultCardProps {
  result: TestResult
  thresholdPercent: number
  insights: KkondaeInsight
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

export default function KkondaeResultCard({
  result,
  thresholdPercent,
  insights,
  testTitle,
  resultLabel,
  onRetry,
  onHome,
}: KkondaeResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const shareText = `${resultLabel} ${thresholdPercent}% · ${result.title} (${result.keyword})`

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        <ResultCharacter resultId={result.id} emoji={result.emoji} image={result.characterImage} />

        <section className="text-center">
          <p className="mb-1 text-sm font-bold text-muted">
            {result.emoji} 당신의 {resultLabel}
          </p>
          <p className="text-5xl font-bold text-ink">
            {thresholdPercent}
            <span className="text-[28px] font-bold text-accent">%</span>
          </p>
          <p className="mt-3 text-lg font-extrabold text-ink">{result.title}</p>
          <span className="mt-2 inline-block rounded-md border-2 border-ink bg-lemon px-3 py-1 text-sm font-bold text-ink">
            {result.keyword}
          </span>
        </section>

        <div className="my-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
          <span className="h-px w-8 bg-gray-200" />
          ✨ 결과 리포트 ✨
          <span className="h-px w-8 bg-gray-200" />
        </div>

        <StickerCard className="mb-4">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
            {result.description}
          </p>
        </StickerCard>

        <section className="mb-4">
          <SectionTitle emoji="📡">꼰대 레이더 상태</SectionTitle>
          <StickerCard soft className="text-center">
            <p className="text-[15px] font-extrabold leading-relaxed text-ink">
              {insights.radarLevel}
            </p>
          </StickerCard>
        </section>

        <section className="mb-4">
          <SectionTitle emoji="🧑‍💼">후배 반응 예상</SectionTitle>
          <StickerCard soft className="text-center">
            <p className="text-[15px] font-extrabold leading-relaxed text-ink">
              {insights.juniorReaction}
            </p>
          </StickerCard>
        </section>

        <section className="mb-4">
          <SectionTitle emoji="💡">한마디 조언</SectionTitle>
          <StickerCard>
            <p className="text-[15px] leading-relaxed text-ink">{insights.tip}</p>
          </StickerCard>
        </section>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-muted">
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
          shareTitle={`${resultLabel} 테스트 결과`}
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <button type="button" className={cn(ui.btnPrimary, 'wiggle-hover')} onClick={onRetry}>
          다시 해보기 🔄
        </button>
        <button type="button" className={ui.btnSecondary} onClick={onHome}>
          홈으로 🏠
        </button>
      </div>
    </div>
  )
}
