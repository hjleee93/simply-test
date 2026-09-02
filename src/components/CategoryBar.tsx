import { cn } from '../lib/cn'
import type { CategoryPercent } from '../lib/resultInsights'

interface CategoryBarProps {
  item: CategoryPercent
}

export default function CategoryBar({ item }: CategoryBarProps) {
  const filled = Math.round(item.percent / 10)
  const empty = 10 - filled

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-ink">
          {item.emoji} {item.label}
        </span>
        <span className="font-bold text-accent">{item.percent}%</span>
      </div>
      <div className="text-[16px] leading-none tracking-widest">
        <span className="text-accent">{'■'.repeat(filled)}</span>
        <span className="text-gray-200">{'□'.repeat(empty)}</span>
      </div>
    </div>
  )
}

interface CategoryBarListProps {
  items: CategoryPercent[]
  className?: string
}

export function CategoryBarList({ items, className }: CategoryBarListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => (
        <CategoryBar key={item.category} item={item} />
      ))}
    </div>
  )
}
