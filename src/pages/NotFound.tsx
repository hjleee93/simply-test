import { useNavigate } from 'react-router-dom'
import { AlertIcon } from '../components/icons'
import PageLayout from '../components/PageLayout'
import PageMeta from '../components/PageMeta'
import { ui } from '../lib/ui'

/** 일반 유저에게 관리자 존재 여부를 드러내지 않기 위해 /admin 비인가와 동일 화면을 쓴다. */
export default function NotFound() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <PageMeta title="페이지를 찾을 수 없어요 | Simply Test" noindex />
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertIcon className="h-10 w-10 text-muted" />
        <p className="text-[15px] text-muted">페이지를 찾을 수 없어요.</p>
        <button type="button" className={ui.btnPrimary} onClick={() => navigate('/')}>
          홈으로
        </button>
      </div>
    </PageLayout>
  )
}
