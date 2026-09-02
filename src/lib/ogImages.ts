export const OG_IMAGE_DIR = '/og'

export function getOgImageKeyFromPath(pathname: string): string {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === '/') return 'home'
  if (normalized === '/tests') return 'list'

  const testMatch = normalized.match(/^\/tests\/([^/]+)/)
  if (testMatch) return testMatch[1]

  return 'home'
}

export function getOgImagePath(pathname: string): string {
  return `${OG_IMAGE_DIR}/${getOgImageKeyFromPath(pathname)}.png`
}
