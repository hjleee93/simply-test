import type { TestAnswers, TestDefinition, TestResult, TestResultTemplate } from '../types/test'
import { buildGenderInsights } from './gender'
import { buildKkondaeInsights } from './kkondae'
import { buildResultInsights, type CategoryPercent } from './resultInsights'
import { isPatternScoring } from './scoring'

export type ResultBlock =
  | { kind: 'prose'; title?: string; text: string; soft?: boolean }
  | { kind: 'list'; title: string; items: string[]; checked?: boolean; soft?: boolean }
  | { kind: 'quote'; title: string; text: string; soft?: boolean; marks?: boolean }
  | { kind: 'bars'; title: string; items: CategoryPercent[] }
  | { kind: 'note'; text: string }

export type ResultHeader = {
  mode: 'score' | 'type'
  caption: string
  headline: string
  oneLiner?: string
  subtitle?: string
  matchText?: string
  percent: number
  poster: boolean
  keywordBadge?: string
  tone: 'default' | 'halloween'
  divider?: string
}

export type ResultModel = {
  pageTitle: string
  pageDescription: string
  theme: 'default' | 'halloween' | 'meme'
  header: ResultHeader
  blocks: ResultBlock[]
  shareText: string
  shareTitle: string
}

type FieldLabels = {
  description: string | null
  strengths: string
  blindSpots: string
  situations: string
  characteristics: string
  warning: string
  advice: string
  adviceQuoted: boolean
}

const PATTERN_LABELS: FieldLabels = {
  description: '당신의 특징',
  strengths: '당신의 장점',
  blindSpots: '당신이 놓치기 쉬운 부분',
  situations: '이런 모습이 나와요',
  characteristics: '특징',
  warning: '주의',
  advice: '당신에게 필요한 한마디',
  adviceQuoted: true,
}

const SCORE_LABELS: FieldLabels = {
  description: null,
  strengths: '장점',
  blindSpots: '놓치기 쉬운 점',
  situations: '이런 모습이 나와요',
  characteristics: '특징',
  warning: '주의',
  advice: '한마디 조언',
  adviceQuoted: false,
}

const LABEL_OVERRIDES: Partial<Record<TestResultTemplate, Partial<FieldLabels>>> = {
  relationship: { situations: '인간관계에서 이런 모습을 보여요' },
  company: { situations: '회사에서 이런 모습이 나와요' },
  jinsang: { characteristics: '진상 특징' },
  movie: {
    description: '🎬 내 영화 줄거리',
    strengths: '✨ 주인공의 장점',
    blindSpots: '👀 놓치기 쉬운 장면',
    advice: '💌 다음 장면을 위한 한마디',
    adviceQuoted: false,
  },
  halloween: {
    description: '🦹 내 안의 빌런 본성',
    strengths: '⚡ 타고난 빌런력',
    blindSpots: '🚨 폭주 주의보',
    situations: '🪄 찰떡 코스튬 포인트',
    advice: '💬 오늘 밤의 빌런 대사',
    adviceQuoted: true,
  },
}

function labelsFor(test: TestDefinition, pattern: boolean): FieldLabels {
  const base = pattern ? PATTERN_LABELS : SCORE_LABELS
  const override = test.resultTemplate ? LABEL_OVERRIDES[test.resultTemplate] : undefined
  return { ...base, ...override }
}

function filled(items: string[] | undefined): string[] {
  return items?.map((item) => item.trim()).filter(Boolean) ?? []
}

function fieldBlocks(result: TestResult, labels: FieldLabels): ResultBlock[] {
  const blocks: ResultBlock[] = []
  const description = result.description?.trim()
  if (description) {
    blocks.push({ kind: 'prose', title: labels.description ?? undefined, text: description })
  }

  const characteristics = filled(result.characteristics)
  if (characteristics.length > 0) {
    blocks.push({ kind: 'list', title: labels.characteristics, items: characteristics, soft: true })
  }

  const strengths = filled(result.strengths)
  if (strengths.length > 0) {
    blocks.push({ kind: 'list', title: labels.strengths, items: strengths, checked: true, soft: true })
  }

  const blindSpots = filled(result.blindSpots)
  if (blindSpots.length > 0) {
    blocks.push({ kind: 'list', title: labels.blindSpots, items: blindSpots })
  }

  const situations = filled(result.situations)
  if (situations.length > 0) {
    blocks.push({ kind: 'list', title: labels.situations, items: situations, soft: true })
  }

  const warning = result.warning?.trim()
  if (warning) {
    blocks.push({ kind: 'quote', title: labels.warning, text: warning, soft: true, marks: false })
  }

  const advice = result.advice?.trim()
  if (advice) {
    blocks.push(
      labels.adviceQuoted
        ? { kind: 'quote', title: labels.advice, text: advice, marks: true }
        : { kind: 'prose', title: labels.advice, text: advice },
    )
  }

  const viralHint = result.viralHint?.trim()
  if (viralHint) blocks.push({ kind: 'note', text: viralHint })

  return blocks
}

function scoreCaption(result: TestResult, resultLabel: string) {
  return `${result.emoji} 당신의 ${resultLabel}`
}

