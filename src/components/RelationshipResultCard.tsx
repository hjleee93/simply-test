import { useRef } from 'react'
import { cn } from '../lib/cn'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import Logo from './Logo'
import ResultCharacter from './ResultCharacter'
import ResultShareActions from './ResultShareActions'
import StickerCard from './StickerCard'

interface RelationshipResultCardProps {
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

export default function RelationshipResultCard({
  result,
  matchPercent,
  testTitle,
  resultLabel,
  onRetry,
  onHome,
}: RelationshipResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const shareText = result.shareText ?? `${resultLabel} · ${result.title} (${result.keyword})`

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        <ResultCharacter resultId={result.id} emoji={result.emoji} image={result.characterImage} />

        <section className="text-center">
          <p className="mb-1 text-sm font-bold text-muted">
            {result.emoji} 당신의 {resultLabel}
          </p>
          <p className="text-[22px] font-extrabold leading-snug text-ink">
            당신은 「{result.title}」입니다.
          </p>
          <span className="mt-3 inline-block rounded-md border-2 border-ink bg-lemon px-3 py-1 text-sm font-bold text-ink">
            {result.keyword}
          </span>
          <p className="mt-2 text-xs font-bold text-muted">일치도 {matchPercent}%</p>
        </section>

        <div className="my-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
          <span className="h-px w-8 bg-gray-200" />
          ✨ 결과 리포트 ✨
          <span className="h-px w-8 bg-gray-200" />
        </div>

        <section className="mb-4">
          <SectionTitle emoji="📝">당신의 특징</SectionTitle>
          <StickerCard>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
              {result.description}
            </p>
          </StickerCard>
        </section>

        {result.strengths && result.strengths.length > 0 ? (
          <section className="mb-4">
            <SectionTitle emoji="✨">당신의 장점</SectionTitle>
            <StickerCard soft>
              <ul className="space-y-2">
                {result.strengths.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink">
                    <span className="font-extrabold text-accent">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StickerCard>
          </section>
        ) : null}

        {result.blindSpots && result.blindSpots.length > 0 ? (
          <section className="mb-4">
            <SectionTitle emoji="🌓">당신이 놓치기 쉬운 부분</SectionTitle>
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

        {result.situations && result.situations.length > 0 ? (
          <section className="mb-4">
            <SectionTitle emoji="👀">인간관계에서 이런 모습을 보여요</SectionTitle>
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
            <SectionTitle emoji="💬">당신에게 필요한 한마디</SectionTitle>
            <StickerCard className="text-center">
              <p className="text-[15px] font-extrabold leading-relaxed text-ink">
                "{result.advice}"
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
