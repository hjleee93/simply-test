import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogoLink } from './Logo'

interface PageLayoutProps {
  children: ReactNode
  backTo?: string
  backLabel?: string
}

export default function PageLayout({ children, backTo, backLabel }: PageLayoutProps) {
  return (
    <div className="mx-auto min-h-svh max-w-[480px]">
      <header className="sticky top-0 z-10 flex h-14 items-center bg-cream/90 px-5 backdrop-blur-sm">
        {backTo ? (
          <Link
            className="rounded-md border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-lemon"
            to={backTo}
          >
            ← {backLabel ?? '뒤로'}
          </Link>
        ) : (
          <LogoLink className="wiggle-hover" />
        )}
      </header>
      <main className="px-5 pb-10 pt-1">{children}</main>
    </div>
  )
}
