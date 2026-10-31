import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) {
  const normalized = `${pathname.replace(/\/+$/, '')}${search}${hash}`
  window.history.replaceState(window.history.state, '', normalized)
}

const root = document.getElementById('root')!

hydrateRoot(root, (
  <StrictMode>
    <App />
  </StrictMode>
), {
  onRecoverableError: (error) => {
    if (import.meta.env.DEV) {
      console.warn('Hydration mismatch (non-critical):', error)
    }
  },
})
