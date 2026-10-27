interface ProgressBarProps {
  current: number
  total: number
  theme?: 'default' | 'halloween'
}

export default function ProgressBar({ current, total, theme = 'default' }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const filledBlocks = Math.round((percent / 100) * 10)
  const isHalloween = theme === 'halloween'

  return (
    <div
      className={`rounded-lg border-[3px] px-4 py-3 ${
        isHalloween ? 'border-[#ff942f] bg-[#211044]' : 'border-ink bg-white'
      }`}
    >
      <div
        className={`mb-2 flex justify-between text-xs font-bold ${
          isHalloween ? 'text-[#e6d7f7]' : 'text-muted'
        }`}
      >
        <span>
          {current} / {total} 문항
        </span>
        <span>{percent}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 border-2 ${
              isHalloween ? 'border-[#6f4396]' : 'border-ink'
            } ${
              i < filledBlocks
                ? isHalloween
                  ? 'bg-[#ff942f]'
                  : 'bg-accent'
                : isHalloween
                  ? 'bg-[#39205b]'
                  : 'bg-accent-soft'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
