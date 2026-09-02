import { retirementTest } from './retirementTest'
import type { TestDefinition } from '../types/test'

export const tests: Record<string, TestDefinition> = {
  [retirementTest.id]: retirementTest,
}

export function getTest(id: string): TestDefinition | undefined {
  return tests[id]
}

export function getAllTests(): TestDefinition[] {
  return Object.values(tests)
}
