declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

let initialPageViewSent = false

export function trackPageView(path: string, title?: string) {
  if (!initialPageViewSent) {
    initialPageViewSent = true
    return
  }

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  })
}

export function trackTestStart(testId: string) {
  window.gtag?.('event', 'test_start', {
    test_id: testId,
  })
  window.clarity?.('set', 'test_id', testId)
  window.clarity?.('set', 'test_action', 'start')
}

export function trackTestComplete(testId: string, resultId: string) {
  window.gtag?.('event', 'test_complete', {
    test_id: testId,
    result_id: resultId,
  })
  window.clarity?.('set', 'test_id', testId)
  window.clarity?.('set', 'result_id', resultId)
  window.clarity?.('set', 'test_action', 'complete')
}

export type ShareMethod = 'web_share' | 'link_copy' | 'download'

export function trackShare(method: ShareMethod, testId: string, resultId?: string) {
  window.gtag?.('event', 'share', {
    method,
    test_id: testId,
    result_id: resultId,
  })
  window.clarity?.('set', 'share_method', method)
}
