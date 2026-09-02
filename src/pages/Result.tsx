import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import ResultCard from '../components/ResultCard'
import { getTest } from '../data'
import { buildResultInsights } from '../lib/resultInsights'
import { getResult, getThresholdPercent } from '../lib/scoring'
import { saveTestResult } from '../lib/supabase'
import type { TestAnswers } from '../types/test'

import { ui } from '../lib/ui'

export default function Result() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const test = slug ? getTest(slug) : undefined
  const answers = (location.state as { answers?: TestAnswers } | null)?.answers

  useEffect(() => {
    if (!test || !answers) return

    const result = getResult(test, answers)
    const thresholdPercent = getThresholdPercent(test, answers)

    void saveTestResult({
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

  const thresholdPercent = getThresholdPercent(test, answers)
  const result = getResult(test, answers)
  const insights = buildResultInsights(test, answers, result.description)

  return (
    <PageLayout>
      <ResultCard
        result={result}
        thresholdPercent={thresholdPercent}
        insights={insights}
        testTitle={test.title}
        onHome={() => navigate('/')}
        onRetry={() => navigate(`/tests/${test.id}/play`)}
      />
    </PageLayout>
  )
}
