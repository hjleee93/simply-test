import type { ScoreCategory, TestAnswers, TestDefinition } from '../types/test'
import { calculateCategoryScores } from './scoring'

export const CATEGORY_ORDER: ScoreCategory[] = [
  'people',
  'money',
  'workLifeBalance',
  'growth',
  'work',
]

export const CATEGORY_META: Record<
  ScoreCategory,
  { label: string; emoji: string; subtype: string }
> = {
  people: { label: '인간관계', emoji: '👥', subtype: '인간관계 폭발형' },
  money: { label: '연봉/보상', emoji: '💰', subtype: '보상 불만형' },
  workLifeBalance: { label: '워라밸', emoji: '⚖️', subtype: '워라밸 붕괴형' },
  growth: { label: '성장', emoji: '📈', subtype: '성장 정체형' },
  work: { label: '업무', emoji: '💻', subtype: '업무 과부하형' },
}

export type CategoryPercent = {
  category: ScoreCategory
  label: string
  emoji: string
  subtype: string
  percent: number
}

function calculateCategoryBounds(test: TestDefinition) {
  const maxima: Record<ScoreCategory, number> = {
    work: 0,
    money: 0,
    people: 0,
    growth: 0,
    workLifeBalance: 0,
  }
  const minima: Record<ScoreCategory, number> = {
    work: 0,
    money: 0,
    people: 0,
    growth: 0,
    workLifeBalance: 0,
  }

  for (const question of test.questions) {
    for (const category of CATEGORY_ORDER) {
      const categoryScores = question.answers
        .map((answer) => answer.scores?.[category])
        .filter((score): score is number => score !== undefined)

      if (categoryScores.length === 0) continue

      maxima[category] += Math.max(...categoryScores)
      minima[category] += Math.min(...categoryScores)
    }
  }

  return { maxima, minima }
}

function toPercent(raw: number, min: number, max: number): number {
  if (max <= min) return 0
  return Math.round(((raw - min) / (max - min)) * 100)
}

export function calculateCategoryPercents(
  test: TestDefinition,
  answers: TestAnswers,
): CategoryPercent[] {
  const totals = calculateCategoryScores(answers)
  const { maxima, minima } = calculateCategoryBounds(test)

  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_META[category].label,
    emoji: CATEGORY_META[category].emoji,
    subtype: CATEGORY_META[category].subtype,
    percent: toPercent(totals[category], minima[category], maxima[category]),
  })).sort((a, b) => b.percent - a.percent)
}

const RESIGN_BUTTONS: Record<ScoreCategory, string> = {
  people: '일이 힘든 것보다\n불합리한 상황을 더 못 참는 타입',
  money: '월급이 들어오기 전까지는\n참을 수 있는 타입',
  workLifeBalance: '퇴근 후 연락 오는 순간\n퇴사를 상상하는 타입',
  growth: '배울 게 없다고 느끼는 순간\n마음이 먼저 떠나는 타입',
  work: '업무량보다\n의미 없는 일이 더 힘든 타입',
}

const COMBINED_RESIGN_BUTTONS: Partial<Record<string, string>> = {
  'people|money':
    '사람도 불편하고 보상도 아쉬우면\n바로 퇴사 시나리오를 그리는 타입',
  'people|workLifeBalance':
    '상사 눈치와 퇴근 후 연락이 겹치면\n버틸 이유를 잃는 타입',
  'money|growth':
    '연봉은 그대로인데 성장만 멈추면\n이직 탭을 여는 타입',
  'growth|work':
    '반복 업무에 성장 기회까지 없으면\n바로 지루함이 퇴사로 이어지는 타입',
  'money|workLifeBalance':
    '돈도 아쉽고 쉬는 시간도 없으면\n참을 명분이 사라지는 타입',
}

const COMPANY_NEEDS: Record<ScoreCategory, string[]> = {
  people: ['수평적이고 존중받는 팀 문화', '상사보다 협업이 편한 조직'],
  money: ['성과에 따른 보상이 확실한 곳', '연봉·인센티브 체계가 투명한 곳'],
  workLifeBalance: ['불필요한 야근이 적은 곳', '휴가·퇴근 시간이 보장되는 곳'],
  growth: ['배움과 도전이 있는 업무 환경', '커리어 성장 경로가 보이는 곳'],
  work: ['업무 범위가 명확한 곳', '비효율 없이 일할 수 있는 시스템'],
}

function pairKey(a: ScoreCategory, b: ScoreCategory): string {
  return [a, b].sort().join('|')
}

export function getResignButton(categories: CategoryPercent[]): string {
  const [first, second] = categories
  if (!first) return RESIGN_BUTTONS.work

  if (second && first.percent - second.percent <= 12) {
    const combined = COMBINED_RESIGN_BUTTONS[pairKey(first.category, second.category)]
    if (combined) return combined
  }

  return RESIGN_BUTTONS[first.category]
}

export function getCompanyNeeds(categories: CategoryPercent[]): string[] {
  const stressed = categories.filter((item) => item.percent >= 55).slice(0, 3)
  const targets = stressed.length > 0 ? stressed : categories.slice(0, 2)

  const needs = targets.flatMap((item) => COMPANY_NEEDS[item.category])
  return [...new Set(needs)].slice(0, 3)
}

export function getResultSubtype(categories: CategoryPercent[]): string {
  return categories[0]?.subtype ?? CATEGORY_META.work.subtype
}

export function buildResultSummary(
  baseDescription: string,
  categories: CategoryPercent[],
): string {
  const [first, second] = categories
  if (!first) return baseDescription

  if (second && first.percent - second.percent <= 12) {
    return `${baseDescription}\n\n특히 "${first.label}"과 "${second.label}" 문제가 동시에 터지면 퇴사를 진지하게 고민할 가능성이 높습니다.`
  }

  return `${baseDescription}\n\n특히 "${first.label}" 스트레스가 높을 때 퇴사 충동이 더 강해질 수 있습니다.`
}

export type ResultInsights = {
  categories: CategoryPercent[]
  subtype: string
  summary: string
  resignButton: string
  companyNeeds: string[]
}

export function buildResultInsights(
  test: TestDefinition,
  answers: TestAnswers,
  baseDescription: string,
): ResultInsights {
  const categories = calculateCategoryPercents(test, answers)

  return {
    categories,
    subtype: getResultSubtype(categories),
    summary: buildResultSummary(baseDescription, categories),
    resignButton: getResignButton(categories),
    companyNeeds: getCompanyNeeds(categories),
  }
}
