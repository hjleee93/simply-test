import { genderTest } from './genderTest'
import { kkondaeTest } from './kkondaeTest'
import { retirementTest } from './retirementTest'
import type { TestDefinition } from '../types/test'

export const tests: Record<string, TestDefinition> = {
  [retirementTest.id]: retirementTest,
  [genderTest.id]: genderTest,
  [kkondaeTest.id]: kkondaeTest,
}

export function getTest(id: string): TestDefinition | undefined {
  return tests[id]
}

export function getAllTests(): TestDefinition[] {
  return Object.values(tests)
}
