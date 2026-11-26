import { useRef } from 'react'
import { resolveCharacterImage } from '../lib/characters'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import { CheckIcon, HomeIcon, RefreshIcon } from './icons'
import Logo from './Logo'
import ResultCharacter from './ResultCharacter'
import ResultShareActions from './ResultShareActions'
import StickerCard from './StickerCard'

interface MovieResultCardProps {
  result: TestResult
  matchPercent: number
  testTitle: string
  testId: string
  resultLabel: string
  onRetry: () => void
  onHome: () => void
}

export default function MovieResultCard({
  result,
  matchPercent,
  testTitle,
  testId,
  resultLabel,
  onRetry,
  onHome,
}: MovieResultCardProps) {
  const shareRef = useRef<HTMLDivElement>(null)
  const shareText = result.shareText ?? `${testTitle} · ${result.title}`

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        {result.characterImage ? (
          <img
            src={resolveCharacterImage(result.characterImage)}
            alt={`${result.title} 영화 포스터`}
            className="mx-auto mb-5 w-full max-w-[320px] rounded-2xl border-2 border-ink object-contain"
          />
        ) : (
          <ResultCharacter resultId={result.id} emoji={result.emoji} />
        )}

        <section className="text-center">
          <p className="mb-2 text-sm font-bold text-muted">{result.emoji} {resultLabel}</p>
          <h2 className="text-[22px] font-extrabold leading-snug text-ink">{result.title}</h2>
          {result.oneLiner ? (
            <p className="mt-2 text-[15px] font-bold text-accent">{result.oneLiner}</p>
          ) : null}
          <p className="mt-3 text-xs font-bold text-muted">{result.keyword} · 장르 일치도 {matchPercent}%</p>
        </section>

        <section className="mt-6 mb-4">
          <h3 className="mb-3 text-[15px] font-extrabold text-ink">🎬 내 영화 줄거리</h3>
          <StickerCard>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">
              {result.description}
            </p>
          </StickerCard>
        </section>

        {result.strengths?.length ? (
          <section className="mb-4">
            <h3 className="mb-3 text-[15px] font-extrabold text-ink">✨ 주인공의 장점</h3>
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
            <h3 className="mb-3 text-[15px] font-extrabold text-ink">👀 놓치기 쉬운 장면</h3>
            <StickerCard>
              <ul className="space-y-2">
                {result.blindSpots.map((item) => (
                  <li key={item} className="text-[15px] leading-snug text-ink">· {item}</li>
                ))}
              </ul>
            </StickerCard>
          </section>
        ) : null}

        {result.advice ? (
          <section className="mb-4">
            <h3 className="mb-3 text-[15px] font-extrabold text-ink">💌 다음 장면을 위한 한마디</h3>
            <StickerCard soft>
              <p className="text-[15px] font-bold leading-relaxed text-ink">{result.advice}</p>
            </StickerCard>
          </section>
        ) : null}

        {result.viralHint ? (
          <p className="mb-4 text-center text-[13px] leading-relaxed text-muted">{result.viralHint}</p>
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
          shareTitle={`${testTitle} 결과`}
          testId={testId}
          resultId={result.id}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className={ui.btnSecondary} onClick={onRetry}>
          <RefreshIcon className="h-[18px] w-[18px]" />
          다시 해보기
        </button>
        <button type="button" className={ui.btnSecondary} onClick={onHome}>
          <HomeIcon className="h-[18px] w-[18px]" />
          홈으로
        </button>
      </div>
    </div>
  )
}
