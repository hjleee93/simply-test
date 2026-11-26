import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import CategoryTabs, { type CategoryFilter } from '../components/CategoryTabs'
import PageLayout from '../components/PageLayout'
import SpotlightCard from '../components/SpotlightCard'
import TestListCard from '../components/TestListCard'
import TestRankRow from '../components/TestRankRow'
import { pixelCharacterPath, pixelCharacterWebpPath } from '../lib/characters'
import { TEST_CATEGORIES } from '../lib/testCategories'
import { rankByTrending } from '../lib/trending'
import { ui } from '../lib/ui'
import { useHomeTests } from '../lib/useTests'

const NEW_SHELF_LIMIT = 6
const TRENDING_LIMIT = 5
const CATEGORY_GRID_LIMIT = 6

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-[17px] font-bold tracking-tight text-ink">{title}</h2>
      {action}
    </div>
  )
}

export default function Main() {
  const { tests, loading } = useHomeTests()
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  // tests는 공개 최신순으로 온다.
  const spotlight = tests[0]
  const newShelf = useMemo(() => tests.slice(1, 1 + NEW_SHELF_LIMIT), [tests])
  const trending = useMemo(() => rankByTrending(tests).slice(0, TRENDING_LIMIT), [tests])
  const hasViewData = tests.some((test) => (test.viewCount ?? 0) > 0)

  const availableCategories = useMemo(
    () => TEST_CATEGORIES.filter((category) => tests.some((test) => test.category === category.id)),
    [tests],
  )
  // '전체' 탭은 위 섹션(스포트라이트·신규·인기)에 이미 나온 테스트를 빼고 보여준다.
  const shownAbove = useMemo(
    () => new Set([...tests.slice(0, 1 + NEW_SHELF_LIMIT), ...(hasViewData ? trending : [])].map((test) => test.id)),
    [tests, trending, hasViewData],
  )
  const categoryTests = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? tests.filter((test) => !shownAbove.has(test.id))
        : tests.filter((test) => test.category === activeCategory)
    return filtered.slice(0, CATEGORY_GRID_LIMIT)
  }, [tests, activeCategory, shownAbove])

  if (loading && tests.length === 0) {
    return (
      <PageLayout>
        <p className="py-12 text-center text-sm text-muted">불러오는 중...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <header className="flex items-end justify-between gap-4 pb-4 pt-1">
        <div>
          <p className="text-[13px] font-bold text-accent">캐릭터가 알려주는 숨은 성향</p>
          <h1 className="mt-0.5 text-[22px] font-bold leading-snug tracking-tight text-ink">
            나도 몰랐던 내 진짜 모습
          </h1>
        </div>
        <picture className="shrink-0">
          <source srcSet={pixelCharacterWebpPath('main_hero')!} type="image/webp" />
          <img
            src={pixelCharacterPath('main_hero')}
            alt="토끼, 곰, 강아지, 고양이, 여우가 함께 모여 있는 모습"
            width={1050}
            height={656}
            className="h-12 w-auto object-contain"
          />
        </picture>
      </header>

      {spotlight ? <SpotlightCard test={spotlight} /> : null}

      {newShelf.length > 0 ? (
        <section className="mt-10">
          <SectionHeader title="새로 나왔어요" />
          <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {newShelf.map((test) => (
              <div key={test.id} className="w-[148px] shrink-0 snap-start">
                <TestListCard test={test} showNewBadge />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasViewData && trending.length > 0 ? (
        <section className="mt-10">
          <SectionHeader
            title="지금 인기 TOP 5"
            action={<span className="text-[12px] text-muted">일평균 조회 기준</span>}
          />
          <ol className="divide-y divide-ink/5 rounded-2xl border border-ink/10 bg-white px-3">
            {trending.map((test, index) => (
              <li key={test.id}>
                <TestRankRow test={test} rank={index + 1} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-10">
        <SectionHeader title="주제별로 골라보기" />
        <CategoryTabs
          categories={availableCategories}
          active={activeCategory}
          onChange={setActiveCategory}
          allLabel="전체"
        />
        {categoryTests.length === 0 ? (
          <p className="py-8 text-sm text-muted">이 분류에는 테스트가 없어요.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">
            {categoryTests.map((test) => (
              <TestListCard key={test.id} test={test} showNewBadge />
            ))}
          </div>
        )}
        <Link to="/tests" className={`${ui.btnSecondary} mt-6`}>
          전체 테스트 {tests.length}개 보기
        </Link>
      </section>
    </PageLayout>
  )
}
