import type { TestDefinition } from '../types/test'
import { SITE_NAME } from './site'

export function buildWebSiteJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: origin,
    inLanguage: 'ko-KR',
  }
}

export function buildQuizJsonLd(test: TestDefinition, origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: test.title,
    description: test.description,
    url: `${origin}/tests/${test.id}`,
    inLanguage: 'ko-KR',
    numberOfQuestions: test.questions.length,
    educationalLevel: 'general',
  }
}
