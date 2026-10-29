const STORAGE_KEY = 'simply-test:visitor-id'

/** crypto.randomUUID는 Threads 등 일부 인앱 브라우저에서 미지원 — 항상 동작하는 폴백을 둔다 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}

/** 회원가입 없이 같은 브라우저·기기를 구분하는 익명 ID */
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing

    const id = generateId()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return generateId()
  }
}
