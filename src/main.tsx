import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) {
  const normalized = `${pathname.replace(/\/+$/, '')}${search}${hash}`
  window.history.replaceState(window.history.state, '', normalized)
}

const root = document.getElementById('root')!

// #root 안의 프리렌더는 크롤러용 정적 HTML이라 React 트리와 구조가 다르다.
// hydrateRoot로 붙이면 불일치가 나므로, JS가 실행되면 그 내용을 통째로 교체한다.
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
