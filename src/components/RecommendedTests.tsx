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
  const { tests, loading } = useRecommendedTests(excludeTestId)

  if (!loading && tests.length === 0) return null

  return (
    <section className={`min-h-[420px] ${className}`}>
      <h2
        className={`text-[13px] font-bold ${
          theme === 'halloween' ? 'text-[#d9c9ef]' : 'text-muted'
        }`}
      >
        다른 테스트
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6">
        {tests.map((test) => (
          <TestListCard
            key={test.id}
            test={test}
            tone={theme === 'halloween' ? 'onDark' : 'default'}
          />
        ))}
      </div>
    </section>
  )
}
