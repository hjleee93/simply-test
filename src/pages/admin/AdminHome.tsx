import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageMeta from '../../components/PageMeta'
import { signOutAdmin } from '../../lib/adminAuth'
import {
  fetchAdminTests,
  isPublished,
  type AdminTestRow,
} from '../../lib/adminTests'
import { getCategoryMeta } from '../../lib/testCategories'
import type { TestCategoryId } from '../../types/test'
import { ui } from '../../lib/ui'

export default function AdminHome() {
  const navigate = useNavigate()
  const [tests, setTests] = useState<AdminTestRow[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchAdminTests()
      .then((rows) => {
        if (active) setTests(rows)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : '불러오기 실패')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function onSignOut() {
    await signOutAdmin()
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto min-h-svh max-w-[720px] px-5 py-8">
      <PageMeta title="Admin" noindex />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={ui.pageTitle}>콘텐츠</h1>
          <p className={`${ui.pageDesc} mt-1`}>테스트 공개/수정</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/tests/new"
            className="rounded-lg border-[3px] border-ink bg-accent px-4 py-2 text-sm font-bold text-white"
          >
            새 테스트
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg border-[3px] border-ink bg-white px-4 py-2 text-sm font-bold text-ink"
          >
            나가기
          </button>
        </div>
      </header>

      {loading ? <p className="text-sm text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-sm font-bold text-accent">{error}</p> : null}

      <ul className="space-y-3">
        {tests.map((test) => {
          const published = isPublished(test.publish_at)
          const category = getCategoryMeta(test.category as TestCategoryId)
          return (
            <li key={test.id}>
              <Link
                to={`/admin/tests/${test.id}`}
                className="block rounded-xl border-[3px] border-ink bg-white p-4 transition-colors hover:bg-cream-dark"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md border-2 border-ink px-2 py-0.5 text-xs font-bold ${
                      published ? 'bg-lemon text-ink' : 'bg-lilac/40 text-ink'
                    }`}
                  >
                    {published ? '공개중' : '예약'}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {category.emoji} {category.label}
                  </span>
                </div>
                <p className="mt-2 text-[15px] font-extrabold text-ink">{test.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {test.id} · publish_at {new Date(test.publish_at).toLocaleString('ko-KR')}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
