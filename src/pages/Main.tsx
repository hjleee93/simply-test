import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { pixelCharacterPath, pixelCharacterWebpPath } from '../lib/characters'
import { useAllTests, useFeaturedTests } from '../lib/useTests'

export default function Main() {
  const { tests: featuredTests, loading } = useFeaturedTests()
  const { tests: allTests } = useAllTests()
  const totalCount = allTests.length

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

      <section>
        <h2 className="text-[13px] font-bold text-muted">인기 테스트</h2>
        {loading && featuredTests.length === 0 ? (
          <p className="py-8 text-sm text-muted">불러오는 중...</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6">
            {featuredTests.map((test) => (
              <TestListCard key={test.id} test={test} />
            ))}
          </div>
        )}
        {totalCount > 0 ? (
          <Link to="/tests" className="mt-4 inline-block text-sm font-bold text-ink">
            전체 {totalCount}개
          </Link>
        ) : null}
      </section>
    </PageLayout>
  )
}
