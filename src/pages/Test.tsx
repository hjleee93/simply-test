import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import PageMeta from '../components/PageMeta'
import ProgressBar from '../components/ProgressBar'
import Question from '../components/Question'
import { getTest } from '../data'
import { ui } from '../lib/ui'
import type { ScoreMap, TestAnswers } from '../types/test'

export default function Test() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const test = slug ? getTest(slug) : undefined

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})

  const currentQuestion = test?.questions[currentIndex]
  const selectedAnswerId = currentQuestion
    ? answers[currentQuestion.id]?.answerId
    : undefined

  const progressCurrent = useMemo(() => {
    if (!test) return 0
    return Math.min(currentIndex + 1, test.questions.length)
  }, [currentIndex, test])

  if (!test || !currentQuestion) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-4xl">😵</p>
          <p className="text-[15px] text-muted">테스트를 찾을 수 없어요</p>
          <button type="button" className={ui.btnSecondary} onClick={() => navigate('/tests')}>
            목록으로
          </button>
        </div>
      </PageLayout>
    )
  }

  const handleSelect = (answerId: string, scores: ScoreMap) => {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: { answerId, scores },
    }
    setAnswers(nextAnswers)

    const isLast = currentIndex === test.questions.length - 1
    if (isLast) {
      navigate(`/tests/${test.id}/result`, { state: { answers: nextAnswers } })
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  const handlePrev = () => {
    if (currentIndex === 0) return
    setCurrentIndex((index) => index - 1)
  }

  return (
    <PageLayout backTo={`/tests/${test.id}`} backLabel="나가기">
      <PageMeta
        title={`${test.title} 진행 중 | Simply Test`}
        description={test.description}
      />
      <div className="flex flex-col gap-5">
        <ProgressBar current={progressCurrent} total={test.questions.length} />

        <Question
          question={currentQuestion}
          selectedAnswerId={selectedAnswerId}
          onSelect={handleSelect}
        />

        <button type="button" className={ui.btnGhost} onClick={handlePrev} disabled={currentIndex === 0}>
          ← 이전으로
        </button>
      </div>
    </PageLayout>
  )
}
