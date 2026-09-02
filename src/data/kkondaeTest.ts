import type { Question, TestResult } from '../types/test'
import og from '../lib/og.json' with { type: 'json' }

const meta = og.tests.find((test) => test.id === 'kkondae-test')!
const KKONDAE_CHAR = '/characters/pixel/kkondae'

export const kkondaeTest = {
  id: meta.id,
  title: meta.title,
  description: meta.description,
  scoringMode: 'simple' as const,
  resultTemplate: 'kkondae' as const,
  minScorePerAnswer: 0,
  thumbnailCharacter: 'kkondae/main',
  resultLabel: '꼰대력',

  questions: [
    {
      id: 1,
      question: '신입사원이 퇴근 시간에 칼같이 퇴근한다.',
      answers: [
        { id: 'a', text: '자기 일이 끝났으면 당연히 퇴근해야지', score: 0 },
        { id: 'b', text: '조금 신경 쓰이지만 뭐 그럴 수 있지', score: 1 },
        { id: 'c', text: '중요한 날에는 조금 남아주는 게 좋지 않을까?', score: 2 },
        { id: 'd', text: '팀 분위기도 있는데 너무 칼퇴하는 건 좀 그렇다', score: 3 },
        { id: 'e', text: '신입이면 어느 정도 눈치껏 남아 있어야 한다', score: 4 },
      ],
    },
    {
      id: 2,
      question: '후배가 "이건 왜 해야 하는 건가요?"라고 물었다.',
      answers: [
        { id: 'a', text: '좋은 질문이다. 이유를 설명해준다', score: 0 },
        { id: 'b', text: '내가 아는 범위에서 설명해준다', score: 1 },
        { id: 'c', text: '일단 해보고 나중에 물어봐도 될 것 같다', score: 2 },
        { id: 'd', text: '시키는 일에 이유부터 묻는 건 좀...', score: 3 },
        { id: 'e', text: '회사에서는 원래 시키면 그냥 하는 거다', score: 4 },
      ],
    },
    {
      id: 3,
      question: '후배가 회식에 참석하지 않겠다고 한다.',
      answers: [
        { id: 'a', text: '개인 일정이 있으면 안 올 수도 있지', score: 0 },
        { id: 'b', text: '아쉽지만 이해한다', score: 1 },
        { id: 'c', text: '한 번쯤은 참석해주면 좋겠다고 생각한다', score: 2 },
        { id: 'd', text: '팀원인데 회식 정도는 참석해야 하지 않나?', score: 3 },
        { id: 'e', text: '회식도 업무의 일부라고 생각한다', score: 4 },
      ],
    },
    {
      id: 4,
      question: '후배가 나보다 어린데 나에게 업무 방식을 지적했다.',
      answers: [
        { id: 'a', text: '맞는 말이면 받아들인다', score: 0 },
        { id: 'b', text: '기분은 조금 이상하지만 들어본다', score: 1 },
        { id: 'c', text: '경험도 중요하니까 내가 판단한다', score: 2 },
        { id: 'd', text: '나보다 어린 사람이 나를 가르치려 드는 건 별로다', score: 3 },
        { id: 'e', text: '연차와 경험을 먼저 존중해야 한다고 생각한다', score: 4 },
      ],
    },
    {
      id: 5,
      question: '상사가 "요즘 애들은 책임감이 부족해"라고 말했다.',
      answers: [
        { id: 'a', text: '세대 전체를 묶어서 말하는 건 별로라고 생각한다', score: 0 },
        { id: 'b', text: '사람마다 다른 거지', score: 1 },
        { id: 'c', text: '어느 정도 그런 면도 있는 것 같다', score: 2 },
        { id: 'd', text: '나도 요즘 후배들을 보면 비슷하게 느낀다', score: 3 },
        { id: 'e', text: '예전보다 확실히 책임감이 부족한 것 같다', score: 4 },
      ],
    },
    {
      id: 6,
      question: '후배가 메신저 답장을 한참 뒤에 했다.',
      answers: [
        { id: 'a', text: '바빴겠지', score: 0 },
        { id: 'b', text: '조금 늦었네 정도로 생각한다', score: 1 },
        { id: 'c', text: '업무 메신저면 조금 빨리 보는 게 좋다고 생각한다', score: 2 },
        { id: 'd', text: '업무 연락인데 답장이 너무 늦는 건 예의가 아니다', score: 3 },
        { id: 'e', text: '내가 후배였으면 바로 답장했을 것 같다', score: 4 },
      ],
    },
    {
      id: 7,
      question: '후배가 연차를 월요일이나 금요일에 붙여서 쓴다.',
      answers: [
        { id: 'a', text: '연차는 본인이 쓰고 싶은 날 쓰는 거지', score: 0 },
        { id: 'b', text: '부럽다. 나도 그렇게 쓰고 싶다', score: 1 },
        { id: 'c', text: '업무에 문제만 없으면 괜찮다', score: 2 },
        { id: 'd', text: '팀 상황을 고려해서 쓰는 게 좋지 않을까?', score: 3 },
        { id: 'e', text: '그렇게 연차를 몰아서 쓰는 건 별로라고 생각한다', score: 4 },
      ],
    },
    {
      id: 8,
      question: "후배가 '저는 워라밸이 중요해서 야근은 안 합니다'라고 말했다.",
      answers: [
        { id: 'a', text: '건강한 생각이라고 본다', score: 0 },
        { id: 'b', text: '업무에 지장이 없다면 괜찮다', score: 1 },
        { id: 'c', text: '중요한 시기에는 조금 유연할 필요도 있다고 생각한다', score: 2 },
        { id: 'd', text: '회사 생활하면서 워라밸만 따지기는 어렵다', score: 3 },
        { id: 'e', text: '신입이면 일단 열심히 하는 게 먼저라고 생각한다', score: 4 },
      ],
    },
    {
      id: 9,
      question: '후배가 회의에서 상사의 의견에 공개적으로 반대했다.',
      answers: [
        { id: 'a', text: '근거가 있다면 당연히 말할 수 있다', score: 0 },
        { id: 'b', text: '말투와 방식만 괜찮다면 문제없다', score: 1 },
        { id: 'c', text: '상황을 봐가면서 말하는 게 좋다고 생각한다', score: 2 },
        { id: 'd', text: '상사 앞에서는 어느 정도 예의를 지켜야 한다', score: 3 },
        { id: 'e', text: '회사에서 상사 의견에 공개적으로 반대하는 건 좋지 않다', score: 4 },
      ],
    },
    {
      id: 10,
      question: '후배가 나에게 인사를 하지 않고 지나갔다.',
      answers: [
        { id: 'a', text: '못 봤겠지', score: 0 },
        { id: 'b', text: '조금 아쉽지만 넘어간다', score: 1 },
        { id: 'c', text: '다음부터는 인사해주면 좋겠다고 생각한다', score: 2 },
        { id: 'd', text: '직장생활의 기본인데 왜 안 하지 싶다', score: 3 },
        { id: 'e', text: '나를 무시하는 건가 싶다', score: 4 },
      ],
    },
    {
      id: 11,
      question: '후배가 "그건 제 업무가 아닌 것 같은데요"라고 말했다.',
      answers: [
        { id: 'a', text: '정말 업무가 아니라면 당연히 말할 수 있다', score: 0 },
        { id: 'b', text: '왜 그렇게 생각하는지 물어본다', score: 1 },
        { id: 'c', text: '팀에서는 어느 정도 서로 도와야 한다고 생각한다', score: 2 },
        { id: 'd', text: '사회생활에서는 자기 일만 딱 하는 게 어렵다', score: 3 },
        { id: 'e', text: '회사에서는 시키는 일도 할 줄 알아야 한다', score: 4 },
      ],
    },
    {
      id: 12,
      question: "후배가 나에게 '저 먼저 퇴근하겠습니다!'라고 말했다.",
      answers: [
        { id: 'a', text: '네! 조심히 들어가세요', score: 0 },
        { id: 'b', text: '벌써 가네 싶지만 웃으며 보내준다', score: 1 },
        { id: 'c', text: '오늘 업무는 다 끝났나 확인한다', score: 2 },
        { id: 'd', text: '요즘은 정말 칼퇴가 자연스럽구나 싶다', score: 3 },
        { id: 'e', text: '"벌써 가?"라는 말이 목구멍까지 올라온다', score: 4 },
      ],
    },
    {
      id: 13,
      question: '후배가 회사에서 개인적인 공부를 하고 있다.',
      answers: [
        { id: 'a', text: '자기계발하는 거 멋있다고 생각한다', score: 0 },
        { id: 'b', text: '업무에 지장 없으면 괜찮다', score: 1 },
        { id: 'c', text: '근무 시간에는 업무가 우선이라고 생각한다', score: 2 },
        { id: 'd', text: '회사에서 개인 공부하는 건 좀 아닌 것 같다', score: 3 },
        { id: 'e', text: '월급 받으면서 자기 공부하는 건 이해하기 어렵다', score: 4 },
      ],
    },
    {
      id: 14,
      question:
        '내가 후배였을 때는 힘들게 일했는데, 요즘 후배들은 편하게 일하는 것 같다.',
      answers: [
        { id: 'a', text: '환경이 좋아진 건 좋은 일이라고 생각한다', score: 0 },
        { id: 'b', text: '나 때와는 많이 달라졌구나 싶다', score: 1 },
        { id: 'c', text: '그래도 어느 정도 힘든 경험은 필요하다고 생각한다', score: 2 },
        { id: 'd', text: '우리 때보다 너무 편해진 것 같다', score: 3 },
        { id: 'e', text: '나도 그렇게 했는데 왜 요즘은 안 하는지 모르겠다', score: 4 },
      ],
    },
    {
      id: 15,
      question: '회사에서 가장 중요하다고 생각하는 것은?',
      answers: [
        { id: 'a', text: '성과와 개인의 성장', score: 0 },
        { id: 'b', text: '성과와 워라밸의 균형', score: 1 },
        { id: 'c', text: '팀워크와 책임감', score: 2 },
        { id: 'd', text: '조직에 대한 책임과 충성도', score: 3 },
        { id: 'e', text: '회사를 위해 어느 정도 희생할 줄 아는 자세', score: 4 },
      ],
    },
  ] as Question[],

  results: [
    {
      id: 'pure',
      min: 0,
      max: 10,
      emoji: '🪽',
      title: '무균 꼰대',
      keyword: '꼰대력 상위 0~5%',
      description:
        '축하합니다. 당신에게서는 꼰대균이 거의 검출되지 않았습니다.\n\n후배가 칼퇴해도 박수를 쳐주고, 상사가 틀렸다고 생각하면 조용히 의견도 낼 수 있는 타입입니다. 혹시 회사에서 너무 정상적으로 살고 있는 건 아닌지 의심스럽습니다.',
      characterImage: `${KKONDAE_CHAR}/pure.png`,
    },
    {
      id: 'fresh',
      min: 11,
      max: 22,
      emoji: '🌱',
      title: '꼰대 새싹',
      keyword: '꼰대력 상위 10%',
      description:
        '아직은 깨끗합니다. 다만 회사 생활이 길어지면 싹이 틀 수도 있습니다.\n\n현재는 후배들의 행동을 대부분 이해해주는 편입니다. 하지만 "나 때는 말이야"라는 말이 가끔 머릿속에 떠오르기 시작했다면 조심하세요.',
      characterImage: `${KKONDAE_CHAR}/fresh.png`,
    },
    {
      id: 'normal',
      min: 23,
      max: 33,
      emoji: '🙂',
      title: '정상 직장인',
      keyword: '꼰대력 상위 20%',
      description:
        '꼰대와 MZ 사이에서 적당히 균형을 잡고 있습니다.\n\n원칙을 중요하게 생각하지만 무조건 옛날 방식을 고집하지는 않습니다. 다만 가끔 후배의 행동을 보고 속으로 "저게 맞나?"라고 생각할 수 있습니다.',
      characterImage: `${KKONDAE_CHAR}/normal.png`,
    },
    {
      id: 'subtle',
      min: 34,
      max: 45,
      emoji: '👀',
      title: '은근한 꼰대',
      keyword: '꼰대력 상위 35%',
      description:
        '본인은 꼰대가 아니라고 생각하지만 주변에서는 살짝 다르게 볼 수도 있습니다.\n\n후배가 칼퇴하면 신경 쓰이고, 답장이 늦으면 살짝 짜증나지만 대놓고 뭐라고 하지는 않는 타입입니다. 아직 돌아올 수 있습니다.',
      characterImage: `${KKONDAE_CHAR}/subtle.png`,
    },
    {
      id: 'potential',
      min: 46,
      max: 57,
      emoji: '🧐',
      title: '잠재적 꼰대',
      keyword: '꼰대력 상위 50%',
      description:
        '꼰대의 가능성이 보이기 시작했습니다.\n\n회사에서 지켜야 할 기본적인 예의와 책임감을 중요하게 생각하는 편입니다. 문제는 그 "기본"의 기준이 남들보다 조금 높을 수 있다는 것.',
      characterImage: `${KKONDAE_CHAR}/potential.png`,
    },
    {
      id: 'rising',
      min: 58,
      max: 68,
      emoji: '👴',
      title: '꼰대력 상승 중',
      keyword: '꼰대력 상위 65%',
      description:
        '당신의 꼰대력이 슬슬 상승하고 있습니다.\n\n후배의 칼퇴, 늦은 답장, 회식 불참 같은 행동이 조금씩 거슬리기 시작합니다. 아직 "라떼는 말이야"를 입 밖으로 꺼내지만 않는다면 괜찮습니다.',
      characterImage: `${KKONDAE_CHAR}/rising.png`,
    },
    {
      id: 'official',
      min: 69,
      max: 80,
      emoji: '📢',
      title: '회사 공식 꼰대',
      keyword: '꼰대력 상위 80%',
      description:
        '축하합니다. 회사에서 꼰대 포지션을 획득했습니다.\n\n후배의 행동을 보며 "요즘 애들은..."이라는 말이 자연스럽게 떠오릅니다. 회식, 인사, 야근, 책임감에 대한 확고한 기준이 있습니다.',
      characterImage: `${KKONDAE_CHAR}/official.png`,
    },
    {
      id: 'severe',
      min: 81,
      max: 92,
      emoji: '💀',
      title: '중증 꼰대',
      keyword: '꼰대력 상위 95%',
      description:
        '당신의 꼰대력은 이제 숨길 수 있는 수준을 넘어섰습니다.\n\n후배가 퇴근하면 "벌써 가?"가 자동으로 나오고, 회식에 빠지면 "팀워크"를 이야기합니다. 본인은 경험에서 나온 조언이라고 생각하지만 후배 입장에서는 잔소리일 가능성이 있습니다.',
      characterImage: `${KKONDAE_CHAR}/severe.png`,
    },
    {
      id: 'legend',
      min: 93,
      max: 100,
      emoji: '👑',
      title: '전설의 꼰대',
      keyword: '꼰대력 상위 99%',
      description:
        '전설이 되셨습니다. 당신은 꼰대의 경지에 도달했습니다.\n\n후배가 칼퇴하면 "벌써 가?", 연차를 쓰면 "요즘은 참...", 의견을 내면 "내가 너만 할 때는..."이 자동으로 재생됩니다. 놀랍게도 이 모든 말에는 당신만의 확고한 철학이 있습니다.',
      characterImage: `${KKONDAE_CHAR}/legend.png`,
    },
  ] as TestResult[],
} as const
