import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getAdminSession } from '../lib/adminAuth'
import NotFound from '../pages/NotFound'

type AdminGuardProps = {
  children: (session: Session) => ReactNode
}

/**
 * 비관리자에게는 404와 동일한 화면만 보여 관리자 경로 존재를 숨긴다.
 * 로그인 유도 UI/권한 없음 문구는 절대 노출하지 않는다.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    getAdminSession().then((next) => {
      if (!active) return
      setSession(next)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream text-sm text-muted">
        불러오는 중...
      </div>
    )
  }

  if (!session) return <NotFound />

  return <>{children(session)}</>
}
