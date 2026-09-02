import { useNavigate, useParams } from 'react-router-dom'
import { pixelCharacterPath } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import StickerCard from '../components/StickerCard'
import { getTest } from '../data'
import { ui } from '../lib/ui'

function EmptyState({ message, onAction, actionLabel }: { message: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-4xl">😵</p>
      <p className="text-[15px] text-muted">{message}</p>
      <button type="button" className={ui.btnSecondary} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

export default function TestDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const test = slug ? getTest(slug) : undefined

  if (!test) {
    return (
      <PageLayout backTo="/tests" backLabel="목록">
        <EmptyState message="테스트를 찾을 수 없어요" onAction={() => navigate('/tests')} actionLabel="목록으로" />
      </PageLayout>
    )
  }

  const estimatedMinutes = Math.max(1, Math.ceil(test.questions.length / 5))

  return (
    <PageLayout backTo="/tests" backLabel="목록">
      <header className="mb-6 text-center">
        <img
          src={pixelCharacterPath(test.thumbnailCharacter ?? 'adapted')}
          alt=""
          className="pixel-img mx-auto mb-3 h-24 w-24 object-contain"
        />
        <h1 className={ui.pageTitle}>{test.title}</h1>
        <p className={`${ui.pageDesc} mt-2`}>{test.description}</p>
      </header>

      <StickerCard className="mb-4 flex items-center justify-center gap-0 !p-4">
        {[
          { value: test.questions.length, label: '문항', emoji: '📝' },
          { value: estimatedMinutes, label: '분', emoji: '⏰' },
          { value: test.results.length, label: '결과', emoji: '🎭' },
        ].map((stat, index) => (
          <div key={stat.label} className="flex flex-1 items-center">
            {index > 0 ? <div className="h-10 w-px bg-gray-200" /> : null}
            <div className="flex flex-1 flex-col items-center gap-0.5">
              <span className="text-lg">{stat.emoji}</span>
              <span className="text-xl font-extrabold text-ink">{stat.value}</span>
              <span className="text-xs font-semibold text-muted">{stat.label}</span>
            </div>
          </div>
        ))}
      </StickerCard>

      <StickerCard soft className="mb-5 text-center text-sm leading-relaxed text-muted">
        정답 없어요~ 지금 기분 그대로 골라주세요 🫶
      </StickerCard>

      <button type="button" className={`${ui.btnPrimary} wiggle-hover`} onClick={() => navigate(`/tests/${test.id}/play`)}>
        시작하기! 🚀
      </button>
    </PageLayout>
  )
}
