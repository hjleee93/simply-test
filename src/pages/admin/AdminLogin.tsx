import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import { getAdminSession, signInAdmin } from '../../lib/adminAuth'
import NotFound from '../NotFound'
import { ui } from '../../lib/ui'

/**
 * 진입점은 북마크/직접 URL만. 공개 내비에 링크하지 않는다.
 * 이미 세션이 있으면 /admin 으로 보내고, 실패해도 "관리자" 존재를 강조하지 않는다.
 */
export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let active = true
    getAdminSession().then((session) => {
      if (!active) return
      if (session) {
        navigate('/admin', { replace: true })
        return
      }
      // 로그인 폼은 ?gate=1 이 있을 때만 노출. 없으면 404와 동일.
      const params = new URLSearchParams(window.location.search)
      setAllowed(params.get('gate') === '1')
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [navigate])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: signInError } = await signInAdmin(email.trim(), password)
    setBusy(false)
    if (signInError) {
      setError('로그인에 실패했어요.')
      return
    }
    navigate('/admin', { replace: true })
  }

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-sm text-muted">
        불러오는 중...
      </div>
    )
  }

  if (!allowed) return <NotFound />

  return (
    <div className="mx-auto flex min-h-svh max-w-[420px] flex-col justify-center px-5">
      <PageMeta title="Sign in" noindex />
      <form onSubmit={onSubmit} className="space-y-3 rounded-xl border-[3px] border-ink bg-white p-5">
        <label className="block text-sm font-bold text-ink">
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border-2 border-ink px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-bold text-ink">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border-2 border-ink px-3 py-2 text-sm"
          />
        </label>
        {error ? <p className="text-sm font-bold text-accent">{error}</p> : null}
        <button type="submit" className={ui.btnPrimary} disabled={busy}>
          {busy ? '...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}
