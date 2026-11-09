import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { trackTestStart } from '../lib/analytics'
import PageLayout from '../components/PageLayout'
import RecommendedTests from '../components/RecommendedTests'
import StickerCard from '../components/StickerCard'
import TestShareActions from '../components/TestShareActions'
import { AlertIcon, ClockIcon, DocumentIcon, LayersIcon } from '../components/icons'
import { useTest } from '../lib/useTests'
import { incrementTestView } from '../lib/supabase'
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

  useEffect(() => {
    if (!test) return
    void incrementTestView(test.id)
  }, [test])

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

  const questionCount = getPlayQuestionCount(test.id, test.questions.length)
  const estimatedMinutes = Math.max(1, Math.ceil(questionCount / 10))
  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const pageTheme = isHalloween ? 'halloween' : isMeme ? 'meme' : 'default'
  const thumbnailChar = test.thumbnailCharacter ?? 'adapted'
  const thumbnailSrc = resolveCharacterImage(thumbnailChar)
  const thumbnailWebp = resolveCharacterWebp(thumbnailChar)

  return (
    <PageLayout
      backTo="/tests"
      backLabel="목록"
      theme={pageTheme}
    >
      {isMeme ? (
        <header className="relative mb-5 border-2 border-ink bg-[#f7f3ea] px-4 pb-5 pt-4 text-center">
          <span className="meme-stamp">
            올해
            <br />
            특집
          </span>
          <span className="mb-3 inline-block bg-ink px-2 py-1 text-[11px] font-bold tracking-wide text-white">
            올해 유행어
          </span>
          <picture>
            {thumbnailWebp ? <source srcSet={thumbnailWebp} type="image/webp" /> : null}
            <img
              src={thumbnailSrc}
              alt={`${test.title} 캐릭터`}
              width={288}
              height={288}
              className="mx-auto mb-3 object-contain"
            />
          </picture>
          <h1 className="text-[28px] font-black leading-tight text-ink">{test.title}</h1>
          <p className="mt-3 text-left text-[15px] font-bold leading-relaxed text-[#3f3a34]">
            {test.description}
          </p>
          <div className="mt-4 grid grid-cols-3 border-2 border-ink bg-white text-center text-xs font-bold">
            <div className="border-r-2 border-ink px-2 py-2">
              <p className="text-[11px] text-[#5c564e]">문제</p>
              <p className="text-lg font-black text-ink">{questionCount}</p>
            </div>
            <div className="border-r-2 border-ink px-2 py-2">
              <p className="text-[11px] text-[#5c564e]">예상 시간</p>
              <p className="text-lg font-black text-ink">약 {estimatedMinutes}분</p>
            </div>
            <div className="px-2 py-2">
              <p className="text-[11px] text-[#5c564e]">결과</p>
              <p className="text-lg font-black text-ink">{test.results.length}등급</p>
            </div>
          </div>
        </header>
      ) : (
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
                className='mx-auto object-cover '
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
      )}

      {!isMeme ? (
        <StickerCard
          className={`mb-4 flex items-center justify-center gap-0 !p-4 ${
            isHalloween ? '!border-[#70439a] !bg-[#211044]' : ''
          }`}
        >
          {[
            { value: questionCount, label: '문항', Icon: DocumentIcon },
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
      ) : null}

      <div
        className={`mb-5 text-center text-sm font-bold leading-relaxed ${
          isMeme
            ? 'border border-dashed border-ink/40 bg-white/70 px-4 py-3 text-[#3f3a34]'
            : isHalloween
              ? 'rounded-2xl border border-[#ff942f] bg-[#2a1450] px-4 py-3 text-[#eadff7]'
              : 'rounded-2xl bg-accent-soft/60 px-4 py-3 text-muted'
        }`}
      >
        {isMeme
          ? '○는 알고 있음, ×는 모름. 설명 듣고 아는 척은 금지.'
          : '정답 없어요~ 지금 기분 그대로 골라주세요'}
      </div>

      <button
        type="button"
        className={`${ui.btnPrimary} wiggle-hover ${
          isHalloween
            ? '!bg-[#f47721] hover:!bg-[#ff923f]'
            : isMeme
              ? '!rounded-sm !bg-ink hover:!bg-[#333]'
              : ''
        }`}
        onClick={() => {
          trackTestStart(test.id)
          navigate(`/tests/${test.id}/play`)
        }}
      >
        {isMeme ? '문제 풀기' : '시작하기'}
        <span aria-hidden>→</span>
      </button>

      <div className="mt-4">
        <TestShareActions testId={test.id} title={test.title} description={test.description} />
      </div>

      <RecommendedTests
        excludeTestId={test.id}
        className="mt-10"
        theme={isHalloween ? 'halloween' : 'default'}
      />
    </PageLayout>
  )
}
