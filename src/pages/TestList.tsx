import PageLayout from '../components/PageLayout'
import TestListCard from '../components/TestListCard'
import { getAllTests } from '../data'
import { ui } from '../lib/ui'

export default function TestList() {
  const tests = getAllTests()

  return (
    <PageLayout backTo="/" backLabel="홈">
      <header className="mb-6 text-center">
        <p className="mb-2 text-3xl">📋</p>
        <h1 className={ui.pageTitle}>테스트 목록</h1>
        <p className={`${ui.pageDesc} mt-2`}>궁금한 거 골라보세요~</p>
      </header>

      <section className="space-y-4">
        {tests.map((test) => (
          <TestListCard key={test.id} test={test} showQuestionCount />
        ))}
      </section>
    </PageLayout>
  )
}
