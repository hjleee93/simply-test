import og from './og.json' with { type: 'json' }
import { getOgImagePath } from './ogImages'
import { DEFAULT_OG, SITE_NAME } from './site'

export type RouteMeta = {
  path: string
  title: string
  description: string
  imagePath: string
  type?: string
  indexable?: boolean
}

export function getAllRouteMeta(): RouteMeta[] {
  return [
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
    ...og.tests.flatMap((test) => [
      {
        path: `/tests/${test.id}`,
        title: `${test.title} | ${SITE_NAME}`,
        description: test.description,
        imagePath: getOgImagePath(`/tests/${test.id}`),
      },
      {
        path: `/tests/${test.id}/play`,
        title: `${test.title} 진행 중 | ${SITE_NAME}`,
        description: test.description,
        imagePath: getOgImagePath(`/tests/${test.id}`),
        indexable: false,
      },
      {
        path: `/tests/${test.id}/result`,
        title: `${test.title} 결과 | ${SITE_NAME}`,
        description: test.description,
        imagePath: getOgImagePath(`/tests/${test.id}`),
        type: 'article',
        indexable: false,
      },
    ]),
  ]
}

export function getIndexableRoutes(): RouteMeta[] {
  return getAllRouteMeta().filter((route) => route.indexable !== false)
}

export function getRouteMeta(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return (
    getAllRouteMeta().find((route) => route.path === normalized) ?? {
      path: normalized,
      title: DEFAULT_OG.title,
      description: DEFAULT_OG.description,
      imagePath: getOgImagePath(normalized),
    }
  )
}
