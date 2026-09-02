import { pixelCharacterPath } from '../lib/characters'

interface ResultCharacterProps {
  resultId: string
  emoji: string
  image?: string
}

export default function ResultCharacter({ resultId, emoji, image }: ResultCharacterProps) {
  const src = image ?? pixelCharacterPath(resultId)

  return (
    <div className="mx-auto mb-5 flex h-44 w-44 items-center justify-center">
      <img
        src={src}
        alt=""
        className="pixel-img h-full w-full object-contain"
        onError={(event) => {
          const target = event.currentTarget
          target.style.display = 'none'
          const fallback = target.nextElementSibling
          if (fallback instanceof HTMLElement) {
            fallback.style.display = 'flex'
          }
        }}
      />
      <div
        className="hidden h-full w-full items-center justify-center rounded-lg border-[3px] border-ink bg-accent-soft text-6xl"
        aria-hidden
      >
        {emoji}
      </div>
    </div>
  )
}
