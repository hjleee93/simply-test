import { useRecommendedTests } from '../lib/useTests'
import TestListCard from './TestListCard'

interface RecommendedTestsProps {
  excludeTestId: string
  className?: string
  theme?: 'default' | 'halloween'
}

export default function RecommendedTests({
  excludeTestId,
  className = '',
  theme = 'default',
}: RecommendedTestsProps) {
  const { tests } = useRecommendedTests(excludeTestId)

  if (tests.length === 0) return null

  return (
    <section className={className}>
      <h2
        className={`mb-3 text-center text-sm font-extrabold ${
          theme === 'halloween' ? 'text-[#d9c9ef]' : 'text-muted'
        }`}
      >
        다른 테스트도 해보세요
      </h2>
      <div className="space-y-3">
        {tests.map((test) => (
          <TestListCard key={test.id} test={test} />
        ))}
      </div>
    </section>
  )
}
