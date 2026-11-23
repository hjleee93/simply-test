import { Link } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { getCategoryMeta } from '../lib/testCategories'
import type { TestDefinition } from '../types/test'

interface TestListCardProps {
  test: TestDefinition
  tone?: 'default' | 'onDark'
}

export default function TestListCard({ test, tone = 'default' }: TestListCardProps) {
  const onDark = tone === 'onDark'
  const category = getCategoryMeta(test.category)
  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)
  const questionCount = getPlayQuestionCount(test.id, test.questions.length)
  const categoryLabel = isMeme ? '올해 밈' : isHalloween ? '할로윈' : category.label

  return (
    <Link
      to={`/tests/${test.id}`}
      className="flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span
        className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-md ${
          onDark ? 'bg-[#211044]' : 'bg-white'
        }`}
      >
        <picture className="h-full w-full">
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={resolveCharacterImage(thumbnailChar)}
            alt=""
            width={168}
            height={168}
            className={`h-full w-full ${isHalloween ? 'object-cover' : 'object-contain'}`}
          />
        </picture>
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
        </span>
      </span>
    </Link>
  )
}
