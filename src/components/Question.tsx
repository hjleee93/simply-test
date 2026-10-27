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
                'w-full rounded-lg border-[3px] px-4 py-4 text-left text-[15px] font-bold leading-snug transition-colors',
                selectedAnswerId === answer.id
                  ? isHalloween
                    ? 'border-[#ffd08a] bg-[#f47721] text-white'
                    : 'border-ink bg-accent text-white'
                  : isHalloween
                    ? 'border-[#70439a] bg-[#211044] text-[#eadff7] hover:border-[#ff942f] hover:bg-[#32175a]'
                    : 'border-ink bg-white text-ink hover:bg-cream-dark',
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