export function buildResultModel(input: {
  test: TestDefinition
  result: TestResult
  answers: TestAnswers
  percent: number
  resultLabel: string
}): ResultModel {
  const { test, result, answers, percent, resultLabel } = input
  const pattern = isPatternScoring(test)
  const template = test.resultTemplate
  const labels = labelsFor(test, pattern)

  if (test.id === 'retirement-threshold') {
    const insights = buildResultInsights(test, answers, result.description)
    return {
      pageTitle: `${resultLabel} ${percent}% · ${result.title} | Simply Test`,
      pageDescription: `나의 ${resultLabel}는 ${percent}%! ${result.title} (${insights.subtype})`,
      theme: 'default',
      shareText: `${resultLabel} ${percent}% · ${result.title} (${insights.subtype})`,
      shareTitle: `${resultLabel} 테스트 결과`,
      header: {
        mode: 'score',
        caption: scoreCaption(result, resultLabel),
        headline: result.title,
        subtitle: insights.subtype,
        percent,
        poster: false,
        tone: 'default',
      },
      blocks: [
        { kind: 'prose', text: insights.summary },
        { kind: 'bars', title: '당신을 퇴사하게 만드는 것', items: insights.categories },
        { kind: 'quote', title: '당신의 퇴사 버튼', text: insights.resignButton, soft: true, marks: true },
        { kind: 'list', title: '당신에게 필요한 회사', items: insights.companyNeeds, checked: true },
      ],
    }
  }

  const blocks = fieldBlocks(result, labels)

  if (test.id === 'kkondae-test') {
    const insights = buildKkondaeInsights(percent)
    blocks.push(
      { kind: 'quote', title: '꼰대 레이더 상태', text: insights.radarLevel, soft: true, marks: false },
      { kind: 'quote', title: '후배 반응 예상', text: insights.juniorReaction, soft: true, marks: false },
      { kind: 'prose', title: '한마디 조언', text: insights.tip },
    )
  }

  if (test.id === 'gender-fanatic-test') {
    const insights = buildGenderInsights(percent)
    blocks.push(
      { kind: 'quote', title: '이성 레이더 상태', text: insights.radarLevel, soft: true, marks: false },
      { kind: 'quote', title: '친구 반응 예상', text: insights.friendReaction, soft: true, marks: false },
      { kind: 'prose', title: '한마디 조언', text: insights.tip },
    )
  }

  const shareText =
    result.shareText ??
    (pattern
      ? `${resultLabel} · ${result.title} (${result.keyword})`
      : `${resultLabel} ${percent}% · ${result.title} (${result.keyword})`)

  if (template === 'movie') {
    return {
      pageTitle: `${result.title} · ${resultLabel} | Simply Test`,
      pageDescription: `${test.title} 결과: ${result.title}. ${result.oneLiner ?? result.description}`,
      theme: 'default',
      shareText: result.shareText ?? `${test.title} · ${result.title}`,
      shareTitle: `${test.title} 결과`,
      header: {
        mode: 'type',
        caption: `${result.emoji} ${resultLabel}`,
        headline: result.title,
        oneLiner: result.oneLiner,
        matchText: `${result.keyword} · 장르 일치도 ${percent}%`,
        percent,
        poster: true,
        tone: 'default',
      },
      blocks,
    }
  }

  if (template === 'halloween') {
    return {
      pageTitle: `${result.title} · ${resultLabel} | Simply Test`,
      pageDescription: `내 안의 영화 빌런은 「${result.title}」! ${result.keyword}`,
      theme: 'halloween',
      shareText: result.shareText ?? `내 안의 영화 빌런은 ${result.title}! ${result.keyword}`,
      shareTitle: `${resultLabel} 테스트 결과`,
      header: {
        mode: 'type',
        caption: scoreCaption(result, resultLabel),
        headline: `당신은 「${result.title}」 재질입니다.`,
        keywordBadge: `🎭 ${result.keyword}`,
        matchText: `빌런 일치도 ${percent}%`,
        percent,
        poster: false,
        tone: 'halloween',
        divider: '🎃 빌런 분석 리포트 🎃',
      },
      blocks,
    }
  }

  if (template === 'meme') {
    const answeredCount = Object.keys(answers).length
    const knownCount = Math.round((percent / 100) * answeredCount)
    return {
      pageTitle: `${answeredCount}문제 중 ${knownCount}문제 · ${result.title} | Simply Test`,
      pageDescription: `${test.title} 결과: ${answeredCount}문제 중 ${knownCount}문제. ${result.title}`,
      theme: 'meme',
      shareText,
      shareTitle: `${resultLabel} 테스트 결과`,
      header: {
        mode: 'score',
        caption: scoreCaption(result, resultLabel),
        headline: result.title,
        subtitle: result.keyword,
        percent,
        poster: false,
        tone: 'default',
      },
      blocks,
    }
  }

  if (pattern) {
    return {
      pageTitle: `${result.title} · ${resultLabel} | Simply Test`,
      pageDescription: `당신은 「${result.title}」입니다. ${result.keyword}`,
      theme: 'default',
      shareText,
      shareTitle: `${resultLabel} 테스트 결과`,
      header: {
        mode: 'type',
        caption: scoreCaption(result, resultLabel),
        headline: `당신은 「${result.title}」입니다.`,
        oneLiner: result.oneLiner,
        subtitle: result.keyword,
        matchText: `일치도 ${percent}%`,
        percent,
        poster: false,
        tone: 'default',
      },
      blocks,
    }
  }

  return {
    pageTitle: `${resultLabel} ${percent}% · ${result.title} | Simply Test`,
    pageDescription: `나의 ${resultLabel}는 ${percent}%! ${result.title} (${result.keyword})`,
    theme: 'default',
    shareText,
    shareTitle: `${resultLabel} 테스트 결과`,
    header: {
      mode: 'score',
      caption: scoreCaption(result, resultLabel),
      headline: result.title,
      subtitle: result.keyword,
      percent,
      poster: false,
      tone: 'default',
    },
    blocks,
  }
}
