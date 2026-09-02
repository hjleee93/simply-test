import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { pixelCharacterPath } from '../lib/characters'
import PageLayout from '../components/PageLayout'
import StickerCard from '../components/StickerCard'
import { ui } from '../lib/ui'

export default function Main() {
  return (
    <PageLayout>
      <PageMeta />
      <section className="pb-8 pt-4 text-center">
        <img
          src={pixelCharacterPath('adapted')}
          alt=""
          className="pixel-img mx-auto mb-4 h-32 w-32 object-contain"
        />
        <span className={ui.badge}>심리 테스트</span>
        <h1 className="mt-4 text-[28px] font-bold leading-tight text-ink">
          나도 몰랐던
          <br />
          내 직장 멘탈 🫠
        </h1>
        <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-relaxed text-muted">
          귀엽게 그려진 캐릭터가
          <br />
          당신의 퇴사 임계점을 알려줘요
        </p>
        <Link className={`${ui.btnPrimary} mt-8 wiggle-hover`} to="/tests">
          테스트 하러 가기 ✨
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-center text-sm font-extrabold text-muted">이런 분께 딱이에요</h2>
        <div className="space-y-3">
          {[
            { emoji: '🏢', label: '퇴사 고민', value: '회사 계속 다녀도 될까…?' },
            { emoji: '⏱️', label: '3분 컷', value: '출퇴근길에 가볍게' },
            { emoji: '💬', label: '팩폭 환영', value: '위로 말고 솔직한 한마디' },
          ].map((item) => (
            <StickerCard key={item.label} className="flex items-center gap-3 !p-4">
              <span className="text-2xl">{item.emoji}</span>
              <div className="text-left">
                <p className="text-xs font-bold text-accent">{item.label}</p>
                <p className="text-[15px] font-bold text-ink">{item.value}</p>
              </div>
            </StickerCard>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
