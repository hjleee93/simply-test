/** 공통 UI. 장식은 줄이고, 버튼과 구분선만 남긴다. */
export const ui = {
  btnPrimary:
    'inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-md bg-accent px-5 text-[15px] font-bold text-white transition-colors hover:bg-accent-hover',
  btnSecondary:
    'inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-md border border-ink/15 bg-white px-5 text-[15px] font-bold text-ink transition-colors hover:bg-cream-dark',
  btnGhost:
    'inline-flex h-11 items-center text-sm font-bold text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40',
  sticker: 'rounded-md border border-ink/10 bg-white p-4',
  stickerSoft: 'rounded-md bg-cream-dark/50 p-4',
  badge: 'inline-flex items-center bg-cream-dark px-2 py-0.5 text-[12px] font-bold text-ink',
  pageTitle: 'text-[22px] font-bold leading-snug tracking-tight text-ink',
  pageDesc: 'text-[15px] leading-relaxed text-muted',
  sectionTitle: 'mb-1 text-[13px] font-bold text-muted',
} as const
