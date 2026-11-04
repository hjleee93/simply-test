import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GenderSelector from '../components/GenderSelector'
import { AlertIcon } from '../components/icons'
import PageLayout from '../components/PageLayout'
import ProgressBar from '../components/ProgressBar'
import Question from '../components/Question'
import type { AnswerSelection } from '../components/Question'
import { pickPlayQuestions } from '../lib/questionSample'
import { useTest } from '../lib/useTests'
import {
  encodeSessionToSearchParams,
  saveTestSession,
  type TestSession,
} from '../lib/testSession'
import { ui } from '../lib/ui'
import type { Gender, Question as QuestionType, TestAnswers } from '../types/test'

export default function Test() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { test, loading } = useTest(slug)

  const [gender, setGender] = useState<Gender | undefined>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [playQuestions, setPlayQuestions] = useState<{
    testId: string
    questions: QuestionType[]
  } | null>(null)

  useEffect(() => {
    if (!test) return
    setPlayQuestions((current) => {
      if (current?.testId === test.id) return current
      return { testId: test.id, questions: pickPlayQuestions(test) }
    })
  }, [test])

  const requiresGender = test?.requiresGender ?? false
  const showGenderStep = requiresGender && !gender
  const questions =
    test && playQuestions?.testId === test.id ? playQuestions.questions : null

  const currentQuestion = questions?.[currentIndex]
  const selectedAnswerId = currentQuestion
    ? answers[currentQuestion.id]?.answerId
    : undefined

  const progressCurrent = useMemo(() => {
    if (!test) return 0
    if (showGenderStep) return 0
    return Math.min(currentIndex + 1, questions?.length ?? 0)
  }, [currentIndex, questions, showGenderStep, test])

  const progressTotal = questions?.length ?? 0

  if (loading || (test && !questions)) {
    return (
      <PageLayout backTo="/tests" backLabel="나가기">
        <p className="py-12 text-center text-sm text-muted">불러오는 중...</p>
      </PageLayout>
    )
  }

  if (!test || (!showGenderStep && !currentQuestion)) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
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

    const isLast = currentIndex === (questions?.length ?? 0) - 1
    if (isLast) {
      const session: TestSession = {
        answers: nextAnswers,
        gender,
        questionIds: questions?.map((question) => question.id),
      }
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

  const isHalloween = test.resultTemplate === 'halloween'
  const isMeme = test.resultTemplate === 'meme'
  const pageTheme = isHalloween ? 'halloween' : isMeme ? 'meme' : 'default'

  return (
    <PageLayout
      backTo={`/tests/${test.id}`}
      backLabel="나가기"
      theme={pageTheme}
    >
      <div className="flex flex-col gap-5">
        <ProgressBar
          current={progressCurrent}
          total={progressTotal}
          theme={pageTheme}
        />

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
              theme={pageTheme}
              questionNumber={progressCurrent}
            />

            <button
              type="button"
              className={`${ui.btnGhost} ${
                isHalloween
                  ? '!border-[#70439a] !bg-[#211044] !text-[#d9c9ef] hover:!border-[#ff942f] hover:!text-white'
                  : isMeme
                    ? '!rounded-sm !border-ink/40 !text-ink hover:!border-ink hover:!bg-white'
                    : ''
              }`}
              onClick={handlePrev}
              disabled={currentIndex === 0 && !requiresGender}
            >
              ← 이전 문제
            </button>
          </>
        )}
      </div>
    </PageLayout>
  )
}
