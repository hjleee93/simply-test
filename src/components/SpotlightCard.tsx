import { Link } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { getCategoryMeta } from '../lib/testCategories'
import { displayViewCount, isNewTest } from '../lib/trending'
import type { TestDefinition } from '../types/test'

interface SpotlightCardProps {
  test: TestDefinition
  label?: string
}

/** 홈 최상단에 크게 거는 테스트 한 개. 사이트가 "지금" 운영 중이라는 걸 첫 화면에서 보여준다. */
export default function SpotlightCard({ test, label = '이번 주 새 테스트' }: SpotlightCardProps) {
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)
  const questionCount = getPlayQuestionCount(test.id, test.questions.length)
  const views = displayViewCount(test)
  const isNew = isNewTest(test)
  const category = getCategoryMeta(test.category)

  const meta = [
    category.label,
    questionCount > 0 ? `${questionCount}문항` : null,
    views ? `${views}명이 봤어요` : null,
  ].filter(Boolean)

  return (
    <Link
      to={`/tests/${test.id}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white outline-none transition-shadow hover:shadow-[0_6px_24px_rgb(31_21_53/8%)] focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-accent-soft/40">
        <picture className="h-full w-full">
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={resolveCharacterImage(thumbnailChar)}
            alt=""
            width={480}
            height={360}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </picture>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">
          {isNew ? <span className="text-[#ffd166]">NEW</span> : null}
          {label}
        </span>
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <h2 className="text-[19px] font-bold leading-snug tracking-tight text-ink">{test.title}</h2>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-muted">{test.description}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[12px] font-semibold text-muted">{meta.join(' · ')}</p>
          <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-accent px-4 text-[13px] font-bold text-white transition-colors group-hover:bg-accent-hover">
            시작하기 →
          </span>
        </div>
      </div>
    </Link>
  )
}
