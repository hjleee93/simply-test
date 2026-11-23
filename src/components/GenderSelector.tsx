import { cn } from '../lib/cn'
import type { Gender } from '../types/test'

interface GenderSelectorProps {
  selected?: Gender
  onSelect: (gender: Gender) => void
}

const OPTIONS: { value: Gender; label: string; desc: string }[] = [
  { value: 'male', label: '남성', desc: '여미새 테스트' },
  { value: 'female', label: '여성', desc: '남미새 테스트' },
]

export default function GenderSelector({ selected, onSelect }: GenderSelectorProps) {
  return (
    <div>
      <h2 className="mb-1 text-[18px] font-bold leading-snug text-ink">먼저 성별을 골라주세요</h2>
      <p className="mb-4 text-sm text-muted">결과 유형에 반영돼요</p>
      <ul className="flex flex-col gap-2">
        {OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={cn(
                'w-full rounded-md border px-4 py-3.5 text-left transition-colors',
                selected === option.value
                  ? 'border-accent bg-accent text-white'
                  : 'border-ink/10 bg-white text-ink hover:border-ink/30',
              )}
              onClick={() => onSelect(option.value)}
            >
              <p className="text-[15px] font-bold">{option.label}</p>
              <p
                className={cn(
                  'mt-0.5 text-sm',
                  selected === option.value ? 'text-white/80' : 'text-muted',
                )}
              >
                {option.desc}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
