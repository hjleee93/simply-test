import type { Question, TestResult } from '../types/test'

// 영역별 문항 수 (1차): work 3 · money 4 · people 4 · growth 4 · workLifeBalance 4
export const retirementTest = {
  id: 'retirement-threshold',
  title: '나의 퇴사 임계점은 몇 %?',
  description: '나는 회사에서 어디까지 참을 수 있을까?',
  questions: [
    {
      id: 1,
      question: '월요일 아침 눈을 떴을 때 가장 먼저 드는 생각은?',
      answers: [
        {
          id: 'a',
          text: '그래도 출근해야지',
          scores: { work: 1 },
        },
        {
          id: 'b',
          text: '오늘도 바쁘겠네',
          scores: { work: 2 },
        },
        {
          id: 'c',
          text: '회사 가기 싫다...',
          scores: { work: 3 },
        },
        {
          id: 'd',
          text: '이렇게까지 하면서 회사를 다녀야 하나?',
          scores: { work: 4 },
        },
      ],
    },

    {
      id: 2,
      question: '갑자기 야근을 하라는 이야기를 들었다.',
      answers: [
        {
          id: 'a',
          text: '업무상 필요하면 할 수 있지',
          scores: { workLifeBalance: 1 },
        },
        {
          id: 'b',
          text: '조금 아쉽지만 한다',
          scores: { workLifeBalance: 2 },
        },
        {
          id: 'c',
          text: '또 야근이야? 싶다',
          scores: { workLifeBalance: 3 },
        },
        {
          id: 'd',
          text: '이 회사는 답이 없다고 생각한다',
          scores: { workLifeBalance: 4 },
        },
      ],
    },

    {
      id: 3,
      question: '내가 열심히 한 프로젝트가 좋은 성과를 냈다. 그런데...',
      answers: [
        {
          id: 'a',
          text: '성과가 난 것만으로 만족한다',
          scores: { money: 1 },
        },
        {
          id: 'b',
          text: '다음에는 더 좋은 결과를 내고 싶다',
          scores: { money: 2 },
        },
        {
          id: 'c',
          text: '그래도 보상은 있어야 하지 않나?',
          scores: { money: 3 },
        },
        {
          id: 'd',
          text: '보상도 없는데 내가 왜 이렇게 열심히 했지?',
          scores: { money: 4 },
        },
      ],
    },

    {
      id: 4,
      question: '상사가 내 의견을 계속 무시한다.',
      answers: [
        {
          id: 'a',
          text: '그럴 수도 있다고 생각한다',
          scores: { people: 1 },
        },
        {
          id: 'b',
          text: '조금 불편하지만 일단 맞춘다',
          scores: { people: 2 },
        },
        {
          id: 'c',
          text: '이 회사에서는 내 의견이 중요하지 않은 것 같다',
          scores: { people: 3 },
        },
        {
          id: 'd',
          text: '이런 상사 밑에서는 오래 못 다닌다',
          scores: { people: 4 },
        },
      ],
    },

    {
      id: 5,
      question: '3년째 비슷한 업무만 하고 있다.',
      answers: [
        {
          id: 'a',
          text: '익숙한 업무가 편하다',
          scores: { growth: 1 },
        },
        {
          id: 'b',
          text: '조금 지루하긴 하다',
          scores: { growth: 2 },
        },
        {
          id: 'c',
          text: '내가 여기서 성장하고 있는지 모르겠다',
          scores: { growth: 3 },
        },
        {
          id: 'd',
          text: '이러다 내 커리어가 망할 것 같다',
          scores: { growth: 4 },
        },
      ],
    },

    {
      id: 6,
      question: '친한 동료가 갑자기 퇴사한다고 한다.',
      answers: [
        {
          id: 'a',
          text: '아쉽지만 잘 됐다고 생각한다',
          scores: { people: 1 },
        },
        {
          id: 'b',
          text: '어디로 가는지 궁금하다',
          scores: { people: 2 },
        },
        {
          id: 'c',
          text: '나도 같이 갈 수 있나 생각한다',
          scores: { people: 3 },
        },
        {
          id: 'd',
          text: '나도 당장 이직 사이트를 켠다',
          scores: { people: 4 },
        },
      ],
    },

    {
      id: 7,
      question: '연봉 협상을 했는데 기대했던 만큼 오르지 않았다.',
      answers: [
        {
          id: 'a',
          text: '회사 사정이 있겠지',
          scores: { money: 1 },
        },
        {
          id: 'b',
          text: '조금 아쉽지만 받아들인다',
          scores: { money: 2 },
        },
        {
          id: 'c',
          text: '다른 회사 연봉을 찾아본다',
          scores: { money: 3 },
        },
        {
          id: 'd',
          text: '이직해야겠다는 생각이 확 든다',
          scores: { money: 4 },
        },
      ],
    },

    {
      id: 8,
      question: '퇴근 후에도 회사 연락이 계속 온다.',
      answers: [
        {
          id: 'a',
          text: '급한 일이면 확인한다',
          scores: { workLifeBalance: 1 },
        },
        {
          id: 'b',
          text: '가끔이면 괜찮다',
          scores: { workLifeBalance: 2 },
        },
        {
          id: 'c',
          text: '퇴근했으면 연락하지 않았으면 좋겠다',
          scores: { workLifeBalance: 3 },
        },
        {
          id: 'd',
          text: '퇴근 후에도 일해야 한다면 다닐 이유가 없다',
          scores: { workLifeBalance: 4 },
        },
      ],
    },

    {
      id: 9,
      question: '회사에서 새로운 기술이나 업무를 배울 기회가 거의 없다.',
      answers: [
        {
          id: 'a',
          text: '필요하면 개인적으로 배우면 된다',
          scores: { growth: 1 },
        },
        {
          id: 'b',
          text: '조금 아쉽지만 괜찮다',
          scores: { growth: 2 },
        },
        {
          id: 'c',
          text: '커리어에 도움이 안 될 것 같다',
          scores: { growth: 3 },
        },
        {
          id: 'd',
          text: '이 회사에 더 있을 이유가 없다고 느낀다',
          scores: { growth: 4 },
        },
      ],
    },

    {
      id: 10,
      question: '회사에서 가장 참기 힘든 상황은?',
      answers: [
        {
          id: 'a',
          text: '업무가 조금 많은 것',
          scores: { workLifeBalance: 1 },
        },
        {
          id: 'b',
          text: '갑작스러운 일정 변경',
          scores: { work: 2 },
        },
        {
          id: 'c',
          text: '무능한 상사와 일하는 것',
          scores: { people: 3 },
        },
        {
          id: 'd',
          text: '배울 것도 없이 똑같은 일만 반복하는 것',
          scores: { growth: 4 },
        },
      ],
    },

    {
      id: 11,
      question: '친구가 "요즘 회사 어때?"라고 물어본다면?',
      answers: [
        {
          id: 'a',
          text: '그냥 다닐 만해',
          scores: { people: 1 },
        },
        {
          id: 'b',
          text: '뭐... 먹고살려면 다녀야지',
          scores: { people: 2 },
        },
        {
          id: 'c',
          text: '요즘 좀 고민이 많아',
          scores: { people: 3 },
        },
        {
          id: 'd',
          text: '나 진짜 이직할까?',
          scores: { people: 4 },
        },
      ],
    },

    {
      id: 12,
      question: '회사에서 갑자기 복지가 줄어든다는 공지가 나왔다.',
      answers: [
        {
          id: 'a',
          text: '그럴 수도 있지',
          scores: { money: 1 },
        },
        {
          id: 'b',
          text: '아쉽지만 어쩔 수 없다',
          scores: { money: 2 },
        },
        {
          id: 'c',
          text: '회사가 점점 별로가 되는 것 같다',
          scores: { money: 3 },
        },
        {
          id: 'd',
          text: '이직할 이유가 하나 더 생겼다',
          scores: { money: 4 },
        },
      ],
    },

    {
      id: 13,
      question: '내가 휴가를 쓰려고 하는데 팀 분위기가 눈치 보인다.',
      answers: [
        {
          id: 'a',
          text: '내 휴가인데 뭐 어때',
          scores: { workLifeBalance: 1 },
        },
        {
          id: 'b',
          text: '그래도 조금 눈치 보인다',
          scores: { workLifeBalance: 2 },
        },
        {
          id: 'c',
          text: '이런 분위기가 너무 싫다',
          scores: { workLifeBalance: 3 },
        },
        {
          id: 'd',
          text: '휴가도 자유롭게 못 쓰는 회사는 오래 다니기 싫다',
          scores: { workLifeBalance: 4 },
        },
      ],
    },

    {
      id: 14,
      question: '다른 회사에서 지금보다 좋은 조건으로 이직 제안이 왔다.',
      answers: [
        {
          id: 'a',
          text: '현재 회사가 더 좋다면 안 간다',
          scores: { money: 1 },
        },
        {
          id: 'b',
          text: '일단 고민해본다',
          scores: { money: 2 },
        },
        {
          id: 'c',
          text: '상당히 진지하게 생각한다',
          scores: { money: 3 },
        },
        {
          id: 'd',
          text: '조건만 괜찮으면 바로 간다',
          scores: { money: 4 },
        },
      ],
    },

    {
      id: 15,
      question: '만약 지금 당장 6개월치 생활비가 통장에 있다면?',
      answers: [
        {
          id: 'a',
          text: '그래도 계속 다닌다',
          scores: { growth: 1 },
        },
        {
          id: 'b',
          text: '조금 쉬면서 생각해본다',
          scores: { growth: 2 },
        },
        {
          id: 'c',
          text: '이직 준비를 시작한다',
          scores: { growth: 3 },
        },
        {
          id: 'd',
          text: '일단 사표부터 낸다',
          scores: { growth: 4 },
        },
      ],
    },
  ] as Question[],

  results: [
    {
      id: 'steel',
      min: 0,
      max: 10,
      emoji: '🪨',
      title: '강철 멘탈 직장인',
      keyword: '회사가 힘든 게 아니라, 그냥 회사라는 시스템에 적응한 것일 수도.',
      description:
        '월요일 아침에도 크게 흔들리지 않고, 야근·연락·눈치 같은 것도 "원래 그런 거지" 하고 넘기는 타입이에요. 멘탈이 강한 게 아니라, 불편함에 너무 익숙해진 걸 수도 있습니다.',
    },
    {
      id: 'adapted',
      min: 11,
      max: 20,
      emoji: '🌳',
      title: '회사 적응 완료형',
      keyword: '불만은 있는데, 그 불만을 말할 타이밍을 아직 못 잡은 상태.',
      description:
        '속으로는 "이게 맞나?" 싶지만 밖으로는 "그럭저럭 다녀요"가 먼저 나옵니다. 퇴사까지는 아니지만, 회사에 대한 기대치는 이미 많이 낮아진 편이에요.',
    },
    {
      id: 'realistic',
      min: 21,
      max: 30,
      emoji: '🙂',
      title: '현실 타협형',
      keyword: '월급이 들어오는 한, 회사도 나를 참아주는 셈 치는 중.',
      description:
        '회사가 최고는 아니라는 걸 알면서도 통장 잔고가 현실을 설득해 줍니다. 이직은 생각하지만, 지금 당장 움직일 만큼의 결심은 아직 없는 전형적인 버티기 단계예요.',
    },
    {
      id: 'tired',
      min: 31,
      max: 40,
      emoji: '😐',
      title: '슬슬 지치는형',
      keyword: '큰 사건 하나 없어도, 작은 불만이 매일 한 방씩 때립니다.',
      description:
        '예전엔 참을 만했는데 요즘은 같은 일도 더 빡세게 느껴집니다. 아직 사표까지는 아니지만, 퇴근길에 이직 사이트를 "우연히" 여는 빈도가 늘고 있을 수 있어요.',
    },
    {
      id: 'conditional',
      min: 41,
      max: 50,
      emoji: '⚖️',
      title: '조건부 퇴사형',
      keyword: '지금 회사는 싫은데, 다음 회사가 더 싫을까 봐 멈춰 있는 중.',
      description:
        '연봉, 상사, 업무, 복지 중 하나만 확실히 좋아지면 바로 움직일 준비가 된 타입입니다. 퇴사를 망설이는 이유는 애정이 아니라, 다음 선택이 더 무서워서일 가능성이 큽니다.',
    },
    {
      id: 'exploring',
      min: 51,
      max: 60,
      emoji: '🧐',
      title: '이직 탐색형',
      keyword: '채용공고는 저장만 해두고, 아직 지원은 안 하는 단계.',
      description:
        '아직 이 회사에 완전히 끊긴 건 아니지만, 다른 선택지를 슬쩍 비교하기 시작했습니다. 동료가 퇴사하면 축하보다 먼저 "어디야?"가 궁금해지는 편이에요.',
    },
    {
      id: 'considering',
      min: 61,
      max: 70,
      emoji: '🔥',
      title: '퇴사 고민형',
      keyword: '회사에 대한 미련보다, 남아 있어야 할 이유가 더 빨리 사라지는 중.',
      description:
        '이제 퇴사는 "할까 말까"가 아니라 "언제 할까"에 가깝습니다. 결정적인 한 방—연봉 거절, 야근 폭탄, 상사 한마디—이면 바로 실행 모드로 넘어갈 수 있어요.',
    },
    {
      id: 'countdown',
      min: 71,
      max: 85,
      emoji: '🚨',
      title: '퇴사 카운트다운형',
      keyword: '사표는 아직 안 냈지만, 머릿속 퇴사일은 이미 여러 번 정해 봤음.',
      description:
        '회사 메신저 알림만 와도 짜증이 먼저 올라오고, 월요일 아침이 가장 긴 출근입니다. 남은 이유는 이직 준비가 덜 됐거나, 다음 회사가 아직 안 정해졌기 때문일 수 있어요.',
    },
    {
      id: 'already-left',
      min: 86,
      max: 100,
      emoji: '🏃',
      title: '마음은 이미 퇴사함',
      keyword: '출근하는 건 의지고, 퇴사는 이미 마음속에서 끝난 상태.',
      description:
        '회의실에 앉아 있어도 머리는 이미 다른 곳에 있습니다. 지금 버티는 이유는 용기가 없어서가 아니라, 통장이 아직 말을 안 해줘서일 수도 있어요. 조금만 더 채워지면 진짜로 갑니다.',
    },
  ] as TestResult[],
} as const