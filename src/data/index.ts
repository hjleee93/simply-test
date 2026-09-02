import { genderTest } from './genderTest'
import { kkondaeTest } from './kkondaeTest'
import { retirementTest } from './retirementTest'
import og from '../lib/og.json' with { type: 'json' }
import type { TestDefinition } from '../types/test'

export const tests: Record<string, TestDefinition> = {
  [retirementTest.id]: retirementTest,
  [genderTest.id]: genderTest,
  [kkondaeTest.id]: kkondaeTest,
}

export const MAIN_PAGE_TEST_LIMIT = 10
export const RECOMMENDED_TEST_LIMIT = 3

export function getTest(id: string): TestDefinition | undefined {
  return tests[id]
}

export function getAllTests(): TestDefinition[] {
  return og.tests
    .map((meta) => tests[meta.id])
    .filter((test): test is TestDefinition => test !== undefined)
}

export function getFeaturedTests(limit = MAIN_PAGE_TEST_LIMIT): TestDefinition[] {
  return getAllTests().slice(0, limit)
}

export function getRecommendedTests(
  excludeTestId: string,
  limit = RECOMMENDED_TEST_LIMIT,
): TestDefinition[] {
  return getAllTests()
    .filter((test) => test.id !== excludeTestId)
    .slice(0, limit)
}
