import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { pixelCharacterPath } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import StickerCard from '../components/StickerCard'
import { getAllTests } from '../data'
import { ui } from '../lib/ui'

export default function TestList() {
  const tests = getAllTests()

  return (
    <PageLayout backTo="/" backLabel="홈">
      <PageMeta
        title="테스트 목록 | Simply Test"
        description="Simply Test에서 진행 중인 심리 테스트 목록을 확인해보세요."
      />
      <header className="mb-6 text-center">
        <p className="mb-2 text-3xl">📋</p>
        <h1 className={ui.pageTitle}>테스트 목록</h1>
        <p className={`${ui.pageDesc} mt-2`}>궁금한 거 골라보세요~</p>
      </header>

      <section className="space-y-4">
        {tests.map((test) => (
          <Link key={test.id} to={`/tests/${test.id}`} className="block wiggle-hover">
            <StickerCard className="flex items-center gap-3 !p-4">
              <img
                src={pixelCharacterPath('steel')}
                alt=""
                className="pixel-img h-14 w-14 shrink-0 object-contain"
              />
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 text-[17px] font-extrabold text-ink">{test.title}</h2>
                <p className="mb-2 text-sm leading-snug text-muted">{test.description}</p>
                <span className="rounded-md border border-ink bg-lemon px-2 py-0.5 text-xs font-bold text-ink">
                  {test.questions.length}문항
                </span>
              </div>
              <span className="text-xl text-accent">→</span>
            </StickerCard>
          </Link>
        ))}
      </section>
    </PageLayout>
  )
}
