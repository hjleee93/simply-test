export const DRAWING_ELEMENT_IDS = [
  'house',
  'tree',
  'person',
  'path',
  'sun',
  'flower',
  'animal',
  'door',
  'window',
] as const

export type DrawingElementId = (typeof DRAWING_ELEMENT_IDS)[number]
export type DrawingSize = 'small' | 'medium' | 'large'
export type DrawingPlace = 'left' | 'center' | 'right' | 'top' | 'bottom' | 'spread'

export type DrawingElement = {
  id: DrawingElementId
  size: DrawingSize
  place: DrawingPlace
  detail: string
}

export type DrawingLine = {
  title: string
  observation: string
  question: string
}

export type DrawingReadResult = {
  model: string
  blank: boolean
  elements: DrawingElement[]
  lines: DrawingLine[]
}

const LABELS: Record<DrawingElementId, string> = {
  house: '집',
  tree: '나무',
  person: '사람',
  path: '길',
  sun: '해',
  flower: '꽃',
  animal: '동물',
  door: '문',
  window: '창',
}

const ID_ALIASES: Record<string, DrawingElementId> = {
  house: 'house',
  집: 'house',
  tree: 'tree',
  나무: 'tree',
  person: 'person',
  사람: 'person',
  path: 'path',
  road: 'path',
  길: 'path',
  도로: 'path',
  sun: 'sun',
  해: 'sun',
  태양: 'sun',
  flower: 'flower',
  꽃: 'flower',
  animal: 'animal',
  동물: 'animal',
  door: 'door',
  문: 'door',
  window: 'window',
  창: 'window',
  창문: 'window',
}

const PLACES = new Set<DrawingPlace>(['left', 'center', 'right', 'top', 'bottom', 'spread'])
const SIZES = new Set<DrawingSize>(['small', 'medium', 'large'])

const PLACE_LABEL: Record<DrawingPlace, string> = {
  left: '왼쪽',
  center: '',
  right: '오른쪽',
  top: '위쪽',
  bottom: '아래쪽',
  spread: '여러 곳',
}

const COPY: Record<DrawingElementId, Record<DrawingSize, { observation: string; question: string }>> = {
  house: {
    large: {
      observation: '집이 그림에서 크게 보여요.',
      question: '요즘 머무는 자리를 중요하게 느끼고 있나요?',
    },
    medium: {
      observation: '집이 그려져 있어요.',
      question: '그 집은 편한 곳에 가깝나요?',
    },
    small: {
      observation: '집이 작게 그려져 있어요.',
      question: '지금 내가 있는 자리를 조금 떨어져서 보고 있나요?',
    },
  },
  tree: {
    large: {
      observation: '나무가 크게 서 있어요.',
      question: '요즘 키우고 있는 것이 있나요?',
    },
    medium: {
      observation: '나무가 그려져 있어요.',
      question: '그 나무는 어떤 계절에 가깝게 보이나요?',
    },
    small: {
      observation: '나무가 작게 있어요.',
      question: '아직 자리 잡는 중인 것이 떠오르나요?',
    },
  },
  person: {
    large: {
      observation: '사람이 크게 표현됐어요.',
      question: '그 사람은 누구에 가깝게 느껴지나요?',
    },
    medium: {
      observation: '사람이 보여요.',
      question: '그 사람은 누구인가요?',
    },
    small: {
      observation: '사람이 작게 있어요.',
      question: '그 사람과 나의 거리는 어떤가요?',
    },
  },
  path: {
    large: {
      observation: '길이 크게 표현됐네요.',
      question: '요즘 새로운 방향을 생각하고 있나요?',
    },
    medium: {
      observation: '길이 그려져 있어요.',
      question: '그 길을 따라가면 무엇이 있을 것 같나요?',
    },
    small: {
      observation: '길이 작게 이어져 있어요.',
      question: '그 길은 어디로 가면 좋을 것 같나요?',
    },
  },
  sun: {
    large: {
      observation: '해가 크게 보여요.',
      question: '그림 안에서 밝은 쪽은 어디인가요?',
    },
    medium: {
      observation: '해가 보여요.',
      question: '그림 안에서 밝은 쪽은 어디인가요?',
    },
    small: {
      observation: '해가 작게 있어요.',
      question: '그 해는 그림의 어느 쪽을 비추고 있나요?',
    },
  },
  flower: {
    large: {
      observation: '꽃이 크게 있어요.',
      question: '그 꽃은 누구에게 주고 싶은가요?',
    },
    medium: {
      observation: '꽃이 있어요.',
      question: '그 꽃은 누구에게 주고 싶은가요?',
    },
    small: {
      observation: '꽃이 작게 있어요.',
      question: '그 꽃은 막 피기 시작한 쪽에 가까운가요?',
    },
  },
  animal: {
    large: {
      observation: '동물이 크게 있어요.',
      question: '그 동물은 어떤 기분으로 보이나요?',
    },
    medium: {
      observation: '동물이 있어요.',
      question: '그 동물은 어떤 기분으로 보이나요?',
    },
    small: {
      observation: '동물이 작게 있어요.',
      question: '그 동물은 어디로 향하고 있나요?',
    },
  },
  door: {
    large: {
      observation: '문이 크게 보여요.',
      question: '그 문은 열려 있는 쪽에 가까운가요?',
    },
    medium: {
      observation: '문이 보여요.',
      question: '그 문은 열려 있는 쪽에 가까운가요?',
    },
    small: {
      observation: '문이 작게 있어요.',
      question: '그 문으로 들어가고 싶은가요, 나오고 싶은가요?',
    },
  },
  window: {
    large: {
      observation: '창이 크게 보여요.',
      question: '창 안과 창 밖, 어디가 더 마음에 남나요?',
    },
    medium: {
      observation: '창이 보여요.',
      question: '창 안과 창 밖, 어디가 더 마음에 남나요?',
    },
    small: {
      observation: '창이 작게 있어요.',
      question: '그 창으로 무엇이 보이면 좋을까요?',
    },
  },
}

