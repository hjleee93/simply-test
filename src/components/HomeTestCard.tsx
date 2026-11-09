import { Link } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { getCategoryMeta } from '../lib/testCategories'
import type { TestDefinition } from '../types/test'

interface HomeTestCardProps {
  test: TestDefinition
}

export default function HomeTestCard({ test }: HomeTestCardProps) {
  const category = getCategoryMeta(test.category)
  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)
  const questionCount = getPlayQuestionCount(test.id, test.questions.length)
  const estimatedMinutes = questionCount > 0 ? Math.max(1, Math.ceil(questionCount / 10)) : 0
  const categoryLabel = isMeme ? '올해 밈' : isHalloween ? '할로윈' : category.label

  return (
    <Link
      to={`/tests/${test.id}`}
      className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-[0_2px_18px_-6px_rgba(31,21,53,0.12)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream">
            <picture>
              {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
              <img
                src={resolveCharacterImage(thumbnailChar)}
                alt=""
                width={168}
                height={168}
                className={`h-11 w-11 ${isHalloween ? 'rounded-lg object-cover' : 'object-contain'}`}
              />
            </picture>
          </span>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-ink">
            {categoryLabel}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-[17px] font-extrabold leading-snug text-ink">{test.title}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{test.description}</p>
      </div>

      {questionCount > 0 ? (
        <div className="mt-3 flex items-center rounded-xl bg-cream text-center text-[12px] font-bold text-muted min-[640px]:text-[13px]">
          <span className="flex-1 py-2">
            문항 <span className="text-ink">{questionCount}개</span>
          </span>
          <span className="h-4 w-px bg-cream-dark" aria-hidden />
          <span className="flex-1 py-2">
            소요 <span className="text-ink">약 {estimatedMinutes}분</span>
          </span>
        </div>
      ) : null}

    </Link>
  )
}
