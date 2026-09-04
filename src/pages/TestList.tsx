import { useMemo, useState } from 'react'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { getAllTests } from '../data'
import { cn } from '../lib/cn'
import { TEST_CATEGORIES } from '../lib/testCategories'
import { ui } from '../lib/ui'
import type { TestCategoryId } from '../types/test'

type CategoryFilter = TestCategoryId | 'all'

export default function TestList() {
  const tests = getAllTests()
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
      <header className="mb-6 text-center">
        <p className="mb-2 text-3xl">📋</p>
        <h1 className={ui.pageTitle}>테스트 목록</h1>
        <p className={`${ui.pageDesc} mt-2`}>궁금한 거 골라보세요~</p>
      </header>

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className={cn(
            'rounded-full border-2 border-ink px-3.5 py-1.5 text-[13px] font-bold transition-colors',
            activeCategory === 'all'
              ? 'bg-ink text-white'
              : 'bg-white text-ink hover:bg-cream-dark',
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
              'rounded-full border-2 border-ink px-3.5 py-1.5 text-[13px] font-bold transition-colors',
              activeCategory === category.id
                ? 'bg-ink text-white'
                : 'bg-white text-ink hover:bg-cream-dark',
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.emoji} {category.label}
          </button>
        ))}
      </div>

      <section className="space-y-4">
        {filteredTests.map((test) => (
          <TestListCard key={test.id} test={test} showQuestionCount />
        ))}
      </section>
    </PageLayout>
  )
}
