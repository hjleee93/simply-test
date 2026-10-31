import type { TestDefinition } from '../types/test'
import { SITE_NAME } from './site'

export function buildWebSiteJsonLd(origin: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: '심플리테스트',
      url: origin,
      inLanguage: 'ko-KR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: '심플리테스트',
      url: origin,
      logo: `${origin}/brand-logo.png`,
    },
  ]
}

export function buildQuizJsonLd(test: TestDefinition, origin: string) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: test.title,
      description: test.description,
      url: `${origin}/tests/${test.id}`,
      inLanguage: 'ko-KR',
      numberOfQuestions: test.questions.length,
      educationalLevel: 'general',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '테스트 목록',
          item: `${origin}/tests`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: test.title,
          item: `${origin}/tests/${test.id}`,
        },
      ],
    },
  ]
}
