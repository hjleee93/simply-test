import { Link } from 'react-router-dom'
import HomeTestCard from '../components/HomeTestCard'
import PageLayout from '../components/PageLayout'
import { pixelCharacterPath, pixelCharacterWebpPath } from '../lib/characters'
import { useAllTests, useFeaturedTests } from '../lib/useTests'

export default function Main() {
  const { tests: featuredTests, loading } = useFeaturedTests()
  const { tests: allTests } = useAllTests()
  const totalCount = allTests.length

  return (
    <PageLayout>
      <header className="pb-6 pt-3 text-left">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[26px] font-black leading-[1.25] tracking-tight text-ink">
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
              className="h-[88px] w-auto object-contain"
            />
          </picture>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          귀엽게 그려진 캐릭터가 숨겨진 성향을 알려줘요
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-[15px] font-bold text-ink">인기 테스트</h2>
        {loading && featuredTests.length === 0 ? (
          <p className="py-8 text-sm text-muted">불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
            {featuredTests.map((test) => (
              <HomeTestCard key={test.id} test={test} />
            ))}
          </div>
        )}
        {totalCount > 0 ? (
          <Link
            to="/tests"
            className="mt-3 flex h-12 items-center justify-center rounded-xl bg-white text-sm font-bold text-ink shadow-[0_2px_18px_-6px_rgba(31,21,53,0.12)]"
          >
            전체 테스트 보기 ({totalCount})
          </Link>
        ) : null}
      </section>
    </PageLayout>
  )
}
