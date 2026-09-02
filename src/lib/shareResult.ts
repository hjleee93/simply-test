export async function captureElementAsPng(node: HTMLElement): Promise<Blob> {
  const { toPng } = await import('html-to-image')

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#fff8f0',
  })

  const response = await fetch(dataUrl)
  return response.blob()
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
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
