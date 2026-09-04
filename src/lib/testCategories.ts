import type { TestCategoryId } from '../types/test'

export type TestCategoryMeta = {
  id: TestCategoryId
  label: string
  emoji: string
}

export const TEST_CATEGORIES: TestCategoryMeta[] = [
  { id: 'workplace', label: '직장생활', emoji: '💼' },
  { id: 'relationship', label: '인간관계', emoji: '🤝' },
  { id: 'romance', label: '연애', emoji: '💕' },
  { id: 'self', label: '자아탐구', emoji: '🔮' },
]

export function getCategoryMeta(id: TestCategoryId): TestCategoryMeta {
  return TEST_CATEGORIES.find((category) => category.id === id) ?? TEST_CATEGORIES[0]
}
