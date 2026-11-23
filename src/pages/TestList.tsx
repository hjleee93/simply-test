import { useMemo, useState } from 'react'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { useAllTests } from '../lib/useTests'
import { cn } from '../lib/cn'
import { TEST_CATEGORIES } from '../lib/testCategories'
import { ui } from '../lib/ui'
import type { TestCategoryId } from '../types/test'

type CategoryFilter = TestCategoryId | 'all'

export default function TestList() {
  const { tests, loading } = useAllTests()
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const availableCategories = useMemo(
    () => TEST_CATEGORIES.filter((category) => tests.some((test) => test.category === category.id)),
    [tests],
  )

  const filteredTests = useMemo(
    () =>
      activeCategory === 'all' ? tests : tests.filter((test) => test.category === activeCategory),
    [tests, activeCategory],
  )

  return (
    <PageLayout backTo="/" backLabel="홈">
      <header className="mb-4">
        <h1 className={ui.pageTitle}>테스트</h1>
      </header>

      <div className="mb-2 flex gap-4 overflow-x-auto text-sm font-bold">
        <button
          type="button"
          className={cn(
            'shrink-0 border-b-2 pb-1',
            activeCategory === 'all' ? 'border-ink text-ink' : 'border-transparent text-muted',
          )}
          onClick={() => setActiveCategory('all')}
        >
          전체
        </button>
        {availableCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={cn(
              'shrink-0 border-b-2 pb-1',
              activeCategory === category.id ? 'border-ink text-ink' : 'border-transparent text-muted',
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <section>
        {loading ? (
          <p className="py-8 text-sm text-muted">불러오는 중...</p>
        ) : filteredTests.length === 0 ? (
          <p className="py-8 text-sm text-muted">이 분류에는 테스트가 없어요.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">
            {filteredTests.map((test) => (
              <TestListCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  )
}
