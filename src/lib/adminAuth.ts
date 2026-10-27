import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

function parseAdminEmails(): Set<string> {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? ''
  return new Set(
    raw
      .split(',')
      .map((email: string) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowlist = parseAdminEmails()
  if (allowlist.size === 0) return false
  return allowlist.has(email.trim().toLowerCase())
}

export function isAdminUser(user: User | null | undefined): boolean {
  return isAdminEmail(user?.email)
}

export async function getAdminSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  const session = data.session
  if (!session || !isAdminUser(session.user)) return null
  return session
}

export async function signInAdmin(email: string, password: string) {
  if (!supabase) {
    return { error: new Error('Supabase가 설정되지 않았어요.') }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut()
    return { error: new Error('허용되지 않은 계정이에요.') }
  }

  return { error: null }
}

export async function signOutAdmin() {
  if (!supabase) return
  await supabase.auth.signOut()
}
