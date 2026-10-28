import { cn } from '../lib/cn'
import type { Gender } from '../types/test'
import { FemaleIcon, MaleIcon } from './icons'
import StickerCard from './StickerCard'

interface GenderSelectorProps {
  selected?: Gender
  onSelect: (gender: Gender) => void
}

const OPTIONS: { value: Gender; Icon: typeof MaleIcon; label: string; desc: string }[] = [
  { value: 'male', Icon: MaleIcon, label: '남성', desc: '여미새 테스트' },
  { value: 'female', Icon: FemaleIcon, label: '여성', desc: '남미새 테스트' },
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
                'flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-[transform,background-color,box-shadow] duration-150',
                selected === option.value
                  ? 'bg-accent text-white shadow-[0_6px_16px_-6px_rgba(224,82,124,0.55)]'
                  : 'bg-white text-ink shadow-[0_2px_10px_-5px_rgba(31,21,53,0.16)] hover:-translate-y-0.5',
              )}
              onClick={() => onSelect(option.value)}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  selected === option.value ? 'bg-white/20' : 'bg-accent-soft text-accent-hover',
                )}
              >
                <option.Icon className="h-5 w-5" />
              </span>
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
