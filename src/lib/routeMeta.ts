import og from './og.json' with { type: 'json' }
import { getOgImagePath } from './ogImages'
import { DEFAULT_OG } from './site'

export type RouteMeta = {
  path: string
  title: string
  description: string
  imagePath: string
  type?: string
  indexable?: boolean
}

/** 테스트별 메타(og.tests)는 Supabase에서 비동기로 가져오므로 여기엔 정적 페이지만 둔다. 테스트 라우트는 PageMeta의 RoutePageMeta가 useTest로 직접 채운다. */
const STATIC_ROUTES: RouteMeta[] = [
  {
    path: '/',
    title: og.home.title,
    description: og.home.description,
    imagePath: getOgImagePath('/'),
  },
  {
    path: '/tests',
    title: og.list.title,
    description: og.list.description,
    imagePath: getOgImagePath('/tests'),
  },
]

export function getStaticRouteMeta(pathname: string): RouteMeta | undefined {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return STATIC_ROUTES.find((route) => route.path === normalized)
}

export function getDefaultRouteMeta(pathname: string): RouteMeta {
  return {
    path: pathname,
    title: DEFAULT_OG.title,
    description: DEFAULT_OG.description,
    imagePath: getOgImagePath(pathname),
  }
}
