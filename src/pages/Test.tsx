import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GenderSelector from '../components/GenderSelector'
import PageLayout from '../components/PageLayout'
import ProgressBar from '../components/ProgressBar'
import Question from '../components/Question'
import type { AnswerSelection } from '../components/Question'
import { getTest } from '../data'
import {
  encodeSessionToSearchParams,
  saveTestSession,
  type TestSession,
} from '../lib/testSession'
import { ui } from '../lib/ui'
import type { Gender, TestAnswers } from '../types/test'

export default function Test() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const test = slug ? getTest(slug) : undefined

  const [gender, setGender] = useState<Gender | undefined>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})

  const requiresGender = test?.requiresGender ?? false
  const showGenderStep = requiresGender && !gender

  const currentQuestion = test?.questions[currentIndex]
  const selectedAnswerId = currentQuestion
    ? answers[currentQuestion.id]?.answerId
    : undefined

  const progressCurrent = useMemo(() => {
    if (!test) return 0
    if (showGenderStep) return 0
    return Math.min(currentIndex + 1, test.questions.length)
  }, [currentIndex, showGenderStep, test])

  const progressTotal = useMemo(() => {
    if (!test) return 0
    return test.questions.length
  }, [test])

  if (!test || (!showGenderStep && !currentQuestion)) {
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

  const handleSelect = (answerId: string, data: AnswerSelection) => {
    if (!currentQuestion) return

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: { answerId, ...data },
    }
    setAnswers(nextAnswers)

    const isLast = currentIndex === test.questions.length - 1
    if (isLast) {
      const session: TestSession = { answers: nextAnswers, gender }
      saveTestSession(test.id, session)

      const query = encodeSessionToSearchParams(session, test)
      const resultPath = query
        ? `/tests/${test.id}/result?${query}`
        : `/tests/${test.id}/result`

      navigate(resultPath, {
        state: session,
        replace: true,
      })
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  const handlePrev = () => {
    if (currentIndex === 0) {
      if (requiresGender) setGender(undefined)
      return
    }
    setCurrentIndex((index) => index - 1)
  }

  return (
    <PageLayout backTo={`/tests/${test.id}`} backLabel="나가기">
      <div className="flex flex-col gap-5">
        <ProgressBar current={progressCurrent} total={progressTotal} />

        {showGenderStep ? (
          <GenderSelector
            selected={gender}
            onSelect={(value) => {
              setGender(value)
            }}
          />
        ) : (
          <>
            <Question
              question={currentQuestion!}
              selectedAnswerId={selectedAnswerId}
              onSelect={handleSelect}
            />

            <button
              type="button"
              className={ui.btnGhost}
              onClick={handlePrev}
              disabled={currentIndex === 0 && !requiresGender}
            >
              ← 이전으로
            </button>
          </>
        )}
      </div>
    </PageLayout>
  )
}
