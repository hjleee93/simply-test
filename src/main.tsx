import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) {
  const normalized = `${pathname.replace(/\/+$/, '')}${search}${hash}`
  window.history.replaceState(window.history.state, '', normalized)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
