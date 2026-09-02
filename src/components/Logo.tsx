import { Link } from 'react-router-dom'
import { brandCharacterPath } from '../lib/characters'
import { cn } from '../lib/cn'

interface LogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
}

export default function Logo({ className, iconClassName, showText = true }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src={brandCharacterPath()}
        alt=""
        className={cn('pixel-img h-8 w-8 shrink-0 object-contain', iconClassName)}
      />
      {showText ? <span className="font-bold text-ink">Simply Test</span> : null}
    </span>
  )
}

interface LogoLinkProps extends LogoProps {
  to?: string
}

export function LogoLink({ to = '/', className, iconClassName, showText = true }: LogoLinkProps) {
  return (
    <Link className={cn('inline-flex items-center', className)} to={to}>
      <Logo iconClassName={iconClassName} showText={showText} />
    </Link>
  )
}
