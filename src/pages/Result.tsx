import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GenderResultCard from '../components/GenderResultCard'
import PageLayout from '../components/PageLayout'
import PageMeta from '../components/PageMeta'
import ResultCard from '../components/ResultCard'
import { getTest } from '../data'
import { applyGenderToResult, buildGenderInsights } from '../lib/gender'
import { buildResultInsights } from '../lib/resultInsights'
import { getResult, getThresholdPercent, isSimpleScoring } from '../lib/scoring'
import { resolveTestSession } from '../lib/testSession'
import { saveTestResult } from '../lib/supabase'
import { getVisitorId } from '../lib/visitorId'
import type { Gender, TestAnswers } from '../types/test'

import { ui } from '../lib/ui'

type ResultLocationState = {
  answers?: TestAnswers
  gender?: Gender
}

export default function Result() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const test = slug ? getTest(slug) : undefined
  const locationState = location.state as ResultLocationState | null

  const session = useMemo(() => {
    if (!test) return null
    return resolveTestSession(test, locationState, location.search)
  }, [test, locationState, location.search])

  const answers = session?.answers
  const gender = session?.gender

  useEffect(() => {
    if (!test || !answers) return

    const result = getResult(test, answers)
    const thresholdPercent = getThresholdPercent(test, answers)

    void saveTestResult({
      visitorId: getVisitorId(),
      testSlug: test.id,
      resultId: result.id,
      score: thresholdPercent,
    })
  }, [answers, test])

  if (!test || !answers) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-4xl">🫠</p>
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
          <p className="text-4xl">🫠</p>
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
  const isGenderTest = isSimpleScoring(test)

  if (isGenderTest) {
    const genderInsights = buildGenderInsights(thresholdPercent)

    return (
      <PageLayout>
        <PageMeta
          title={`${resultLabel} ${thresholdPercent}% · ${result.title} | Simply Test`}
          description={`나의 ${resultLabel}는 ${thresholdPercent}%! ${result.title} (${result.keyword})`}
          type="article"
        />
        <GenderResultCard
          result={result}
          thresholdPercent={thresholdPercent}
          insights={genderInsights}
          testTitle={test.title}
          resultLabel={resultLabel}
          onHome={() => navigate('/')}
          onRetry={() => navigate(`/tests/${test.id}/play`)}
        />
      </PageLayout>
    )
  }

  const insights = buildResultInsights(test, answers, result.description)

  return (
    <PageLayout>
      <PageMeta
        title={`${resultLabel} ${thresholdPercent}% · ${result.title} | Simply Test`}
        description={`나의 ${resultLabel}는 ${thresholdPercent}%! ${result.title} (${insights.subtype})`}
        type="article"
      />
      <ResultCard
        result={result}
        thresholdPercent={thresholdPercent}
        insights={insights}
        testTitle={test.title}
        resultLabel={resultLabel}
        onHome={() => navigate('/')}
        onRetry={() => navigate(`/tests/${test.id}/play`)}
      />
    </PageLayout>
  )
}
