import { pixelCharacterPath, pixelCharacterWebpPath, resolveCharacterImage, resolveCharacterWebp } from '../lib/characters'

interface ResultCharacterProps {
  resultId: string
  emoji: string
  image?: string
}

export default function ResultCharacter({ resultId, emoji, image }: ResultCharacterProps) {
  const src = image ? resolveCharacterImage(image) : pixelCharacterPath(resultId)
  const webpSrc = image ? resolveCharacterWebp(image) : pixelCharacterWebpPath(resultId)

  return (
    <div className="mx-auto mb-5 flex h-44 w-44 items-center justify-center">
      <picture>
        {webpSrc ? <source srcSet={webpSrc} type="image/webp" /> : null}
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain"
          onError={(event) => {
            const target = event.currentTarget
            const picture = target.parentElement
            if (picture) picture.style.display = 'none'
            const fallback = picture?.nextElementSibling
            if (fallback instanceof HTMLElement) {
              fallback.style.display = 'flex'
            }
          }}
        />
      </picture>
      <div
        className="hidden h-full w-full items-center justify-center rounded-2xl bg-accent-soft text-6xl"
        aria-hidden
      >
        {emoji}
      </div>
    </div>
  )
}