const LINE_ORDER: DrawingElementId[] = [
  'house',
  'tree',
  'person',
  'path',
  'sun',
  'window',
  'door',
  'flower',
  'animal',
]

export function elementLabel(id: DrawingElementId): string {
  return LABELS[id]
}

export function placeLabel(place: DrawingPlace): string {
  return PLACE_LABEL[place]
}

function asElementId(value: unknown): DrawingElementId | null {
  if (typeof value !== 'string') return null
  return ID_ALIASES[value.trim().toLowerCase()] ?? ID_ALIASES[value.trim()] ?? null
}

function asSize(value: unknown): DrawingSize {
  return typeof value === 'string' && SIZES.has(value as DrawingSize) ? (value as DrawingSize) : 'medium'
}

function asPlace(value: unknown): DrawingPlace {
  return typeof value === 'string' && PLACES.has(value as DrawingPlace) ? (value as DrawingPlace) : 'center'
}

export function normalizeElements(value: unknown): DrawingElement[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<DrawingElementId>()
  const elements: DrawingElement[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const record = item as Record<string, unknown>
    const id = asElementId(record.id)
    if (!id || seen.has(id)) continue
    seen.add(id)
    const detail = typeof record.detail === 'string' ? record.detail.trim().slice(0, 80) : ''
    elements.push({ id, size: asSize(record.size), place: asPlace(record.place), detail })
  }
  return elements
}

function withPlace(observation: string, place: DrawingPlace): string {
  const label = PLACE_LABEL[place]
  if (!label) return observation
  return `${observation} 화면 ${label}에 있어요.`
}

function missingTopic(names: string[]): string {
  const last = names[names.length - 1] ?? ''
  const particle = last === '나무' ? '는' : '은'
  return `${names.join(', ')}${particle}`
}

export function interpretDrawing(elements: DrawingElement[]): DrawingLine[] {
  if (elements.length === 0) {
    return [
      {
        title: '그림',
        observation: '집, 나무, 사람처럼 알아볼 모양이 거의 안 보여요.',
        question: '집, 나무, 사람 중 하나를 조금 더 분명하게 그려 볼까요?',
      },
    ]
  }

  const byId = new Map(elements.map((element) => [element.id, element]))
  const lines: DrawingLine[] = []
  for (const id of LINE_ORDER) {
    const element = byId.get(id)
    if (!element) continue
    const copy = COPY[id][element.size]
    lines.push({
      title: LABELS[id],
      observation: withPlace(copy.observation, element.place),
      question: copy.question,
    })
    if (lines.length >= 4) break
  }

  const missing = (['house', 'tree', 'person'] as const)
    .filter((id) => !byId.has(id))
    .map((id) => LABELS[id])
  if (missing.length > 0 && missing.length < 3) {
    lines.push({
      title: '빠진 요소',
      observation: `${missingTopic(missing)} 잘 안 보여요.`,
      question: '오늘은 무엇이 먼저 떠올랐나요?',
    })
  }

  return lines
}
