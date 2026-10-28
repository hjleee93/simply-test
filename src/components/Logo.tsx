import { Link } from 'react-router-dom'
import { brandCharacterPath, brandLogoPath } from '../lib/characters'
import { cn } from '../lib/cn'

interface LogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
  /** 'mark': 소형 워터마크용 아이콘+텍스트 (기본) · 'full': 곰+워드마크 한 장짜리 전체 로고 */
  variant?: 'mark' | 'full'
}

export default function Logo({ className, iconClassName, showText = true, variant = 'mark' }: LogoProps) {
  if (variant === 'full') {
    return (
      <img
        src={brandLogoPath()}
        alt="Simply Test 심리테스트"
        className={cn('h-11 w-auto object-contain', className)}
      />
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src={brandCharacterPath()}
        alt=""
        className={cn('h-8 w-8 shrink-0 object-contain', iconClassName)}
      />
      {showText ? <span className="font-pixel text-ink">Simply Test</span> : null}
    </span>
  )
}

interface LogoLinkProps extends LogoProps {
  to?: string
}

export function LogoLink({
  to = '/',
  className,
  iconClassName,
  showText = true,
  variant = 'mark',
}: LogoLinkProps) {
  return (
    <Link className={cn('inline-flex items-center', className)} to={to}>
      <Logo iconClassName={iconClassName} showText={showText} variant={variant} />
    </Link>
  )
}
