import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MemeResultCard from '../components/MemeResultCard'
import PageLayout from '../components/PageLayout'
import PageMeta from '../components/PageMeta'
import RecommendedTests from '../components/RecommendedTests'
import ResultView from '../components/ResultView'
import { useTest } from '../lib/useTests'
import { applyGenderToResult } from '../lib/gender'
import { buildResultModel } from '../lib/resultView'
import { getResult, getThresholdPercent } from '../lib/scoring'
import { resolveTestSession } from '../lib/testSession'
import { fetchResultPeerPercent } from '../lib/resultPeer'
import { saveTestResult } from '../lib/supabase'
import { getVisitorId } from '../lib/visitorId'
import { trackTestComplete } from '../lib/analytics'
import type { Gender, TestAnswers } from '../types/test'

import { getTestOgImageMeta } from '../lib/ogImages'
import { AlertIcon } from '../components/icons'
import { ui } from '../lib/ui'

type ResultLocationState = {
  answers?: TestAnswers
  gender?: Gender
}

export default function Result() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { test, loading } = useTest(slug)
  const locationState = location.state as ResultLocationState | null

  const session = useMemo(() => {
    if (!test) return null
    return resolveTestSession(test, locationState, location.search)
  }, [test, locationState, location.search])

  const answers = session?.answers
  const gender = session?.gender

  const savedKeyRef = useRef<string | null>(null)
  const savePromiseRef = useRef<Promise<void> | null>(null)
  const [peerPercent, setPeerPercent] = useState<number | null>(null)

  useEffect(() => {
    if (!test || !answers) return

    const result = getResult(test, answers)
    const thresholdPercent = getThresholdPercent(test, answers)
    const savedKey = `${test.id}:${result.id}:${thresholdPercent}`

    let active = true
    setPeerPercent(null)

    if (savedKeyRef.current !== savedKey) {
      savedKeyRef.current = savedKey
      trackTestComplete(test.id, result.id)
      savePromiseRef.current = saveTestResult({
        visitorId: getVisitorId(),
        testSlug: test.id,
        resultId: result.id,
        score: thresholdPercent,
      })
    }

    void (async () => {
      await savePromiseRef.current
      const percent = await fetchResultPeerPercent(test.id, result.id)
      if (active) setPeerPercent(percent)
    })()

    return () => {
      active = false
    }
  }, [answers, test])

  if (loading) {
    return (
      <PageLayout>
        <p className="py-12 text-center text-sm text-muted">불러오는 중...</p>
      </PageLayout>
    )
  }

  if (!test || !answers) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <p className="text-[15px] text-muted">결과가 사라졌어요…</p>
          <button type="button" className={ui.btnPrimary} onClick={() => navigate(`/tests/${test?.id ?? ''}/play`)}>
            다시 테스트하기
          </button>
        </div>
      </PageLayout>
    )
  }

  if (test.requiresGender && !gender) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <p className="text-[15px] text-muted">성별 정보가 없어요. 다시 테스트해주세요.</p>
          <button type="button" className={ui.btnPrimary} onClick={() => navigate(`/tests/${test.id}/play`)}>
            다시 테스트하기
          </button>
        </div>
      </PageLayout>
    )
  }

  const thresholdPercent = getThresholdPercent(test, answers)
  const baseResult = getResult(test, answers)
  const result =
    test.requiresGender && gender ? applyGenderToResult(baseResult, gender) : baseResult
  const resultLabel = test.resultLabel ?? '결과'
  const model = buildResultModel({
    test,
    result,
    answers,
    percent: thresholdPercent,
    resultLabel,
  })

  let resultCard: ReactNode
  if (test.resultTemplate === 'meme') {
    const answeredCount = Object.keys(answers).length
    resultCard = (
      <MemeResultCard
        result={result}
        thresholdPercent={thresholdPercent}
        answeredCount={answeredCount}
        testTitle={test.title}
        testId={test.id}
        resultLabel={resultLabel}
        onHome={() => navigate('/')}
        onRetry={() => navigate(`/tests/${test.id}/play`)}
        peerPercent={peerPercent}
      />
    )
  } else {
    resultCard = (
      <ResultView
        result={result}
        testTitle={test.title}
        testId={test.id}
        header={model.header}
        blocks={model.blocks}
        shareText={model.shareText}
        shareTitle={model.shareTitle}
        peerPercent={peerPercent}
        onHome={() => navigate('/')}
        onRetry={() => navigate(`/tests/${test.id}/play`)}
      />
    )
  }

  const ogImage = getTestOgImageMeta(test.thumbnailCharacter, test.id, {
    image: test.ogImage,
    width: test.ogImageWidth,
    height: test.ogImageHeight,
    alt: test.title,
  })

  return (
    <PageLayout
      theme={model.theme}
    >
      <PageMeta
        title={model.pageTitle}
        description={model.pageDescription}
        imagePath={ogImage.image}
        imageWidth={ogImage.width}
        imageHeight={ogImage.height}
        imageAlt={ogImage.alt}
        type="article"
        noindex
        canonicalPath={`/tests/${test.id}`}
      />
      <h1 className="sr-only">{result.title} — {test.title} 결과</h1>
      {resultCard}
      <RecommendedTests
        excludeTestId={test.id}
        className="mt-8"
        theme={model.theme === 'halloween' ? 'halloween' : 'default'}
      />
    </PageLayout>
  )
}
