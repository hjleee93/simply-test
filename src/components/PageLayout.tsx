import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/site'
import { LogoLink } from './Logo'

interface PageLayoutProps {
  children: ReactNode
  backTo?: string
  backLabel?: string
  theme?: 'default' | 'halloween'
}

function ListIcon() {
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
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  )
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

export default function PageLayout({
  children,
  backTo,
  backLabel,
  theme = 'default',
}: PageLayoutProps) {
  const isHalloween = theme === 'halloween'

  return (
    <div
      className={`mx-auto flex min-h-svh max-w-[480px] flex-col ${
        isHalloween ? 'halloween-page' : ''
      }`}
    >
      <header
        className={`sticky top-0 z-10 flex h-14 items-center justify-between px-5 backdrop-blur-sm ${
          isHalloween ? 'bg-[#10082b]/90' : 'bg-cream/90'
        }`}
      >
        {backTo ? (
          <Link
            className="rounded-md border-2 border-ink bg-white px-3 py-1.5 text-sm font-bold text-ink transition-colors hover:bg-lemon"
            to={backTo}
          >
            ← {backLabel ?? '뒤로'}
          </Link>
        ) : (
          <>
            <LogoLink variant="full" className="wiggle-hover" />
            <Link
              to="/tests"
              className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors ${
                isHalloween ? 'text-white hover:text-[#ffb247]' : 'text-ink hover:text-accent'
              }`}
            >
              <ListIcon />
              전체 테스트
            </Link>
          </>
        )}
      </header>
      <main className="flex-1 px-5 pb-8 pt-1">{children}</main>
      <footer
        className={`mt-auto border-t-2 border-dashed px-5 pb-8 pt-5 text-center ${
          isHalloween ? 'border-[#7346a8]' : 'border-lilac/70'
        }`}
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-accent ${
            isHalloween ? 'text-white' : 'text-ink'
          }`}
        >
          <InstagramIcon />
          @{INSTAGRAM_HANDLE}
        </a>
        <p
          className={`mx-auto mt-3 max-w-[280px] text-[11px] leading-relaxed ${
            isHalloween ? 'text-[#c9b8e8]' : 'text-muted'
          }`}
        >
          본 사이트의 테스트 결과는 재미와 자기 이해를 위한 것이며, 전문적인 심리 상담을 대체할
          수 없습니다.
        </p>
      </footer>
    </div>
  )
}
