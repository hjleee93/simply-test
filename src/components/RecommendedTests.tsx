import { getRecommendedTests } from '../data'
import TestListCard from './TestListCard'

interface RecommendedTestsProps {
  excludeTestId: string
  className?: string
}

export default function RecommendedTests({ excludeTestId, className = '' }: RecommendedTestsProps) {
  const tests = getRecommendedTests(excludeTestId)

  if (tests.length === 0) return null

  return (
    <section className={className}>
      <h2 className="mb-3 text-center text-sm font-extrabold text-muted">추천 심리 테스트</h2>
      <div className="space-y-3">
        {tests.map((test) => (
          <TestListCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  )
}
