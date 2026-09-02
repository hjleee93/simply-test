import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site'
import { LogoLink } from './Logo'

interface PageLayoutProps {
  children: ReactNode
  backTo?: string
  backLabel?: string
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function PageLayout({ children, backTo, backLabel }: PageLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh max-w-[480px] flex-col">
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
      <main className="flex-1 px-5 pb-8 pt-1">{children}</main>
      <footer className="mt-auto border-t-2 border-dashed border-lilac/70 px-5 pb-8 pt-5 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-accent"
        >
          <InstagramIcon />
          @{INSTAGRAM_HANDLE}
        </a>
        <p className="mx-auto mt-3 max-w-[280px] text-[11px] leading-relaxed text-muted">
          본 사이트의 테스트 결과는 재미와 자기 이해를 위한 것이며, 전문적인 심리 상담을 대체할
          수 없습니다.
        </p>
      </footer>
    </div>
  )
}
