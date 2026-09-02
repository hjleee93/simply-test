const CAPTURE_FONT =
  '"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'

function isIos() {
  const ua = navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isInAppBrowser() {
  return /KAKAOTALK|Instagram|FBAN|FBAV|FBIOS|Line\/|NAVER|everytime/i.test(
    navigator.userAgent,
  )
}

/** iOS·인앱은 a[download]가 현재 페이지를 blob으로 바꿔 빈 화면처럼 보임 */
export function needsManualImageSave() {
  return isIos() || isInAppBrowser()
}

function waitForImages(node: HTMLElement) {
  const images = [...node.querySelectorAll('img')]

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.addEventListener('load', () => resolve(), { once: true })
          img.addEventListener('error', () => resolve(), { once: true })
        }),
    ),
  )
}

export async function captureElementAsPng(node: HTMLElement): Promise<Blob> {
  const { toBlob, toPng } = await import('html-to-image')

  await document.fonts.ready.catch(() => undefined)
  await waitForImages(node)

  const previousFont = node.style.fontFamily
  node.style.fontFamily = CAPTURE_FONT

  try {
    const width = Math.ceil(node.scrollWidth || node.getBoundingClientRect().width)
    const height = Math.ceil(node.scrollHeight || node.getBoundingClientRect().height)

    const options = {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#fff9e8',
      width,
      height,
      skipFonts: true,
    }

    const blob = await toBlob(node, options)
    if (blob && blob.size > 1000) return blob

    const dataUrl = await toPng(node, options)
    const response = await fetch(dataUrl)
    return response.blob()
  } finally {
    node.style.fontFamily = previousFont
  }
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function shareImage(
  blob: Blob,
  filename: string,
  options: { title: string; text: string },
): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: options.title,
      text: options.text,
      files: [file],
    })
    return true
  }

  return false
}

export function buildResultFilename(thresholdPercent: number, resultTitle: string) {
  const safeTitle = resultTitle.replace(/\s+/g, '-')
  return `simply-test-${thresholdPercent}%-${safeTitle}.png`
}
