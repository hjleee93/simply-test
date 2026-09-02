/** 키치·픽셀 톤 공통 UI 클래스 */
export const ui = {
  btnPrimary:
    'inline-flex h-14 w-full items-center justify-center rounded-lg border-[3px] border-ink bg-accent px-5 text-base font-bold text-white transition-colors hover:bg-accent-hover active:bg-accent-hover',
  btnSecondary:
    'inline-flex h-14 w-full items-center justify-center rounded-lg border-[3px] border-ink bg-white px-5 text-base font-bold text-ink transition-colors hover:bg-cream-dark active:bg-cream-dark',
  btnGhost:
    'inline-flex h-12 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted/40 bg-white/70 px-5 text-sm font-bold text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40',
  sticker:
    'rounded-xl border-[3px] border-ink bg-white p-5',
  stickerSoft:
    'rounded-xl border-[3px] border-dashed border-accent bg-accent-soft/60 p-5',
  badge:
    'inline-block rounded-md border-2 border-ink bg-lemon px-3 py-1.5 text-[13px] font-bold text-ink',
  pageTitle: 'text-[26px] font-bold leading-tight text-ink',
  pageDesc: 'text-[15px] leading-relaxed text-muted',
  sectionTitle: 'mb-3 text-[15px] font-bold text-ink',
} as const
