import { useRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { ResultInsights } from '../lib/resultInsights'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import { CategoryBarList } from './CategoryBar'
import ResultCharacter from './ResultCharacter'
import ResultShareActions from './ResultShareActions'
import Logo from './Logo'
import StickerCard from './StickerCard'

interface ResultCardProps {
  result: TestResult
  thresholdPercent: number
  insights: ResultInsights
  testTitle: string
  onRetry: () => void
  onHome: () => void
}

function SectionTitle({ emoji, children }: { emoji: string; children: ReactNode }) {
  return (
    <h3 className="mb-3 text-[15px] font-extrabold text-ink">
      {emoji} {children}
    </h3>
  )
}

export default function ResultCard({
  result,
  thresholdPercent,
  insights,
  testTitle,
  onRetry,
  onHome,
}: ResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const shareText = `퇴사 임계점 ${thresholdPercent}% · ${result.title} (${insights.subtype})`

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        <ResultCharacter resultId={result.id} emoji={result.emoji} image={result.characterImage} />

        <section className="text-center">
          <p className="mb-1 text-sm font-bold text-muted">
            {result.emoji} 당신의 퇴사 임계점
          </p>
          <p className="text-5xl font-bold text-ink">
            {thresholdPercent}
            <span className="text-[28px] font-bold text-accent">%</span>
          </p>
          <p className="mt-3 text-lg font-extrabold text-ink">{result.title}</p>
          <span className="mt-2 inline-block rounded-md border-2 border-ink bg-lemon px-3 py-1 text-sm font-bold text-ink">
            {insights.subtype}
          </span>
        </section>

        <div className="my-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
          <span className="h-px w-8 bg-gray-200" />
          ✨ 결과 리포트 ✨
          <span className="h-px w-8 bg-gray-200" />
        </div>

        <StickerCard className="mb-4">
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
            {insights.summary}
          </p>
        </StickerCard>

        <section className="mb-4">
          <SectionTitle emoji="💣">당신을 퇴사하게 만드는 것</SectionTitle>
          <StickerCard>
            <CategoryBarList items={insights.categories} />
          </StickerCard>
        </section>

        <section className="mb-4">
          <SectionTitle emoji="🚨">당신의 퇴사 버튼</SectionTitle>
          <StickerCard soft className="text-center">
            <p className="whitespace-pre-line text-[15px] font-extrabold leading-relaxed text-ink">
              "{insights.resignButton}"
            </p>
          </StickerCard>
        </section>

        <section className="mb-4">
          <SectionTitle emoji="💼">당신에게 필요한 회사</SectionTitle>
          <StickerCard>
            <ul className="space-y-2">
              {insights.companyNeeds.map((need) => (
                <li key={need} className="flex gap-2 text-[15px] leading-snug text-ink">
                  <span className="font-extrabold text-accent">✓</span>
                  <span>{need}</span>
                </li>
              ))}
            </ul>
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
