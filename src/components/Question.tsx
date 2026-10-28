import { cn } from '../lib/cn'
import type { PatternScoreMap, Question as QuestionType, ScoreMap } from '../types/test'
import StickerCard from './StickerCard'

export type AnswerSelection = {
  scores?: ScoreMap
  score?: number
  patternScores?: PatternScoreMap
}

interface QuestionProps {
  question: QuestionType
  selectedAnswerId?: string
  onSelect: (answerId: string, data: AnswerSelection) => void
  theme?: 'default' | 'halloween'
}

export default function Question({
  question,
  selectedAnswerId,
  onSelect,
  theme = 'default',
}: QuestionProps) {
  const isHalloween = theme === 'halloween'

  return (
    <div>
      <StickerCard
        soft
        className={`mb-4 !p-4 ${
          isHalloween ? '!border-[#ff942f] !bg-[#2a1450]' : ''
        }`}
      >
        <h2
          className={`text-center text-[18px] font-bold leading-snug ${
            isHalloween ? 'text-white' : 'text-ink'
          }`}
        >
          {question.question}
        </h2>
      </StickerCard>
      <ul className="flex flex-col gap-2.5">
        {question.answers.map((answer) => (
          <li key={answer.id}>
            <button
              type="button"
              className={cn(
                'w-full rounded-2xl px-4 py-4 text-left text-[15px] font-bold leading-snug transition-[transform,background-color,box-shadow] duration-150',
                selectedAnswerId === answer.id
                  ? isHalloween
                    ? 'bg-[#f47721] text-white shadow-[0_6px_16px_-6px_rgba(244,119,33,0.6)]'
                    : 'bg-accent text-white shadow-[0_6px_16px_-6px_rgba(224,82,124,0.55)]'
                  : isHalloween
                    ? 'bg-[#211044] text-[#eadff7] hover:bg-[#32175a]'
                    : 'bg-white text-ink shadow-[0_2px_10px_-5px_rgba(31,21,53,0.16)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(31,21,53,0.18)]',
              )}
              onClick={() =>
                onSelect(
                  answer.id,
                  answer.patternScores
                    ? { patternScores: answer.patternScores }
                    : answer.score !== undefined
                      ? { score: answer.score }
                      : { scores: answer.scores ?? {} },
                )
              }
            >
              {answer.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
