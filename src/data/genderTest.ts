import type { Question, TestResult } from '../types/test'
import og from '../lib/og.json' with { type: 'json' }

const meta = og.tests.find((test) => test.id === 'gender-fanatic-test')!

export const genderTest = {
  id: meta.id,
  title: meta.title,
  description: meta.description,
  scoringMode: 'simple' as const,
  requiresGender: true,
  thumbnailCharacter: 'subtle',
  resultLabel: '이성 관심도',

  questions: [
    {
      id: 1,
      question: '새로운 모임에 잘생긴/예쁜 사람이 한 명 있다면?',
      answers: [
        { id: 'a', text: '별로 관심 없다', score: 1 },
        { id: 'b', text: '오, 괜찮네', score: 2 },
        { id: 'c', text: '은근히 신경 쓰인다', score: 3 },
        { id: 'd', text: '어느 순간 그 사람 근처에 있다', score: 4 },
      ],
    },
    {
      id: 2,
      question: '친구가 "오늘 잘생긴/예쁜 애 온대"라고 한다면?',
      answers: [
        { id: 'a', text: '그래서 뭐?', score: 1 },
        { id: 'b', text: '누군데?', score: 2 },
        { id: 'c', text: '사진 있어?', score: 3 },
        { id: 'd', text: '몇 시에 가면 돼?', score: 4 },
      ],
    },
    {
      id: 3,
      question: '이성 친구가 갑자기 연락을 자주 하기 시작했다.',
      answers: [
        { id: 'a', text: '그냥 친구겠지', score: 1 },
        { id: 'b', text: '무슨 일 있나?', score: 2 },
        { id: 'c', text: '혹시 나한테 관심 있나?', score: 3 },
        { id: 'd', text: '일단 가능성부터 계산한다', score: 4 },
      ],
    },
    {
      id: 4,
      question: '친구가 "너 요즘 왜 이렇게 이성 얘기 많이 해?"라고 한다.',
      answers: [
        { id: 'a', text: '내가? 전혀 아닌데', score: 1 },
        { id: 'b', text: '그냥 얘기하다 보니까', score: 2 },
        { id: 'c', text: '요즘 좀 그런가?', score: 3 },
        { id: 'd', text: '이성 얘기를 안 하고 어떻게 사냐', score: 4 },
      ],
    },
    {
      id: 5,
      question: '회사/학교에 새로운 이성이 들어왔다.',
      answers: [
        { id: 'a', text: '새로운 사람이 왔구나', score: 1 },
        { id: 'b', text: '어떤 사람인지 궁금하다', score: 2 },
        { id: 'c', text: '은근히 정보를 알아본다', score: 3 },
        { id: 'd', text: '이름, 나이, 연애 여부까지 궁금하다', score: 4 },
      ],
    },
    {
      id: 6,
      question: '소개팅이 잘 안 됐는데 상대방 친구가 더 내 스타일이다.',
      answers: [
        { id: 'a', text: '친구까지 신경 쓰진 않는다', score: 1 },
        { id: 'b', text: '조금 아쉽다', score: 2 },
        { id: 'c', text: '친구가 어떤 사람인지 궁금하다', score: 3 },
        { id: 'd', text: '친구 소개 가능하냐고 물어본다', score: 4 },
      ],
    },
    {
      id: 7,
      question: '이성에게 칭찬을 들었다.',
      answers: [
        { id: 'a', text: '감사합니다 하고 끝', score: 1 },
        { id: 'b', text: '기분은 좋다', score: 2 },
        { id: 'c', text: '하루 종일 은근히 생각난다', score: 3 },
        { id: 'd', text: '혹시 나한테 관심 있나 생각한다', score: 4 },
      ],
    },
    {
      id: 8,
      question: '친구들과 술을 마시다가 이성이 합석했다.',
      answers: [
        { id: 'a', text: '원래 하던 얘기를 계속한다', score: 1 },
        { id: 'b', text: '조금 신경 쓰인다', score: 2 },
        { id: 'c', text: '자연스럽게 옆자리에 앉는다', score: 3 },
        { id: 'd', text: '갑자기 말수가 많아진다', score: 4 },
      ],
    },
    {
      id: 9,
      question: 'SNS를 보다가 마음에 드는 이성을 발견했다.',
      answers: [
        { id: 'a', text: '그냥 지나간다', score: 1 },
        { id: 'b', text: '한 번 더 본다', score: 2 },
        { id: 'c', text: '프로필을 구경한다', score: 3 },
        { id: 'd', text: '팔로우 목록까지 정독한다', score: 4 },
      ],
    },
    {
      id: 10,
      question: '친구가 새로운 이성과 친해졌다고 한다.',
      answers: [
        { id: 'a', text: '오 잘됐네', score: 1 },
        { id: 'b', text: '어떤 사람인데?', score: 2 },
        { id: 'c', text: '사진 보여달라고 한다', score: 3 },
        { id: 'd', text: '나도 소개해달라고 한다', score: 4 },
      ],
    },
    {
      id: 11,
      question: '여행지에서 우연히 마음에 드는 이성을 만났다.',
      answers: [
        { id: 'a', text: '여행 중 있었던 일로 생각한다', score: 1 },
        { id: 'b', text: '조금 아쉽긴 하다', score: 2 },
        { id: 'c', text: 'SNS를 찾아볼까 고민한다', score: 3 },
        { id: 'd', text: '어떻게든 연락할 방법을 찾는다', score: 4 },
      ],
    },
    {
      id: 12,
      question: '내 이상형과 완전히 똑같은 사람이 나타났다.',
      answers: [
        { id: 'a', text: '그래도 사람은 사람이지', score: 1 },
        { id: 'b', text: '오... 신기하다', score: 2 },
        { id: 'c', text: '일단 친해지고 싶다', score: 3 },
        { id: 'd', text: '이건 운명 아닌가?', score: 4 },
      ],
    },
    {
      id: 13,
      question: '이성이 많은 모임과 친구들만 있는 모임 중 하나를 고른다면?',
      answers: [
        { id: 'a', text: '친구들만 있는 게 편하다', score: 1 },
        { id: 'b', text: '둘 다 상관없다', score: 2 },
        { id: 'c', text: '이성이 많은 쪽이 조금 더 좋다', score: 3 },
        { id: 'd', text: '이성이 많은 곳으로 간다', score: 4 },
      ],
    },
    {
      id: 14,
      question: '연애 중인데 이상형에 가까운 사람이 나타났다.',
      answers: [
        { id: 'a', text: '관심 없다', score: 1 },
        { id: 'b', text: '잠깐 눈길은 간다', score: 2 },
        { id: 'c', text: '솔직히 조금 흔들릴 것 같다', score: 3 },
        { id: 'd', text: '일단 친해져 본다', score: 4 },
      ],
    },
    {
      id: 15,
      question: '솔직히 이성에게 관심이 많은 편인가?',
      answers: [
        { id: 'a', text: '전혀 아니다', score: 1 },
        { id: 'b', text: '평범한 것 같다', score: 2 },
        { id: 'c', text: '조금 많은 것 같다', score: 3 },
        { id: 'd', text: '나 꽤 심한 것 같은데?', score: 4 },
      ],
    },
  ] as Question[],

  results: [
    {
      id: 'stone',
      min: 0,
      max: 10,
      emoji: '🗿',
      title: '이성에 관심 0인 사람',
      keyword: '이성보다 내 인생이 더 중요함',
      description:
        '이성에게 관심이 아예 없는 건 아니지만 삶의 우선순위에서 상당히 밀려 있습니다. 누가 옆에서 썸을 타든 연애를 하든 일단 내 할 일부터 하는 타입입니다.',
    },
    {
      id: 'normal',
      min: 11,
      max: 20,
      emoji: '🌱',
      title: '건전한 인간',
      keyword: '관심은 있지만 선을 지킴',
      description:
        '이성에게 관심은 있지만 인생의 중심까지 차지하진 않습니다. 마음에 드는 사람이 나타나면 관심을 가지지만 굳이 모든 상황을 연애와 연결하진 않는 편입니다.',
    },
    {
      id: 'interest',
      min: 21,
      max: 30,
      emoji: '🙂',
      title: '이성에 관심은 있음',
      keyword: '아직은 정상 범위',
      description:
        '이성에게 관심이 꽤 있는 편입니다. 하지만 아직은 정상적인 수준. 마음에 드는 사람이 나타나면 한 번쯤 더 쳐다보는 정도입니다.',
    },
    {
      id: 'subtle',
      min: 31,
      max: 40,
      emoji: '👀',
      title: '은근히 이성 밝힘',
      keyword: '티 안 내려고 하는데 다 보임',
      description:
        '본인은 평범하다고 생각할 수도 있지만 주변에서는 이미 눈치챘을 가능성이 있습니다. 마음에 드는 이성이 나타나면 행동과 말투가 미묘하게 달라지는 타입입니다.',
    },
    {
      id: 'opportunity',
      min: 41,
      max: 50,
      emoji: '😏',
      title: '기회만 보면 슬쩍',
      keyword: '기회가 오면 놓치지 않음',
      description:
        '이성이 있다고 무조건 달려드는 건 아니지만 기회가 생기면 꽤 적극적으로 움직입니다. "난 관심 없어"라고 말하면서 주변을 제일 열심히 보고 있을 가능성이 높습니다.',
    },
    {
      id: 'priority',
      min: 51,
      max: 60,
      emoji: '🧐',
      title: '이성 우선순위가 높은 편',
      keyword: '이성이 있으면 하루가 조금 더 즐거움',
      description:
        '이성이 없는 자리보다 이성이 있는 자리를 선호하는 편입니다. 새로운 사람을 만날 때도 은근히 이성 여부를 먼저 확인하고 있을 가능성이 있습니다.',
    },
    {
      id: 'warning',
      min: 61,
      max: 70,
      emoji: '🔥',
      title: '남미새/여미새 주의보',
      keyword: '이성 등장 = 집중력 상승',
      description:
        '축하합니다. 이제부터는 주변 사람들이 슬슬 눈치채기 시작합니다. 이성이 등장하면 평소보다 말도 많아지고 관심도 많아지는 타입입니다.',
    },
    {
      id: 'severe',
      min: 71,
      max: 85,
      emoji: '🚨',
      title: '중증 남미새/여미새',
      keyword: '이성이 곧 콘텐츠',
      description:
        '이성이 없는 자리에서는 평온하지만 이성이 등장하는 순간 레이더가 작동합니다. 새로운 모임에서도 누가 솔로인지, 누구와 친해질 수 있는지 은근히 파악하고 있을 가능성이 높습니다.',
    },
    {
      id: 'extreme',
      min: 86,
      max: 100,
      emoji: '💀',
      title: '이성 없이는 못 사는 사람',
      keyword: '인생의 기본 옵션이 이성',
      description:
        '이 정도면 남미새/여미새라는 말을 부정하기 어렵습니다. 이성이 등장하면 주변 상황보다 그 사람에게 관심이 집중될 가능성이 매우 높습니다. 친구들이 이미 알고 있을 수도 있습니다.',
    },
  ] as TestResult[],
} as const
