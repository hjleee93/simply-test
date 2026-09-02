import og from './og.json' with { type: 'json' }
import { DEFAULT_OG, SITE_NAME } from './site'

export type RouteMeta = {
  path: string
  title: string
  description: string
  type?: string
}

export function getAllRouteMeta(): RouteMeta[] {
  return [
    {
      path: '/',
      title: og.home.title,
      description: og.home.description,
    },
    {
      path: '/tests',
      title: og.list.title,
      description: og.list.description,
    },
    ...og.tests.flatMap((test) => [
      {
        path: `/tests/${test.id}`,
        title: `${test.title} | ${SITE_NAME}`,
        description: test.description,
      },
      {
        path: `/tests/${test.id}/play`,
        title: `${test.title} 진행 중 | ${SITE_NAME}`,
        description: test.description,
      },
      {
        path: `/tests/${test.id}/result`,
        title: `${test.title} 결과 | ${SITE_NAME}`,
        description: test.description,
        type: 'article',
      },
    ]),
  ]
}

export function getRouteMeta(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/$/, '') || '/'
  return (
    getAllRouteMeta().find((route) => route.path === normalized) ?? {
      path: normalized,
      title: DEFAULT_OG.title,
      description: DEFAULT_OG.description,
    }
  )
}
