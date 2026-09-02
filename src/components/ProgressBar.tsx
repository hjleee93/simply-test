interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const filledBlocks = Math.round((percent / 100) * 10)

  return (
    <div className="rounded-lg border-[3px] border-ink bg-white px-4 py-3">
      <div className="mb-2 flex justify-between text-xs font-bold text-muted">
        <span>
          {current} / {total} 문항
        </span>
        <span>{percent}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 border-2 border-ink ${
              i < filledBlocks ? 'bg-accent' : 'bg-accent-soft'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
