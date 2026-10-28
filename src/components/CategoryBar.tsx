import { cn } from '../lib/cn'
import type { CategoryPercent } from '../lib/resultInsights'

interface CategoryBarProps {
  item: CategoryPercent
}

export default function CategoryBar({ item }: CategoryBarProps) {
  const percent = Math.min(100, Math.max(0, item.percent))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-ink">
          {item.emoji} {item.label}
        </span>
        <span className="font-bold text-accent">{item.percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
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
