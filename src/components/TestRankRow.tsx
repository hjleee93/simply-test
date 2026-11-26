import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getCategoryMeta } from '../lib/testCategories'
import { displayViewCount, isNewTest } from '../lib/trending'
import type { TestDefinition } from '../types/test'

interface TestRankRowProps {
  test: TestDefinition
  rank: number
}

export default function TestRankRow({ test, rank }: TestRankRowProps) {
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)
  const views = displayViewCount(test)
  const category = getCategoryMeta(test.category)

  return (
    <Link
      to={`/tests/${test.id}`}
      className="flex items-center gap-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span
        className={cn(
          'w-6 shrink-0 text-center text-[17px] font-black tabular-nums',
          rank <= 3 ? 'text-accent' : 'text-muted',
        )}
      >
        {rank}
      </span>
      <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
        <picture className="h-full w-full">
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={resolveCharacterImage(thumbnailChar)}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 text-[15px] font-bold text-ink">{test.title}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
          {isNewTest(test) ? (
            <span className="rounded bg-accent-soft px-1 text-[10px] font-black text-accent">NEW</span>
          ) : null}
          {category.label}
          {views ? <> · 조회 {views}</> : null}
        </span>
      </span>
    </Link>
  )
}
