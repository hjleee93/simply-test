import { useRef } from 'react'
import { resolveCharacterImage } from '../lib/characters'
import type { ResultBlock, ResultHeader } from '../lib/resultView'
import { ui } from '../lib/ui'
import type { TestResult } from '../types/test'
import { CategoryBarList } from './CategoryBar'
import { CheckIcon, HomeIcon, RefreshIcon } from './icons'
import Logo from './Logo'
import ResultCharacter from './ResultCharacter'
import ResultPeerStat from './ResultPeerStat'
import ResultShareActions from './ResultShareActions'
import StickerCard from './StickerCard'

interface ResultViewProps {
  result: TestResult
  testTitle: string
  testId: string
  header: ResultHeader
  blocks: ResultBlock[]
  shareText: string
  shareTitle: string
  peerPercent?: number | null
  onRetry: () => void
  onHome: () => void
}

function BlockTitle({ children, className }: { children: string; className?: string }) {
  return <h3 className={`mb-3 text-[15px] font-extrabold ${className ?? 'text-ink'}`}>{children}</h3>
}

function ResultBlockView({ block, tone }: { block: ResultBlock; tone: ResultHeader['tone'] }) {
  const titleClass = tone === 'halloween' ? 'text-[#2a1450]' : 'text-ink'

  if (block.kind === 'note') {
    return <p className="mb-4 text-center text-[13px] leading-relaxed text-muted">{block.text}</p>
  }

  return (
    <section className="mb-4">
      {block.title ? <BlockTitle className={titleClass}>{block.title}</BlockTitle> : null}
      {block.kind === 'bars' ? (
        <StickerCard>
          <CategoryBarList items={block.items} />
        </StickerCard>
      ) : null}
      {block.kind === 'prose' ? (
        <StickerCard soft={block.soft}>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">{block.text}</p>
        </StickerCard>
      ) : null}
      {block.kind === 'quote' ? (
        <StickerCard soft={block.soft} className="text-center">
          <p className="whitespace-pre-line text-[15px] font-extrabold leading-relaxed text-ink">
            {block.marks ? `"${block.text}"` : block.text}
          </p>
        </StickerCard>
      ) : null}
      {block.kind === 'list' ? (
        <StickerCard soft={block.soft}>
          <ul className="space-y-2">
            {block.items.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink">
                {block.checked ? (
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                ) : (
                  <span className="font-extrabold text-muted">·</span>
                )}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </StickerCard>
      ) : null}
    </section>
  )
}

function ResultHeaderView({
  header,
  peerPercent,
}: {
  header: ResultHeader
  peerPercent?: number | null
}) {
  const captionClass = header.tone === 'halloween' ? 'text-[#7346a8]' : 'text-muted'
  const headlineClass =
    header.mode === 'score'
      ? 'mt-3 text-lg font-extrabold text-ink'
      : header.tone === 'halloween'
        ? 'text-[22px] font-extrabold leading-snug text-[#2a1450]'
        : 'text-[22px] font-extrabold leading-snug text-ink'

  return (
    <section className="text-center">
      <p className={`mb-1 text-sm font-bold ${captionClass}`}>{header.caption}</p>
      {header.mode === 'score' ? (
        <p className="text-5xl font-bold text-ink">
          {header.percent}
          <span className="text-[28px] font-bold text-accent">%</span>
        </p>
      ) : null}
      <p className={headlineClass}>{header.headline}</p>
      {header.oneLiner ? <p className="mt-2 text-[15px] font-bold text-accent">{header.oneLiner}</p> : null}
      {header.keywordBadge ? (
        <span className="mt-3 inline-block rounded-md border-2 border-[#2a1450] bg-[#ffb247] px-3 py-1 text-sm font-bold text-[#2a1450]">
          {header.keywordBadge}
        </span>
      ) : null}
      {header.subtitle ? <span className="mt-2 block text-sm font-bold text-muted">{header.subtitle}</span> : null}
      {header.matchText ? (
        <p className={`mt-2 text-xs font-bold ${captionClass}`}>{header.matchText}</p>
      ) : null}
      <ResultPeerStat percent={peerPercent} className={header.tone === 'halloween' ? 'text-[#7346a8]' : undefined} />
    </section>
  )
}

export default function ResultView({
  result,
  testTitle,
  testId,
  header,
  blocks,
  shareText,
  shareTitle,
  peerPercent,
  onRetry,
  onHome,
}: ResultViewProps) {
  const shareRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div ref={shareRef} className="rounded-3xl bg-cream px-2 py-3">
        {header.poster && result.characterImage ? (
          <img
            src={resolveCharacterImage(result.characterImage)}
            alt={`${result.title} 영화 포스터`}
            className="mx-auto mb-5 w-full max-w-[320px] rounded-2xl border-2 border-ink object-contain"
          />
        ) : (
          <ResultCharacter resultId={result.id} emoji={result.emoji} image={result.characterImage} />
        )}

        <ResultHeaderView header={header} peerPercent={peerPercent} />

        {header.divider ? (
          <div className="my-5 flex items-center justify-center gap-2 text-xs font-bold text-muted">
            <span className="h-px w-8 bg-gray-200" />
            {header.divider}
            <span className="h-px w-8 bg-gray-200" />
          </div>
        ) : (
          <div className="mt-6" />
        )}

        {blocks.map((block, index) => (
          <ResultBlockView key={`${block.kind}-${block.kind === 'note' ? block.text : block.title ?? index}`} block={block} tone={header.tone} />
        ))}

        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-bold text-muted">
          <Logo showText iconClassName="h-4 w-4" className="gap-1" />
          <span>· {testTitle}</span>
        </p>
      </div>

      <div className="mt-6">
        <ResultShareActions
          shareRef={shareRef}
          thresholdPercent={header.percent}
          resultTitle={result.title}
          shareText={shareText}
          shareTitle={shareTitle}
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
