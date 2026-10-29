import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertIcon } from './icons'
import { ui } from '../lib/ui'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/** 렌더링 중 예외가 나도 흰 화면 대신 복구 UI를 보여준다 (Threads 등 일부 인앱 브라우저에서 재현됨). */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
    window.gtag?.('event', 'exception', {
      description: `${error.message}\n${info.componentStack ?? ''}`.slice(0, 500),
      fatal: true,
    })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <AlertIcon className="h-10 w-10 text-muted" />
        <p className="text-[15px] text-muted">
          화면을 불러오지 못했어요. 새로고침하거나 잠시 후 다시 시도해주세요
        </p>
        <button
          type="button"
          className={ui.btnPrimary}
          onClick={() => {
            this.setState({ hasError: false })
            window.location.href = '/'
          }}
        >
          처음으로
        </button>
      </div>
    )
  }
}
