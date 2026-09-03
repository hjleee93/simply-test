import type { Question, TestResult } from '../types/test'
import og from '../lib/og.json' with { type: 'json' }

const meta = og.tests.find((test) => test.id === 'relationship-pattern-test')!

const RELATIONSHIP_CHAR = '/characters/pixel/relationship'

export const relationshipPatternTest = {
  id: meta.id,
  title: meta.title,
  description: meta.description,
  scoringMode: 'pattern' as const,
  resultTemplate: 'relationship' as const,
  thumbnailCharacter: 'relationship/main',
  resultLabel: '관계 패턴',

  questions: [
    {
      id: 1,
      question: '친구가 고민을 털어놨을 때, 나는 보통',
      answers: [
        { id: 'a', text: '일단 끝까지 들어주고 공감부터 한다', patternScores: { empathy: 2, accommodating: 1 } },
        { id: 'b', text: '어떻게 해결할 수 있을지 방법을 같이 생각한다', patternScores: { solver: 2 } },
        { id: 'c', text: '상황을 파악한 뒤 어떻게 대답할지 정한다', patternScores: { observer: 2 } },
        { id: 'd', text: '친한 친구일수록 솔직하게 내 생각을 말한다', patternScores: { selective: 2 } },
      ],
    },
    {
      id: 2,
      question: '친구가 약속 시간에 30분 늦었다. 계속 미안하다고 한다면?',
      answers: [
        { id: 'a', text: '괜찮다고 하고 그냥 넘어간다', patternScores: { accommodating: 2, empathy: 1 } },
        { id: 'b', text: '무슨 일이 있었는지 먼저 물어본다', patternScores: { empathy: 2 } },
        { id: 'c', text: '다음부터는 늦지 말라고 이야기한다', patternScores: { boundary: 2 } },
        { id: 'd', text: '괜찮다고 말하지만 조금 마음에 남는다', patternScores: { observer: 2 } },
      ],
    },
    {
      id: 3,
      question: '친구가 약속 직전에 갑자기 취소했다. 나는',
      answers: [
        { id: 'a', text: '괜찮다고 하고 바로 이해해준다', patternScores: { accommodating: 2 } },
        { id: 'b', text: '괜찮은지, 무슨 일인지 먼저 물어본다', patternScores: { empathy: 2 } },
        { id: 'c', text: '다음엔 미리 말해달라고 조용히 전한다', patternScores: { boundary: 2 } },
        { id: 'd', text: '표현은 안 하지만 속으로는 아쉽다', patternScores: { observer: 2 } },
      ],
    },
    {
      id: 4,
      question: '평소보다 답장이 늦는 사람에게, 나는',
      answers: [
        { id: 'a', text: '별일 없겠거니 하고 기다린다', patternScores: { observer: 2 } },
        { id: 'b', text: '무슨 일 있는지 먼저 연락해본다', patternScores: { empathy: 2 } },
        { id: 'c', text: '바쁘겠거니 생각하며 기다린다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '연락이 줄면 나도 거리를 조절한다', patternScores: { boundary: 2 } },
      ],
    },
    {
      id: 5,
      question: '누군가 나에게 서운했다고 말해왔을 때, 나는',
      answers: [
        { id: 'a', text: '상대 기분부터 이해하려고 한다', patternScores: { empathy: 2 } },
        { id: 'b', text: '일단 미안하다고 하고 분위기를 풀려 한다', patternScores: { accommodating: 2 } },
        { id: 'c', text: '어떻게 풀면 좋을지 방법을 찾는다', patternScores: { solver: 2 } },
        { id: 'd', text: '왜 서운했는지 먼저 정리하고 생각한다', patternScores: { observer: 2 } },
      ],
    },
    {
      id: 6,
      question: '도와주기 어려운 부탁을 받았을 때, 나는',
      answers: [
        { id: 'a', text: '솔직하게 어렵다고 말한다', patternScores: { boundary: 2 } },
        { id: 'b', text: '거절하기 미안해서 애매하게 넘긴다', patternScores: { accommodating: 2 } },
        { id: 'c', text: '상황을 설명하며 정중히 거절한다', patternScores: { empathy: 2, boundary: 1 } },
        { id: 'd', text: '친한 사람에게만 솔직하게 거절한다', patternScores: { selective: 2 } },
      ],
    },
    {
      id: 7,
      question: '친하지 않은 사람이 갑자기 고민을 털어놨을 때, 나는',
      answers: [
        { id: 'a', text: '적당히 들어주되 선은 지킨다', patternScores: { boundary: 2, empathy: 1 } },
        { id: 'b', text: '공감해주며 대화를 이어간다', patternScores: { empathy: 2 } },
        { id: 'c', text: '부담스럽지만 끝까지 들어준다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '가벼운 위로만 하고 깊게는 안 들어간다', patternScores: { guarded: 2 } },
      ],
    },
    {
      id: 8,
      question: '친구와 의견이 다를 때, 나는',
      answers: [
        { id: 'a', text: '갈등이 싫어서 맞춰주는 편이다', patternScores: { accommodating: 2 } },
        { id: 'b', text: '왜 그렇게 생각하는지 먼저 물어본다', patternScores: { empathy: 2 } },
        { id: 'c', text: '내 생각을 분명하게 말한다', patternScores: { boundary: 2 } },
        { id: 'd', text: '친한 친구일수록 솔직하게 토론한다', patternScores: { selective: 2 } },
      ],
    },
    {
      id: 9,
      question: '상대방에게 서운한 일이 있었을 때, 나는',
      answers: [
        { id: 'a', text: '혼자 정리하고 넘기는 편이다', patternScores: { observer: 2 } },
        { id: 'b', text: '상대 입장도 생각해보려 한다', patternScores: { empathy: 2 } },
        { id: 'c', text: '크게 말하지 않고 참는다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '친한 사람에게만 털어놓는다', patternScores: { selective: 2 } },
      ],
    },
    {
      id: 10,
      question: '누군가 내 말을 오해했을 때, 나는',
      answers: [
        { id: 'a', text: '기분 상하지 않게 오해를 풀려 한다', patternScores: { empathy: 2 } },
        { id: 'b', text: '사실 관계를 차분히 설명한다', patternScores: { solver: 2 } },
        { id: 'c', text: '왜 오해했는지 먼저 파악한다', patternScores: { observer: 2 } },
        { id: 'd', text: '그렇게 느낄 수 있다고 인정한 뒤 설명한다', patternScores: { boundary: 2 } },
      ],
    },
    {
      id: 11,
      question: '친구가 힘든 일을 겪고 있을 때, 나는',
      answers: [
        { id: 'a', text: '밥 사주거나 필요한 걸 챙겨준다', patternScores: { action: 2 } },
        { id: 'b', text: '말보다 옆에 있어주는 편이다', patternScores: { empathy: 2, accommodating: 1 } },
        { id: 'c', text: '어떻게 하면 나아질지 같이 고민한다', patternScores: { solver: 2 } },
        { id: 'd', text: '괜찮아질 때까지 조용히 지켜본다', patternScores: { observer: 2 } },
      ],
    },
    {
      id: 12,
      question: '상대방이 계속해서 부탁을 할 때, 나는',
      answers: [
        { id: 'a', text: '선을 긋고 거절한다', patternScores: { boundary: 2 } },
        { id: 'b', text: '미안하지만 어렵다고 말하기 힘들다', patternScores: { accommodating: 2 } },
        { id: 'c', text: '왜 계속 부탁하는지 먼저 물어본다', patternScores: { empathy: 2 } },
        { id: 'd', text: '패턴을 보고 관계를 조절한다', patternScores: { observer: 2 } },
      ],
    },
    {
      id: 13,
      question: '친한 친구가 나에게 실수를 했을 때, 나는',
      answers: [
        { id: 'a', text: '솔직하게 서운했던 점을 말한다', patternScores: { selective: 2 } },
        { id: 'b', text: '괜찮다고 하며 이해해준다', patternScores: { empathy: 2 } },
        { id: 'c', text: '크게 문제 삼지 않고 넘긴다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '말 대신 뭔가 챙겨주며 풀어준다', patternScores: { action: 2 } },
      ],
    },
    {
      id: 14,
      question: '모임에서 처음 보는 사람을 만났을 때, 나는',
      answers: [
        { id: 'a', text: '적당한 거리를 두고 천천히 지켜본다', patternScores: { guarded: 2 } },
        { id: 'b', text: '밝게 대화하며 분위기를 풀어준다', patternScores: { empathy: 2 } },
        { id: 'c', text: '말수는 적지만 상대를 관찰한다', patternScores: { observer: 2 } },
        { id: 'd', text: '금방 친해지진 않지만 편해지면 확 달라진다', patternScores: { selective: 2 } },
      ],
    },
    {
      id: 15,
      question: '상대방이 나에게 지나치게 의지할 때, 나는',
      answers: [
        { id: 'a', text: '도움 줄 선은 분명히 정한다', patternScores: { boundary: 2 } },
        { id: 'b', text: '왜 그렇게 의지하는지 먼저 물어본다', patternScores: { empathy: 2 } },
        { id: 'c', text: '거절하기 어려워 계속 도와준다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '부담스러워서 자연스럽게 거리를 둔다', patternScores: { guarded: 2 } },
      ],
    },
    {
      id: 16,
      question: '관계에서 갈등이 생겼을 때, 나는',
      answers: [
        { id: 'a', text: '상대 감정부터 살핀 뒤 대화한다', patternScores: { empathy: 2 } },
        { id: 'b', text: '문제를 어떻게 풀지부터 생각한다', patternScores: { solver: 2 } },
        { id: 'c', text: '일단 넘기고 시간이 풀어주길 기다린다', patternScores: { accommodating: 2 } },
        { id: 'd', text: '정리할 부분을 명확히 말하고 대화한다', patternScores: { boundary: 2 } },
      ],
    },
  ] as Question[],

  results: [
    {
      id: 'empathy',
      min: 0,
      max: 0,
      emoji: '💗',
      title: '마음을 먼저 살피는 사람',
      keyword: '상대의 기분이 먼저 보이는 타입',
      description:
        '당신은 대화에서 상대의 감정과 상황을 먼저 읽으려는 편입니다. 누군가 힘들어 보이면 "무슨 일 있어?"보다 "괜찮아?"가 먼저 나올 수 있고, 갈등 상황에서도 상대 기분을 헤집지 않으려 노력합니다. 공감이 빠르고 배려가 자연스럽게 나오는 타입이라, 주변에서는 편하게 마음을 털어놓는 사람으로 기억할 가능성이 높습니다.',
      strengths: [
        '상대의 감정 변화를 비교적 빨리 알아채는 편',
        '대화에서 상대가 위축되지 않게 분위기를 챙김',
        '관계를 유지하는 데 감정적 연결을 중요하게 여김',
      ],
      blindSpots: [
        '공감 능력 → 상대 감정까지 지나치게 짊어질 수 있음',
        '배려 → 내 감정을 뒤로 미루는 습관으로 이어질 수 있음',
        '분위기 유지 → 꼭 필요한 말을 늦게 하게 될 수 있음',
      ],
      situations: [
        '친구가 힘들다고 하면 해결책보다 "많이 힘들었겠다"가 먼저',
        '서운하다는 말을 들으면 변명보다 상대 기분부터 받아들임',
        '분위기가 어색해지면 내가 먼저 대화를 부드럽게 돌림',
      ],
      advice: '공감도 중요하지만, 내 마음을 표현하는 것도 배려입니다.',
      shareText: '나는 「마음을 먼저 살피는 사람」 · 상대의 기분이 먼저 보이는 타입',
      viralHint: '친구한테 시켜보면 은근 나랑 다른 패턴이 나올 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/empathy.png`,
    },
    {
      id: 'boundary',
      min: 0,
      max: 0,
      emoji: '🛡️',
      title: '선을 잘 지키는 사람',
      keyword: '친절하지만 거리는 분명한 타입',
      description:
        '당신은 관계에서 친절함과 개인의 영역을 동시에 중요하게 생각합니다. 좋은 관계를 유지하고 싶지만, 무조건 맞추거나 관계에 휘둘리는 편은 아닙니다. 필요할 때는 거절도 하고, 약속이나 연락에서도 서로의 시간을 존중하려는 태도가 드러납니다. 겉으로는 차분해 보여도, 속으로는 관계의 기준을 꽤 분명하게 가지고 있는 타입입니다.',
      strengths: [
        '관계에서 무리하게 끌려가지 않는 편',
        '거절이나 의견 표현을 비교적 분명하게 할 수 있음',
        '장기적으로 지속 가능한 관계를 지향함',
      ],
      blindSpots: [
        '선 지키기 → 차갑거나 냉정해 보일 수 있음',
        '분명함 → 상대가 부담스럽게 느낄 때가 있음',
        '거리 유지 → 가까워지는 속도가 느리게 느껴질 수 있음',
      ],
      situations: [
        '반복되는 부탁에는 "이번엔 어렵다"고 말하는 편',
        '약속 취소나 지각에는 다음을 위한 기준을 전달함',
        '너무 가까워지려는 사람에게는 자연스럽게 거리를 둠',
      ],
      advice: '선을 지키는 것과 따뜻함은 함께 갈 수 있어요.',
      shareText: '나는 「선을 잘 지키는 사람」 · 친절하지만 거리는 분명한 타입',
      viralHint: '내가 생각하는 나와 친구가 보는 나는 다를 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/boundary.png`,
    },
    {
      id: 'action',
      min: 0,
      max: 0,
      emoji: '🤝',
      title: '행동으로 챙기는 사람',
      keyword: '말보다 손이 먼저 움직이는 타입',
      description:
        '당신은 마음을 표현할 때 말보다 행동을 택하는 편입니다. "괜찮아?"라고 묻기보다 밥을 사주거나, 필요한 걸 챙겨주거나, 직접 도와주는 방식으로 관계를 만들어갑니다. 상대가 힘들 때 옆에 있어주는 것 자체를 중요하게 여기며, 실질적인 도움을 통해 신뢰를 쌓는 타입입니다.',
      strengths: [
        '말보다 행동으로 마음을 보여주는 편',
        '상대가 필요한 것을 먼저 챙겨주려 함',
        '믿음직하고 든든한 이미지를 줄 수 있음',
      ],
      blindSpots: [
        '행동 중심 → 내 감정을 말로 표현하는 데 서툴 수 있음',
        '챙김 → 상대가 부담스럽게 느낄 수 있음',
        '실행력 → 상대가 원하는 게 공감일 때 엇갈릴 수 있음',
      ],
      situations: [
        '친구가 힘들다고 하면 위로보다 뭔가 챙겨주려 함',
        '고마운 마음도 "고마워"보다 행동으로 표현하는 편',
        '실수한 친구에게 말보다 대신 뭔가 해주며 풀어줌',
      ],
      advice: '행동도 좋지만, 가끔은 말 한마디가 더 클 때가 있어요.',
      shareText: '나는 「행동으로 챙기는 사람」 · 말보다 손이 먼저 움직이는 타입',
      viralHint: '이거 친구한테 시켜보면 은근 결과가 다르게 나와요.',
      characterImage: `${RELATIONSHIP_CHAR}/action.png`,
    },
    {
      id: 'accommodating',
      min: 0,
      max: 0,
      emoji: '🫠',
      title: '맞춰주다 지치는 사람',
      keyword: '갈등은 피하지만 혼자 쌓이는 타입',
      description:
        '당신은 관계를 유지하기 위해 상대에게 맞춰주는 경우가 많습니다. 갈등을 피하고 분위기를 해치지 않으려 하다 보니, 싫은 것도 참거나 거절을 늦게 하는 편입니다. 배려심이 많고 상대를 생각하는 마음은 진심이지만, 그 마음이 쌓이면 혼자 지치게 될 수 있습니다.',
      strengths: [
        '분위기를 해치지 않으려 노력하는 편',
        '상대를 배려하는 마음이 깊음',
        '관계를 유지하려는 의지가 강함',
      ],
      blindSpots: [
        '배려 → 지나친 맞춤으로 스트레스가 쌓일 수 있음',
        '갈등 회피 → 꼭 필요한 말을 늦게 하게 됨',
        '참음 → 상대는 전혀 모르고 지나갈 수 있음',
      ],
      situations: [
        '의견이 달라도 "그래, 그렇게 하자"고 넘기는 경우가 많음',
        '거절하기 어려운 부탁을 받으면 결국 도와주는 편',
        '서운해도 크게 말하지 않고 혼자 정리함',
      ],
      advice: '참는 것이 항상 배려는 아니에요.',
      shareText: '나는 「맞춰주다 지치는 사람」 · 갈등은 피하지만 혼자 쌓이는 타입',
      viralHint: '친구한테 시켜보면 은근 나랑 다른 패턴이 나올 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/accommodating.png`,
    },
    {
      id: 'selective',
      min: 0,
      max: 0,
      emoji: '🔓',
      title: '가까운 사람에게 더 솔직한 사람',
      keyword: '관계의 깊이에 따라 다른 타입',
      description:
        '당신은 모든 사람에게 똑같이 친밀하게 대하기보다, 관계의 깊이에 따라 표현 방식이 달라집니다. 친해지면 굉장히 솔직하고 편하게 대하지만, 그렇지 않은 사람에게는 다소 무뚝뚝하거나 조심스러운 모습을 보일 수 있습니다. 가까운 사람에게는 진짜 모습을 보여주는 타입입니다.',
      strengths: [
        '친한 사람에게는 진심을 솔직하게 표현함',
        '관계의 깊이에 맞는 거리를 자연스럽게 조절',
        '가까운 관계에서 깊은 신뢰를 쌓을 수 있음',
      ],
      blindSpots: [
        '선택적 친밀 → 안 친한 사람에게는 차갑게 보일 수 있음',
        '솔직함 → 가까운 사람에게만 강하게 나타남',
        '거리 조절 → 새로운 관계에서 답답하게 느껴질 수 있음',
      ],
      situations: [
        '친한 친구에게는 서운한 것도 바로 말하는 편',
        '처음 만난 사람에게는 말수가 줄어드는 경우가 많음',
        '의견이 다를 때도 친한 친구일수록 토론을 편하게 함',
      ],
      advice: '솔직함은 좋지만, 거리감도 때로는 신호입니다.',
      shareText: '나는 「가까운 사람에게 더 솔직한 사람」 · 관계의 깊이에 따라 다른 타입',
      viralHint: '내가 생각하는 나와 친구가 보는 나는 다를 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/selective.png`,
    },
    {
      id: 'guarded',
      min: 0,
      max: 0,
      emoji: '🔒',
      title: '쉽게 마음을 열지 않는 사람',
      keyword: '천천히 신뢰하지만 오래 가는 타입',
      description:
        '당신은 처음에는 일정한 거리를 유지하며 상대를 지켜보는 편입니다. 금방 친해지거나 마음을 여는 타입은 아니지만, 한번 신뢰하면 오래 가는 관계를 만들 수 있습니다. 신뢰가 깨졌을 때는 다시 마음을 여는 데 시간이 걸릴 수 있습니다.',
      strengths: [
        '가벼운 관계에 쉽게 휘둘리지 않음',
        '신뢰한 사람과는 깊고 오래가는 관계를 만듦',
        '상대를 관찰한 뒤 관계를 시작하는 편',
      ],
      blindSpots: [
        '신중함 → 마음을 여는 데 오래 걸린다고 느껴질 수 있음',
        '거리 유지 → 관심 없어 보일 수 있음',
        '신뢰 회복 → 한번 깨지면 다시 열기 어려움',
      ],
      situations: [
        '처음 만난 사람에게는 적당한 거리를 두는 편',
        '친하지 않은 사람의 고민에는 깊게 들어가지 않음',
        '지나치게 의지하는 사람에게는 자연스럽게 거리를 둠',
      ],
      advice: '조심스러움과 무관심은 다릅니다. 가끔은 신호를 보내도 좋아요.',
      shareText: '나는 「쉽게 마음을 열지 않는 사람」 · 천천히 신뢰하지만 오래 가는 타입',
      viralHint: '이거 친구한테 시켜보면 은근 결과가 다르게 나와요.',
      characterImage: `${RELATIONSHIP_CHAR}/guarded.png`,
    },
    {
      id: 'solver',
      min: 0,
      max: 0,
      emoji: '🧩',
      title: '문제를 해결해주려는 사람',
      keyword: '공감보다 해결책이 먼저인 타입',
      description:
        '당신은 상대가 힘들다고 하면 공감보다 해결 방법을 먼저 생각하는 편입니다. "어떻게 하면 나아질까?"가 먼저 떠오르고, 현실적인 도움을 주려는 마음이 큽니다. 실질적인 조언과 행동으로 관계를 지키는 타입이지만, 상대가 원하는 게 해결책이 아닐 때 엇갈릴 수 있습니다.',
      strengths: [
        '현실적인 도움을 잘 줄 수 있음',
        '문제 상황에서 침착하게 대응하는 편',
        '실질적인 조언으로 신뢰를 얻을 수 있음',
      ],
      blindSpots: [
        '해결 중심 → 상대가 공감을 원할 때 아쉬울 수 있음',
        '조언 → 상대를 가르치려 한다고 느껴질 수 있음',
        '문제 해결 → 감정을 충분히 받아주지 못할 수 있음',
      ],
      situations: [
        '친구 고민을 들으면 "그래서 어떻게 할 거야?"가 먼저',
        '서운하다는 말을 들으면 어떻게 풀지 방법을 찾음',
        '갈등이 생기면 감정보다 문제 정리부터 함',
      ],
      advice: '해결책 전에 "많이 힘들었겠다" 한마디면 충분할 때가 있어요.',
      shareText: '나는 「문제를 해결해주려는 사람」 · 공감보다 해결책이 먼저인 타입',
      viralHint: '친구한테 시켜보면 은근 나랑 다른 패턴이 나올 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/solver.png`,
    },
    {
      id: 'observer',
      min: 0,
      max: 0,
      emoji: '👁️',
      title: '혼자서 판단하는 사람',
      keyword: '말보다 행동과 태도를 보는 타입',
      description:
        '당신은 상대방의 말보다 행동과 태도를 보고 관계를 판단하는 편입니다. 감정에 쉽게 휘둘리기보다 상황을 관찰하고, 혼자 정리한 뒤 반응하는 경우가 많습니다. 차분하고 이성적으로 보일 수 있지만, 혼자 판단하다 오해가 쌓일 가능성도 있습니다.',
      strengths: [
        '감정에 쉽게 휘둘리지 않는 편',
        '상대의 행동 패턴을 꽤 잘 파악함',
        '관계에서 차분하게 거리를 조절할 수 있음',
      ],
      blindSpots: [
        '관찰 → 상대가 답답하게 느낄 수 있음',
        '혼자 판단 → 오해를 키울 수 있음',
        '표현 절제 → 서운함을 혼자 쌓을 수 있음',
      ],
      situations: [
        '답장이 늦으면 별일 없겠거니 관찰부터 함',
        '서운한 일이 있어도 혼자 정리하고 넘기는 편',
        '약속 취소에 표현은 안 하지만 속으로는 아쉬움',
      ],
      advice: '혼자 정리하는 것도 좋지만, 가끔은 말로 확인하는 게 더 빠릅니다.',
      shareText: '나는 「혼자서 판단하는 사람」 · 말보다 행동과 태도를 보는 타입',
      viralHint: '내가 생각하는 나와 친구가 보는 나는 다를 수도 있어요.',
      characterImage: `${RELATIONSHIP_CHAR}/observer.png`,
    },
  ] as TestResult[],
} as const
