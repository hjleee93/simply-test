import { Link } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { getCategoryMeta } from '../lib/testCategories'
import type { TestDefinition } from '../types/test'
import StickerCard from './StickerCard'

interface TestListCardProps {
  test: TestDefinition
  showQuestionCount?: boolean
  compact?: boolean
}

export default function TestListCard({
  test,
  showQuestionCount = false,
  compact = false,
}: TestListCardProps) {
  const category = getCategoryMeta(test.category)
  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const webpSrc = resolveCharacterWebp(thumbnailChar)

  if (compact) {
    return (
      <Link to={`/tests/${test.id}`} className="block h-full wiggle-hover">
        <StickerCard
          className={`flex h-full flex-col items-center !p-3 text-center ${
            isHalloween
              ? '!border-[#ff942f] !bg-[#160b35] shadow-[0_5px_0_#542275]'
              : isMeme
                ? '!rounded-sm !border-2 !border-ink !bg-[#f7f3ea] !shadow-none'
                : ''
          }`}
        >
          <picture>
            {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
            <img
              src={resolveCharacterImage(thumbnailChar)}
              alt={`${test.title} 썸네일`}
              width={168}
              height={168}
              className={`mb-2 ${isMeme ? 'h-20 w-20' : 'h-14 w-14'} ${
                isHalloween
                  ? 'rounded-lg border-2 border-[#ffb247] object-cover'
                  : 'object-contain'
              }`}
            />
          </picture>
          <span
            className={`mb-1 text-[11px] font-bold ${
              isHalloween ? 'text-[#ffb247]' : isMeme ? 'text-[#e11d48]' : 'text-accent'
            }`}
          >
            {isMeme ? '올해 밈' : category.label}
          </span>
          <p
            className={`line-clamp-2 text-[13px] font-extrabold leading-snug ${
              isHalloween ? 'text-white' : 'text-ink'
            }`}
          >
            {test.title}
          </p>
          {showQuestionCount ? (
            <span
              className={`mt-2 inline-block border px-2 py-0.5 text-[11px] font-bold ${
                isHalloween
                  ? 'rounded-md border-[#ffb247] bg-[#ff942f]/20 text-[#ffd59a]'
                  : isMeme
                    ? 'rounded-sm border-ink bg-white text-ink'
                    : 'rounded-md border-ink bg-lemon text-ink'
              }`}
            >
              {getPlayQuestionCount(test.id, test.questions.length)}
              {isMeme ? '문제' : '문항'}
            </span>
          ) : null}
        </StickerCard>
      </Link>
    )
  }

  return (
    <Link to={`/tests/${test.id}`} className="block wiggle-hover">
      <StickerCard
        className={`flex items-center gap-3 !p-4 ${
          isHalloween
            ? '!border-[#ff942f] !bg-[#160b35] shadow-[0_5px_0_#542275]'
            : isMeme
              ? '!rounded-sm !border-2 !border-ink !bg-[#f7f3ea] !shadow-none'
              : ''
        }`}
      >
        <picture className="shrink-0">
          {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
          <img
            src={resolveCharacterImage(thumbnailChar)}
            alt={`${test.title} 썸네일`}
            width={168}
            height={168}
            className={`h-14 w-14 ${
              isHalloween
                ? 'rounded-lg border-2 border-[#ffb247] object-cover'
                : 'object-contain'
            }`}
          />
        </picture>
        <div className="min-w-0 flex-1 text-left">
          <span
            className={`mb-1 inline-block text-[11px] font-bold ${
              isHalloween ? 'text-[#ffb247]' : isMeme ? 'text-[#e11d48]' : 'text-accent'
            }`}
          >
            {isMeme ? '올해 밈' : category.label}
          </span>
          <p
            className={`mb-1 text-[15px] font-extrabold ${
              isHalloween ? 'text-white' : 'text-ink'
            }`}
          >
            {test.title}
          </p>
          <p
            className={`text-sm leading-snug ${
              isHalloween ? 'text-[#d9c9ef]' : isMeme ? 'text-[#5c564e]' : 'text-muted'
            }`}
          >
            {test.description}
          </p>
          {showQuestionCount ? (
            <span
              className={`mt-2 inline-block border px-2 py-0.5 text-xs font-bold ${
                isHalloween
                  ? 'rounded-md border-[#ffb247] bg-[#ff942f]/20 text-[#ffd59a]'
                  : isMeme
                    ? 'rounded-sm border-ink bg-white text-ink'
                    : 'rounded-md border-ink bg-lemon text-ink'
              }`}
            >
              {getPlayQuestionCount(test.id, test.questions.length)}
              {isMeme ? '문제' : '문항'}
            </span>
          ) : null}
        </div>
        <span className={`text-xl ${isHalloween ? 'text-[#ffb247]' : isMeme ? 'text-ink' : 'text-accent'}`}>→</span>
      </StickerCard>
    </Link>
  )
}
