import { useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryTabs, { type CategoryFilter } from '../components/CategoryTabs'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { pixelCharacterPath, pixelCharacterWebpPath } from '../lib/characters'
import { TEST_CATEGORIES } from '../lib/testCategories'
import { useAllTests, useFeaturedTests } from '../lib/useTests'

export default function Main() {
  const { tests: featuredTests, loading: featuredLoading } = useFeaturedTests()
  const { tests: allTests, loading: allLoading } = useAllTests()
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const totalCount = allTests.length

  const visibleTests =
    activeCategory === 'all'
      ? featuredTests
      : allTests.filter((test) => test.category === activeCategory)

  const loading = activeCategory === 'all' ? featuredLoading && featuredTests.length === 0 : allLoading

  return (
    <PageLayout>
      <header className="pb-6 pt-2">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-[22px] font-bold leading-snug tracking-tight text-ink">
            나도 몰랐던
            <br />
            내 진짜 모습
          </h1>
          <picture className="shrink-0">
            <source srcSet={pixelCharacterWebpPath('main_hero')!} type="image/webp" />
            <img
              src={pixelCharacterPath('main_hero')}
              alt="토끼, 곰, 강아지, 고양이, 여우가 함께 모여 있는 모습"
              width={1050}
              height={656}
              fetchPriority="high"
              className="h-16 w-auto object-contain"
            />
          </picture>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          캐릭터가 숨겨진 성향을 알려줘요
        </p>
      </header>

      <CategoryTabs
        categories={TEST_CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
        allLabel="인기"
      />

      <section>
        {loading ? (
          <p className="py-8 text-sm text-muted">불러오는 중...</p>
        ) : visibleTests.length === 0 ? (
          <p className="py-8 text-sm text-muted">이 분류에는 테스트가 없어요.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">
            {visibleTests.map((test) => (
              <TestListCard key={test.id} test={test} />
            ))}
          </div>
        )}
        {activeCategory === 'all' && totalCount > 0 ? (
          <Link to="/tests" className="mt-4 inline-block text-sm font-bold text-ink">
            전체 {totalCount}개
          </Link>
        ) : null}
      </section>
    </PageLayout>
  )
}
