import { cn } from '../lib/cn'

export default function ResultPeerStat({
  percent,
  className,
}: {
  percent?: number | null
  className?: string
}) {
  if (percent == null) return null

  return (
    <p className={cn('mt-3 text-center text-[13px] font-bold leading-snug text-accent', className)}>
      이 테스트를 한 사람 중 {percent}%가 같은 결과예요
    </p>
  )
}
