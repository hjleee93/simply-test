import { Link } from 'react-router-dom'
import { pixelCharacterPath, pixelCharacterWebpPath } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { ChatIcon, ClockIcon, TargetIcon } from '../components/icons'
import { MAIN_PAGE_TEST_LIMIT } from '../data'
import { useAllTests, useFeaturedTests } from '../lib/useTests'

export default function Main() {
  const { tests: featuredTests } = useFeaturedTests()
  const { tests: allTests } = useAllTests()
  const totalCount = allTests.length
  const hasMoreTests = totalCount > MAIN_PAGE_TEST_LIMIT

  return (
    <PageLayout>
      <section className="hero-enter pb-10 pt-6 text-center">
        <div className="hero-stage mx-auto mb-2 flex h-60 items-center justify-center">
          <picture>
            <source srcSet={pixelCharacterWebpPath('main_hero')!} type="image/webp" />
            <img
              src={pixelCharacterPath('main_hero')}
              alt="토끼, 곰, 강아지, 고양이, 여우가 함께 모여 있는 모습"
              width={769}
              height={480}
              fetchPriority="high"
              className="hero-float h-full w-auto object-contain drop-shadow-[0_18px_22px_rgba(31,21,53,0.18)]"
            />
          </picture>
        </div>
        <span className="inline-flex items-center rounded-full bg-accent-soft px-3.5 py-1.5 text-[13px] font-bold text-accent-hover">
          심리 테스트
        </span>
        <h1 className="mt-5 text-[30px] font-black leading-[1.25] tracking-tight text-ink">
          나도 몰랐던
          <br />
          내 진짜 모습
        </h1>
        <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-relaxed text-muted">
          귀엽게 그려진 캐릭터가
          <br />
          당신의 숨겨진 성향을 알려줘요
        </p>
        <Link
          to="/tests"
          className="mx-auto mt-8 flex h-14 w-full max-w-[280px] items-center justify-center gap-1.5 rounded-full bg-accent px-6 text-base font-bold text-white shadow-[0_10px_24px_-6px_rgba(224,82,124,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0"
        >
          테스트 하러 가기
          <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-center text-sm font-extrabold text-muted">인기 테스트</h2>
        <div className="space-y-3">
          {featuredTests.map((test) => (
            <TestListCard key={test.id} test={test} />
          ))}
        </div>
        {hasMoreTests ? (
          <Link
            to="/tests"
            className="mt-4 block text-center text-sm font-bold text-accent underline-offset-2 hover:underline"
          >
            전체 테스트 보기 ({totalCount}개) →
          </Link>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 text-center text-sm font-extrabold text-muted">이런 분께 딱이에요</h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_18px_-6px_rgba(31,21,53,0.14)]">
          {[
            {
              Icon: TargetIcon,
              label: '자기 성향',
              value: '나도 몰랐던 내 모습이 궁금할 때',
              tone: 'bg-accent-soft text-accent-hover',
            },
            {
              Icon: ClockIcon,
              label: '3분 컷',
              value: '출퇴근길에 가볍게',
              tone: 'bg-clay/15 text-clay',
            },
            {
              Icon: ChatIcon,
              label: '팩폭 환영',
              value: '위로 말고 솔직한 한마디',
              tone: 'bg-mist/20 text-mist',
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index !== 0 ? 'border-t border-ink/[0.07]' : ''
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.tone}`}
              >
                <item.Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-muted">{item.label}</p>
                <p className="text-[15px] font-bold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
