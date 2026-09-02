const STORAGE_KEY = 'simply-test:visitor-id'

/** 회원가입 없이 같은 브라우저·기기를 구분하는 익명 ID */
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing

    const id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}
