import { useMemo, useState } from 'react'
import CategoryTabs, { type CategoryFilter } from '../components/CategoryTabs'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { useAllTests } from '../lib/useTests'
import { TEST_CATEGORIES } from '../lib/testCategories'
import { ui } from '../lib/ui'

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

      <CategoryTabs
        className="mb-2"
        categories={availableCategories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

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
