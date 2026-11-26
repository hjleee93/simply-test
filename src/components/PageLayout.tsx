import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE_NAME_KO } from '../lib/site'
import { LogoLink } from './Logo'

interface PageLayoutProps {
  children: ReactNode
  backTo?: string
  backLabel?: string
  theme?: 'default' | 'halloween' | 'meme'
  /** 테스트 진행 화면처럼 집중이 필요한 곳에서 푸터를 숨긴다 */
  hideFooter?: boolean
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
  hideFooter = false,
}: PageLayoutProps) {
  const isHalloween = theme === 'halloween'
  const isMeme = theme === 'meme'

  return (
    <div className={`min-h-svh ${isHalloween ? 'halloween-page' : isMeme ? 'meme-page' : ''}`}>
      <div className="mx-auto flex min-h-svh w-full max-w-[720px] flex-col">
      <header
        className={`sticky top-0 z-10 flex h-14 items-center justify-between border-b px-5 ${
          isHalloween
            ? 'border-[#7346a8] bg-[#10082b]'
            : isMeme
              ? 'border-ink/10 bg-[#ece8e1]'
              : 'border-ink/10 bg-cream'
        }`}
      >
        {backTo ? (
          <Link
            className={`text-sm font-bold ${isHalloween ? 'text-white' : 'text-ink'}`}
            to={backTo}
          >
            ← {backLabel ?? '뒤로'}
          </Link>
        ) : (
          <>
            <LogoLink variant="full" />
            <Link
              to="/tests"
              className={`text-sm font-bold ${
                isHalloween
                  ? 'text-white hover:text-[#ffb247]'
                  : isMeme
                    ? 'text-ink hover:text-[#e11d48]'
                    : 'text-muted hover:text-ink'
              }`}
            >
              전체 테스트
            </Link>
          </>
        )}
      </header>
      <main className="flex-1 px-5 pb-10 pt-5">{children}</main>
      {hideFooter ? null : (
      <footer
        className={`mt-auto border-t px-5 pb-8 pt-5 ${
          isHalloween ? 'border-[#7346a8]' : 'border-ink/10'
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
        <nav
          aria-label="사이트 정보"
          className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-semibold ${
            isHalloween ? 'text-[#d9c9ef]' : 'text-ink/70'
          }`}
        >
          <Link to="/about" className="hover:text-accent">서비스 소개</Link>
          <a
            href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : INSTAGRAM_URL}
            target={CONTACT_EMAIL ? undefined : '_blank'}
            rel={CONTACT_EMAIL ? undefined : 'noopener noreferrer'}
            className="hover:text-accent"
          >
            문의하기
          </a>
          <Link to="/terms" className="hover:text-accent">이용약관</Link>
          <Link to="/privacy" className="font-bold hover:text-accent">개인정보처리방침</Link>
        </nav>
        <p
          className={`mt-3 text-[11px] leading-relaxed ${
            isHalloween ? 'text-[#c9b8e8]' : isMeme ? 'text-[#5c564e]' : 'text-muted'
          }`}
        >
          본 사이트의 테스트 결과는 재미와 자기 이해를 위한 것이며, 전문적인 심리 상담을 대체할
          수 없습니다.
          <br />© {new Date().getFullYear()} {SITE_NAME_KO} Simply Test
        </p>
      </footer>
      )}
      </div>
    </div>
  )
}
