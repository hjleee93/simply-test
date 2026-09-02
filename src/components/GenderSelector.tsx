import { cn } from '../lib/cn'
import type { Gender } from '../types/test'
import StickerCard from './StickerCard'

interface GenderSelectorProps {
  selected?: Gender
  onSelect: (gender: Gender) => void
}

const OPTIONS: { value: Gender; emoji: string; label: string; desc: string }[] = [
  { value: 'male', emoji: '👨', label: '남성', desc: '여미새 테스트' },
  { value: 'female', emoji: '👩', label: '여성', desc: '남미새 테스트' },
]

export default function GenderSelector({ selected, onSelect }: GenderSelectorProps) {
  return (
    <div>
      <StickerCard soft className="mb-4 !p-4">
        <h2 className="text-center text-[18px] font-bold leading-snug text-ink">
          먼저 성별을 골라주세요
        </h2>
        <p className="mt-2 text-center text-sm text-muted">결과 유형에 반영돼요</p>
      </StickerCard>
      <ul className="flex flex-col gap-2.5">
        {OPTIONS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border-[3px] px-4 py-4 text-left transition-colors',
                selected === option.value
                  ? 'border-ink bg-accent text-white'
                  : 'border-ink bg-white hover:bg-cream-dark',
              )}
              onClick={() => onSelect(option.value)}
            >
              <span className="text-2xl">{option.emoji}</span>
              <div>
                <p className="text-[15px] font-bold">{option.label}</p>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    selected === option.value ? 'text-white/80' : 'text-muted',
                  )}
                >
                  {option.desc}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
