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
  theme?: 'default' | 'halloween' | 'meme'
  questionNumber?: number
}

export default function Question({
  question,
  selectedAnswerId,
  onSelect,
  theme = 'default',
  questionNumber,
}: QuestionProps) {
  const isHalloween = theme === 'halloween'
  const isMeme = theme === 'meme'

  const select = (answer: QuestionType['answers'][number]) => {
    onSelect(
      answer.id,
      answer.patternScores
        ? { patternScores: answer.patternScores }
        : answer.score !== undefined
          ? { score: answer.score }
          : { scores: answer.scores ?? {} },
    )
  }

  if (isMeme) {
    return (
      <div>
        <div className="relative mb-4 border-2 border-ink bg-[#f7f3ea] px-4 pb-5 pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="bg-ink px-2 py-1 text-[11px] font-bold tracking-wide text-white">
              올해 유행어
            </span>
            {questionNumber ? (
              <span className="text-xs font-bold text-[#5c564e]">Q{questionNumber}.</span>
            ) : null}
          </div>

          {question.highlight ? (
            <h2 className="text-center text-[26px] font-black leading-tight text-ink">
              {question.highlight}
            </h2>
          ) : null}

          <p
            className={`text-center text-[15px] font-bold leading-snug text-[#3f3a34] ${
              question.highlight ? 'mt-3' : 'text-[18px] text-ink'
            }`}
          >
            {question.question}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-2.5">
          {question.answers.map((answer) => {
            const selected = selectedAnswerId === answer.id
            const isKnow = answer.id === 'y'
            return (
              <li key={answer.id}>
                <button
                  type="button"
                  className={cn(
                    'flex h-[5.5rem] w-full flex-col items-center justify-center rounded-sm border-2 border-ink text-[17px] font-black transition-[transform,background-color] duration-150',
                    selected
                      ? isKnow
                        ? 'bg-[#1d4ed8] text-white'
                        : 'bg-[#e11d48] text-white'
                      : 'bg-white text-ink hover:-translate-y-0.5',
                  )}
                  onClick={() => select(answer)}
                >
                  <span className="text-[28px] leading-none">{isKnow ? '○' : '×'}</span>
                  <span className="mt-1 text-sm">{isKnow ? '알지' : '모름'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

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
              onClick={() => select(answer)}
            >
              {answer.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
