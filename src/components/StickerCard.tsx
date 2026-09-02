import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { ui } from '../lib/ui'

interface StickerCardProps {
  children: ReactNode
  className?: string
  soft?: boolean
}

export default function StickerCard({ children, className, soft }: StickerCardProps) {
  return (
    <div className={cn(soft ? ui.stickerSoft : ui.sticker, className)}>
      {children}
    </div>
  )
}
