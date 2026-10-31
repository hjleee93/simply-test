import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const { pathname, search, hash } = window.location
if (pathname.length > 1 && pathname.endsWith('/')) {
  const normalized = `${pathname.replace(/\/+$/, '')}${search}${hash}`
  window.history.replaceState(window.history.state, '', normalized)
}

const rootElement = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
