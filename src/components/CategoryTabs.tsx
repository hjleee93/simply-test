import { cn } from '../lib/cn'
import type { TestCategoryMeta } from '../lib/testCategories'
import type { TestCategoryId } from '../types/test'

export type CategoryFilter = TestCategoryId | 'all'

interface CategoryTabsProps {
  categories: TestCategoryMeta[]
  active: CategoryFilter
  onChange: (next: CategoryFilter) => void
  allLabel?: string
  className?: string
}

export default function CategoryTabs({
  categories,
  active,
  onChange,
  allLabel = '전체',
  className,
}: CategoryTabsProps) {
  return (
    <div className={cn('flex gap-4 overflow-x-auto text-sm font-bold', className)} role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'all'}
        className={cn(
          'shrink-0 border-b-2 pb-1',
          active === 'all' ? 'border-ink text-ink' : 'border-transparent text-muted',
        )}
        onClick={() => onChange('all')}
      >
        {allLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={active === category.id}
          className={cn(
            'shrink-0 border-b-2 pb-1',
            active === category.id ? 'border-ink text-ink' : 'border-transparent text-muted',
          )}
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
