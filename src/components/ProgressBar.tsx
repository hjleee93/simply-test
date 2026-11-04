interface ProgressBarProps {
  current: number
  total: number
  theme?: 'default' | 'halloween' | 'meme'
}

export default function ProgressBar({ current, total, theme = 'default' }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const isHalloween = theme === 'halloween'
  const isMeme = theme === 'meme'

  if (isMeme) {
    return (
      <div className="border-2 border-ink bg-[#f7f3ea] px-4 py-3">
        <div className="mb-2 flex justify-between text-xs font-black text-ink">
          <span>
            {current} / {total} 문제
          </span>
          <span>{percent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden border border-ink bg-white">
          <div
            className="h-full bg-ink transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl px-4 py-3.5 ${
        isHalloween ? 'bg-[#211044]' : 'bg-white shadow-[0_2px_14px_-6px_rgba(31,21,53,0.14)]'
      }`}
    >
      <div
        className={`mb-2 flex justify-between text-xs font-bold ${
          isHalloween ? 'text-[#b9a3cf]' : 'text-muted'
        }`}
      >
        <span>
          {current} / {total} 문항
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className={`h-2.5 overflow-hidden rounded-full ${
          isHalloween ? 'bg-[#39205b]' : 'bg-accent-soft'
        }`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${
            isHalloween ? 'bg-[#ff942f]' : 'bg-accent'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
