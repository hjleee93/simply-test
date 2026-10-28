/** 공용 라인 아이콘 — 이모지 대신 쓰는 미니멀 스트로크 세트 */

interface IconProps {
  className?: string
}

function base(className?: string) {
  return {
    className,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
}

export function TargetIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  )
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M4 5h16v10H9l-4 3v-3H4z" />
    </svg>
  )
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13h5M9.5 16.5h5" />
    </svg>
  )
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  )
}

export function AlertIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v4.5" />
      <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M12 3c1 3-3 4-3 7.5a3 3 0 0 0 6 0c0-1.2-.7-2-1.2-2.8.9.4 2.2 1.6 2.2 4.3a4 4 0 0 1-8 0C8 8 11 6.5 12 3z" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  )
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <rect x="3.5" y="7.5" width="17" height="11" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
    </svg>
  )
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 10.7 15.8 6.8M8.2 13.3l7.6 3.9" />
    </svg>
  )
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M12 3.5v11" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19.5 9" />
      <path d="M19.5 4.5V9H15" />
      <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4.5 15" />
      <path d="M4.5 19.5V15h4.5" />
    </svg>
  )
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}

export function MaleIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="10.5" cy="13.5" r="6" />
      <path d="M15 9l5.5-5.5M15.5 3.5H21v5.5" />
    </svg>
  )
}

export function FemaleIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 15v6M9 19h6" />
    </svg>
  )
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.8-3.3 3-5 5.5-5s4.7 1.7 5.5 5" />
      <path d="M15.2 5.3c1.4.4 2.3 1.6 2.3 3.2 0 1.6-1 2.8-2.3 3.2" />
      <path d="M16.5 14.5c2 .4 3.4 1.9 4 4.7" />
    </svg>
  )
}

export function LightbulbIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6v.5h5.2v-.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M12 3.5l2.4 5.3 5.6.6-4.2 3.9 1.2 5.6-5-2.9-5 2.9 1.2-5.6-4.2-3.9 5.6-.6z" />
    </svg>
  )
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  )
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)} aria-hidden>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}
