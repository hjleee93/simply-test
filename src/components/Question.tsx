import { cn } from '../lib/cn'
import type { Question as QuestionType, ScoreMap } from '../types/test'
import StickerCard from './StickerCard'

interface QuestionProps {
  question: QuestionType
  selectedAnswerId?: string
  onSelect: (answerId: string, scores: ScoreMap) => void
}

export default function Question({
  question,
  selectedAnswerId,
  onSelect,
}: QuestionProps) {
  return (
    <div>
      <StickerCard soft className="mb-4 !p-4">
        <h2 className="text-center text-[18px] font-bold leading-snug text-ink">
          {question.question}
        </h2>
      </StickerCard>
      <ul className="flex flex-col gap-2.5">
        {question.answers.map((answer) => (
          <li key={answer.id}>
            <button
              type="button"
              className={cn(
                'w-full rounded-lg border-[3px] px-4 py-4 text-left text-[15px] font-bold leading-snug text-ink transition-colors',
                selectedAnswerId === answer.id
                  ? 'border-ink bg-accent text-white'
                  : 'border-ink bg-white hover:bg-cream-dark',
              )}
              onClick={() => onSelect(answer.id, answer.scores)}
            >
              {answer.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
