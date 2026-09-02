const GA_MEASUREMENT_ID = 'G-2VVC5GJ8KN'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string) {
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}
