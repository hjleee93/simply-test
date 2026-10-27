import { Link } from 'react-router-dom'
import { pixelCharacterPath } from '../lib/characters'
import { getCategoryMeta } from '../lib/testCategories'
import type { TestDefinition } from '../types/test'
import StickerCard from './StickerCard'

interface TestListCardProps {
  test: TestDefinition
  showQuestionCount?: boolean
}

export default function TestListCard({ test, showQuestionCount = false }: TestListCardProps) {
  const category = getCategoryMeta(test.category)
  const isHalloween = test.resultTemplate === 'halloween'

  return (
    <Link to={`/tests/${test.id}`} className="block wiggle-hover">
      <StickerCard
        className={`flex items-center gap-3 !p-4 ${
          isHalloween
            ? '!border-[#ff942f] !bg-[#160b35] shadow-[0_5px_0_#542275]'
            : ''
        }`}
      >
        <img
          src={pixelCharacterPath(test.thumbnailCharacter ?? 'adapted')}
          alt=""
          className={`pixel-img h-14 w-14 shrink-0 ${
            isHalloween
              ? 'rounded-lg border-2 border-[#ffb247] object-cover'
              : 'object-contain'
          }`}
        />
        <div className="min-w-0 flex-1 text-left">
          <span
            className={`mb-1 inline-block text-[11px] font-bold ${
              isHalloween ? 'text-[#ffb247]' : 'text-accent'
            }`}
          >
            {category.emoji} {category.label}
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
              isHalloween ? 'text-[#d9c9ef]' : 'text-muted'
            }`}
          >
            {test.description}
          </p>
          {showQuestionCount ? (
            <span
              className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${
                isHalloween
                  ? 'border-[#ffb247] bg-[#ff942f]/20 text-[#ffd59a]'
                  : 'border-ink bg-lemon text-ink'
              }`}
            >
              {test.questions.length}문항
            </span>
          ) : null}
        </div>
        <span className={`text-xl ${isHalloween ? 'text-[#ffb247]' : 'text-accent'}`}>→</span>
      </StickerCard>
    </Link>
  )
}
