/** 공통 UI 클래스 — 부드러운 필(pill)·소프트 섀도우 톤 */
export const ui = {
  btnPrimary:
    'inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-accent px-5 text-base font-bold text-white shadow-[0_10px_22px_-8px_rgba(224,82,124,0.55)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0',
  btnSecondary:
    'inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 text-base font-bold text-ink shadow-[0_2px_12px_-4px_rgba(31,21,53,0.16)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-cream-dark active:translate-y-0',
  btnGhost:
    'inline-flex h-12 w-full items-center justify-center rounded-full border border-muted/25 bg-transparent px-5 text-sm font-bold text-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40',
  sticker: 'rounded-2xl bg-white p-5 shadow-[0_2px_18px_-6px_rgba(31,21,53,0.12)]',
  stickerSoft: 'rounded-2xl bg-accent-soft/60 p-5',
  badge:
    'inline-flex items-center rounded-full bg-accent-soft px-3.5 py-1.5 text-[13px] font-bold text-accent-hover',
  pageTitle: 'text-[26px] font-black leading-tight text-ink',
  pageDesc: 'text-[15px] leading-relaxed text-muted',
  sectionTitle: 'mb-3 text-[15px] font-bold text-ink',
} as const
