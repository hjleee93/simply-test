import { Link } from 'react-router-dom'
import { pixelCharacterPath } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import StickerCard from '../components/StickerCard'
import { getAllTests } from '../data'
import { ui } from '../lib/ui'

export default function Main() {
  const tests = getAllTests()

  return (
    <PageLayout>
      <section className="pb-8 pt-4 text-center">
        <img
          src={pixelCharacterPath('subtle')}
          alt=""
          className="pixel-img mx-auto mb-4 h-32 w-32 object-contain"
        />
        <span className={ui.badge}>심리 테스트</span>
        <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink">
          나도 몰랐던
          <br />
          내 진짜 모습 🫠
        </h1>
        <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-relaxed text-muted">
          귀엽게 그려진 픽셀 캐릭터가
          <br />
          당신의 숨겨진 성향을 알려줘요
        </p>
        <Link className={`${ui.btnPrimary} mt-8 wiggle-hover`} to="/tests">
          테스트 하러 가기 ✨
        </Link>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-center text-sm font-extrabold text-muted">인기 테스트</h2>
        <div className="space-y-3">
          {tests.map((test) => (
            <Link key={test.id} to={`/tests/${test.id}`} className="block wiggle-hover">
              <StickerCard className="flex items-center gap-3 !p-4">
                <img
                  src={pixelCharacterPath(test.thumbnailCharacter ?? 'adapted')}
                  alt=""
                  className="pixel-img h-14 w-14 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1 text-left">
                  <p className="mb-1 text-[15px] font-extrabold text-ink">{test.title}</p>
                  <p className="text-sm leading-snug text-muted">{test.description}</p>
                </div>
                <span className="text-xl text-accent">→</span>
              </StickerCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-center text-sm font-extrabold text-muted">이런 분께 딱이에요</h2>
        <StickerCard className="!p-0 border-dashed border-lilac bg-lilac-soft">
          {[
            { emoji: '🎯', label: '자기 성향', value: '나도 몰랐던 내 모습이 궁금할 때' },
            { emoji: '⏱️', label: '3분 컷', value: '출퇴근길에 가볍게' },
            { emoji: '💬', label: '팩폭 환영', value: '위로 말고 솔직한 한마디' },
          ].map((item, index) => (
            <div
              key={item.label}
              className={
                index === 0
                  ? 'flex items-center gap-3 px-4 py-3.5'
                  : 'flex items-center gap-3 border-t-2 border-dashed border-lilac/50 px-4 py-3.5'
              }
            >
              <span className="text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-[#6a4fc8]">{item.label}</p>
                <p className="text-[15px] font-bold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </StickerCard>
      </section>
    </PageLayout>
  )
}
