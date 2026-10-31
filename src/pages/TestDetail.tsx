import { useNavigate, useParams } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import RecommendedTests from '../components/RecommendedTests'
import StickerCard from '../components/StickerCard'
import { AlertIcon, ClockIcon, DocumentIcon, LayersIcon } from '../components/icons'
import { useTest } from '../lib/useTests'
import { ui } from '../lib/ui'

function EmptyState({ message, onAction, actionLabel }: { message: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <AlertIcon className="h-10 w-10 text-muted" />
      <p className="text-[15px] text-muted">{message}</p>
      <button type="button" className={ui.btnSecondary} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

export default function TestDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { test, loading } = useTest(slug)

  if (loading) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <p className="py-12 text-center text-sm text-muted">불러오는 중...</p>
      </PageLayout>
    )
  }

  if (!test) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <EmptyState message="테스트를 찾을 수 없어요" onAction={() => navigate('/tests')} actionLabel="목록으로" />
      </PageLayout>
    )
  }

  const estimatedMinutes = Math.max(1, Math.ceil(test.questions.length / 5))
  const isHalloween = test.resultTemplate === 'halloween'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const thumbnailSrc = resolveCharacterImage(thumbnailChar)
  const thumbnailWebp = resolveCharacterWebp(thumbnailChar)

  return (
    <PageLayout
      backTo="/tests"
      backLabel="목록"
      theme={isHalloween ? 'halloween' : 'default'}
    >
      <header
        className={
          isHalloween
            ? 'relative mb-6 overflow-hidden rounded-2xl border-[3px] border-[#ff942f] bg-[#0b0525] px-5 pb-6 pt-5 text-center shadow-[0_7px_0_#542275]'
            : 'mb-6 text-center'
        }
      >
        {isHalloween ? (
          <>
            <img
              src={thumbnailSrc}
              alt=""
              aria-hidden
              width={160}
              height={160}
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-sm"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,5,37,0.18),rgba(11,5,37,0.96))]" />
          </>
        ) : null}

        <div className="relative">
          <picture>
            {thumbnailWebp ? <source srcSet={thumbnailWebp} type="image/webp" /> : null}
            <img
              src={thumbnailSrc}
              alt={`${test.title} 캐릭터`}
              width={288}
              height={288}
              className={`mx-auto object-cover ${
                isHalloween
                  ? 'mb-4 h-40 w-40 rounded-xl border-2 border-[#ffb247] shadow-[0_0_28px_rgba(255,148,47,0.35)]'
                  : 'mb-3 h-24 w-24 object-contain'
              }`}
            />
          </picture>
          {isHalloween ? (
            <span className="mb-3 inline-block rounded-full border border-[#ffb247] bg-[#ff942f]/20 px-3 py-1 text-xs font-bold text-[#ffd59a]">
              🎃 HALLOWEEN SPECIAL
            </span>
          ) : null}
          <h1 className={isHalloween ? 'text-[26px] font-bold leading-tight text-white' : ui.pageTitle}>
            {test.title}
          </h1>
          <p className={isHalloween ? 'mt-2 text-[15px] leading-relaxed text-[#d9c9ef]' : `${ui.pageDesc} mt-2`}>
            {test.description}
          </p>
        </div>
      </header>

      <StickerCard
        className={`mb-4 flex items-center justify-center gap-0 !p-4 ${
          isHalloween ? '!border-[#70439a] !bg-[#211044]' : ''
        }`}
      >
        {[
          { value: test.questions.length, label: '문항', Icon: DocumentIcon },
          { value: estimatedMinutes, label: '분', Icon: ClockIcon },
          { value: test.results.length, label: '결과', Icon: LayersIcon },
        ].map((stat, index) => (
          <div key={stat.label} className="flex flex-1 items-center">
            {index > 0 ? (
              <div className={`h-10 w-px ${isHalloween ? 'bg-[#70439a]' : 'bg-gray-200'}`} />
            ) : null}
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <stat.Icon
                className={`h-[18px] w-[18px] ${isHalloween ? 'text-[#ffb247]' : 'text-accent'}`}
              />
              <span
                className={`text-xl font-extrabold ${
                  isHalloween ? 'text-[#ffb247]' : 'text-ink'
                }`}
              >
                {stat.value}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isHalloween ? 'text-[#d9c9ef]' : 'text-muted'
                }`}
              >
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </StickerCard>

      <StickerCard
        soft
        className={`mb-5 text-center text-sm leading-relaxed ${
          isHalloween
            ? '!border-[#ff942f] !bg-[#2a1450] !text-[#eadff7]'
            : 'text-muted'
        }`}
      >
        정답 없어요~ 지금 기분 그대로 골라주세요
      </StickerCard>

      <button
        type="button"
        className={`${ui.btnPrimary} wiggle-hover ${
          isHalloween ? '!bg-[#f47721] hover:!bg-[#ff923f]' : ''
        }`}
        onClick={() => navigate(`/tests/${test.id}/play`)}
      >
        시작하기
        <span aria-hidden>→</span>
      </button>

      <RecommendedTests
        excludeTestId={test.id}
        className="mt-10"
        theme={isHalloween ? 'halloween' : 'default'}
      />
    </PageLayout>
  )
}
