import { Link } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { getCategoryMeta } from '../lib/testCategories'
import { displayViewCount, isNewTest } from '../lib/trending'
import type { TestDefinition } from '../types/test'

interface TestListCardProps {
  test: TestDefinition
  tone?: 'default' | 'onDark'
  priority?: boolean
  /** 공개 2주 이내면 썸네일에 NEW 배지 */
  showNewBadge?: boolean
}

export default function TestListCard({
  test,
  tone = 'default',
  priority = false,
  showNewBadge = false,
}: TestListCardProps) {
  const onDark = tone === 'onDark'
  const category = getCategoryMeta(test.category)
  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)
  const questionCount = getPlayQuestionCount(test.id, test.questions.length)
  const categoryLabel = isMeme ? '올해 밈' : isHalloween ? '할로윈' : category.label
  const views = displayViewCount(test)
  const isNew = showNewBadge && isNewTest(test)

  return (
    <Link
      to={`/tests/${test.id}`}
      className="flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md ${
          onDark ? 'bg-[#211044]' : 'bg-transparent'
        }`}
      >
        <picture className="h-full w-full">
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={resolveCharacterImage(thumbnailChar)}
            alt=""
            width={168}
            height={168}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            className={`h-full w-full ${isHalloween ? 'object-cover' : 'object-contain'}`}
          />
        </picture>
        {isNew ? (
          <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
            NEW
          </span>
        ) : null}
      </span>
      <span className="mt-2 min-w-0">
        <span
          className={`line-clamp-2 block text-[15px] font-bold leading-snug ${
            onDark ? 'text-white' : 'text-ink'
          }`}
        >
          {test.title}
        </span>
        <span className={`mt-1 block text-[12px] ${onDark ? 'text-[#d9c9ef]' : 'text-muted'}`}>
          {categoryLabel}
          {questionCount > 0 ? ` · ${questionCount}${isMeme ? '문제' : '문항'}` : ''}
          {views ? ` · 조회 ${views}` : ''}
        </span>
      </span>
    </Link>
  )
}
