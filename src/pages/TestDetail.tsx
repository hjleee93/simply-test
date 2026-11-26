import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'
import { getPlayQuestionCount } from '../lib/questionSample'
import { trackTestStart } from '../lib/analytics'
import PageLayout from '../components/PageLayout'
import RecommendedTests from '../components/RecommendedTests'
import TestShareActions from '../components/TestShareActions'
import { AlertIcon } from '../components/icons'
import { formatCount, VIEW_COUNT_DISPLAY_MIN } from '../lib/trending'
import { useTest, useViewCount } from '../lib/useTests'
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
  const viewCount = useViewCount(slug)

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
              ? 'relative mb-6 overflow-hidden rounded-md border border-[#ff942f] bg-[#0b0525] px-4 pb-5 pt-4 text-center'
              : 'mb-5'
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
            {isHalloween ? (
              <picture>
                {thumbnailWebp ? <source srcSet={thumbnailWebp} type="image/webp" /> : null}
                <img
                  src={thumbnailSrc}
                  alt={`${test.title} 캐릭터`}
                  width={288}
                  height={288}
                  className="mx-auto mb-3 h-36 w-36 object-contain"
                />
              </picture>
            ) : (
              <div className="mx-auto mb-4 flex aspect-square w-full max-h-[360px] items-center justify-center overflow-hidden rounded-md bg-transparent">
                <picture className="h-full w-full">
                  {thumbnailWebp ? <source srcSet={thumbnailWebp} type="image/webp" /> : null}
                  <img
                    src={thumbnailSrc}
                    alt={`${test.title} 캐릭터`}
                    width={288}
                    height={288}
                    className="h-full w-full object-contain"
                  />
                </picture>
              </div>
            )}
            {isHalloween ? (
              <span className="mb-3 inline-block rounded-full border border-[#ffb247] bg-[#ff942f]/20 px-3 py-1 text-xs font-bold text-[#ffd59a]">
                🎃 HALLOWEEN SPECIAL
              </span>
            ) : null}
            <h1 className={isHalloween ? 'text-[22px] font-bold leading-snug text-white' : ui.pageTitle}>
              {test.title}
            </h1>
            <p className={isHalloween ? 'mt-2 text-[15px] leading-relaxed text-[#d9c9ef]' : `${ui.pageDesc} mt-2`}>
              {test.description}
            </p>
            <p className={`mt-3 text-[13px] font-bold ${isHalloween ? 'text-[#ffd59a]' : 'text-muted'}`}>
              {questionCount}문항 · 약 {estimatedMinutes}분 · 결과 {test.results.length}개
            </p>
            {viewCount !== null && viewCount >= VIEW_COUNT_DISPLAY_MIN ? (
              <p
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold ${
                  isHalloween ? 'bg-white/10 text-[#ffd59a]' : 'bg-accent-soft text-accent'
                }`}
              >
                지금까지 {formatCount(viewCount)}명이 봤어요
              </p>
            ) : null}
          </div>
        </header>
      )}
      <button
        type="button"
        className={`${ui.btnPrimary} ${
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
