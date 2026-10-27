import type { TestDefinition } from '../src/types/test'

const test: TestDefinition = {
  id: 'halloween-movie-villain-test',
  title: '내 안의 할로윈 영화 빌런 테스트',
  description: '오늘 밤 깨어날 영화 빌런 본성과 찰떡 코스튬을 찾아보세요.',
  category: 'self',
  scoringMode: 'pattern',
  resultTemplate: 'halloween',
  thumbnailCharacter: 'halloween-villain',
  resultLabel: '할로윈 영화 빌런',

  questions: [
    {
      id: 1,
      question: '할로윈 파티 초대장을 받았다. 내가 가장 먼저 하는 생각은?',
      answers: [
        {
          id: 'a',
          text: '이번 파티, 내가 제일 재밌게 뒤집어놔야지',
          patternScores: { joker: 2, harley: 1 },
        },
        {
          id: 'b',
          text: '뭘 입어야 사진에서 내가 제일 튈까?',
          patternScores: { cruella: 2, harley: 1 },
        },
        {
          id: 'c',
          text: '시간, 장소, 인원부터 확인한다',
          patternScores: { vader: 2, thanos: 1 },
        },
        {
          id: 'd',
          text: '누가 오는지 알아낸 뒤 살짝 판을 짠다',
          patternScores: { loki: 2, hannibal: 1 },
        },
      ],
    },
    {
      id: 2,
      question: '코스튬을 준비하는 나의 방식은?',
      answers: [
        {
          id: 'a',
          text: '완성도를 위해 체크리스트부터 만든다',
          patternScores: { thanos: 2, vader: 1 },
        },
        {
          id: 'b',
          text: '흔한 건 싫다. 디테일까지 직접 커스텀한다',
          patternScores: { cruella: 2, maleficent: 1 },
        },
        {
          id: 'c',
          text: '마음에 꽂히면 오늘 당장 풀세트로 산다',
          patternScores: { harley: 2, joker: 1 },
        },
        {
          id: 'd',
          text: '과하게 꾸미지 않아도 분위기로 압도한다',
          patternScores: { hannibal: 2, vader: 1 },
        },
      ],
    },
    {
      id: 3,
      question: '같이 가기로 한 친구가 당일에 갑자기 취소했다.',
      answers: [
        {
          id: 'a',
          text: '괜찮다고 하지만 이 일은 오래 기억한다',
          patternScores: { maleficent: 2, hannibal: 1 },
        },
        {
          id: 'b',
          text: '이유를 듣고 다음 계획을 빠르게 정리한다',
          patternScores: { vader: 2, thanos: 1 },
        },
        {
          id: 'c',
          text: '오히려 좋아. 혼자 가서 더 크게 논다',
          patternScores: { joker: 2, harley: 1 },
        },
        {
          id: 'd',
          text: '다른 친구에게 연락해 자연스럽게 빈자리를 채운다',
          patternScores: { loki: 2, cruella: 1 },
        },
      ],
    },
    {
      id: 4,
      question: '파티에서 처음 보는 사람이 은근히 시비를 건다면?',
      answers: [
        {
          id: 'a',
          text: '웃으면서 한마디로 상대를 조용하게 만든다',
          patternScores: { hannibal: 2, loki: 1 },
        },
        {
          id: 'b',
          text: '참지 않고 바로 더 세게 받아친다',
          patternScores: { harley: 2, joker: 1 },
        },
        {
          id: 'c',
          text: '감정 낭비 없이 단호하게 상황을 끝낸다',
          patternScores: { thanos: 2, vader: 1 },
        },
        {
          id: 'd',
          text: '건드린 대가는 나중에 우아하게 돌려준다',
          patternScores: { maleficent: 2, cruella: 1 },
        },
      ],
    },
    {
      id: 5,
      question: '공포 체험관에 들어간 순간, 내 모습은?',
      answers: [
        {
          id: 'a',
          text: '귀신보다 더 크게 웃으며 친구를 놀래킨다',
          patternScores: { joker: 2, harley: 1 },
        },
        {
          id: 'b',
          text: '표정 하나 안 바뀌고 맨 앞에서 걷는다',
          patternScores: { vader: 2, thanos: 1 },
        },
        {
          id: 'c',
          text: '비명을 지르면서도 끝까지 누구보다 즐긴다',
          patternScores: { harley: 2, joker: 1 },
        },
        {
          id: 'd',
          text: '놀라는 대신 연출과 사람들 반응을 관찰한다',
          patternScores: { hannibal: 2, loki: 1 },
        },
      ],
    },
    {
      id: 6,
      question: '단체 사진을 찍을 때 내가 차지하는 포지션은?',
      answers: [
        {
          id: 'a',
          text: '의상과 포즈를 완벽하게 잡고 정중앙에 선다',
          patternScores: { cruella: 2, harley: 1 },
        },
        {
          id: 'b',
          text: '남들 뒤에서 혼자 다른 포즈로 웃음을 챙긴다',
          patternScores: { loki: 2, joker: 1 },
        },
        {
          id: 'c',
          text: '가장 어두운 구석에서도 묘하게 시선을 끈다',
          patternScores: { maleficent: 2, hannibal: 1 },
        },
        {
          id: 'd',
          text: '우왕좌왕하는 사람들을 빠르게 배치한다',
          patternScores: { thanos: 2, vader: 1 },
        },
      ],
    },
    {
      id: 7,
      question: '친구가 엄청난 비밀을 털어놨다. 나는?',
      answers: [
        {
          id: 'a',
          text: '흥미진진하지만 입은 무겁다. 일단 즐긴다',
          patternScores: { joker: 2, harley: 1 },
        },
        {
          id: 'b',
          text: '비밀은 지키되 언젠가 유용할지도 모른다고 생각한다',
          patternScores: { loki: 2, hannibal: 1 },
        },
        {
          id: 'c',
          text: '표정 변화 없이 더 깊은 이야기를 끌어낸다',
          patternScores: { hannibal: 2, maleficent: 1 },
        },
        {
          id: 'd',
          text: '알겠다고 한 뒤 다시는 언급하지 않는다',
          patternScores: { vader: 2, thanos: 1 },
        },
      ],
    },
    {
      id: 8,
      question: '완벽하게 세운 파티 계획이 전부 꼬여버렸다.',
      answers: [
        {
          id: 'a',
          text: '필요 없는 건 버리고 목표만 달성한다',
          patternScores: { thanos: 2, vader: 1 },
        },
        {
          id: 'b',
          text: '계획이 망한 게 더 재밌다며 즉흥적으로 달린다',
          patternScores: { harley: 2, joker: 1 },
        },
        {
          id: 'c',
          text: '나를 방해한 원인을 정확히 기억해둔다',
          patternScores: { maleficent: 2, hannibal: 1 },
        },
        {
          id: 'd',
          text: '망한 티가 안 나도록 비주얼부터 살려낸다',
          patternScores: { cruella: 2, loki: 1 },
        },
      ],
    },
    {
      id: 9,
      question: '내가 가장 듣고 싶은 칭찬은?',
      answers: [
        {
          id: 'a',
          text: '오늘 여기서 네가 제일 멋있어',
          patternScores: { cruella: 2, harley: 1 },
        },
        {
          id: 'b',
          text: '네가 있으니까 다들 정신을 차리네',
          patternScores: { vader: 2, thanos: 1 },
        },
        {
          id: 'c',
          text: '도대체 어디까지가 네 계획이야?',
          patternScores: { loki: 2, joker: 1 },
        },
        {
          id: 'd',
          text: '너는 말 안 해도 사람을 긴장시켜',
          patternScores: { hannibal: 2, maleficent: 1 },
        },
      ],
    },
    {
      id: 10,
      question: '친구들이 메뉴 하나를 못 정하고 계속 고민한다.',
      answers: [
        {
          id: 'a',
          text: '가장 합리적인 선택지를 정해서 통보한다',
          patternScores: { thanos: 2, vader: 1 },
        },
        {
          id: 'b',
          text: '엉뚱한 메뉴를 던져서 판을 더 혼란스럽게 만든다',
          patternScores: { joker: 2, loki: 1 },
        },
        {
          id: 'c',
          text: '끌리는 곳을 골라 친구들을 데리고 출발한다',
          patternScores: { harley: 2, cruella: 1 },
        },
        {
          id: 'd',
          text: '조용히 기다리다 마지막에 내 선택을 관철한다',
          patternScores: { maleficent: 2, hannibal: 1 },
        },
      ],
    },
    {
      id: 11,
      question: '파티가 끝난 뒤 집에 돌아가는 길, 나는?',
      answers: [
        {
          id: 'a',
          text: '오늘 만난 사람들의 말과 행동을 복기한다',
          patternScores: { hannibal: 2, maleficent: 1 },
        },
        {
          id: 'b',
          text: '베스트 사진을 골라 바로 업로드한다',
          patternScores: { cruella: 2, harley: 1 },
        },
        {
          id: 'c',
          text: '정리할 것만 정리하고 미련 없이 쉰다',
          patternScores: { vader: 2, thanos: 1 },
        },
        {
          id: 'd',
          text: '단톡방에 의미심장한 한마디를 남긴다',
          patternScores: { loki: 2, joker: 1 },
        },
      ],
    },
    {
      id: 12,
      question: '영화 속 빌런이 된다면 가장 해보고 싶은 것은?',
      answers: [
        {
          id: 'a',
          text: '도시 전체를 내 무대로 만들어버리기',
          patternScores: { joker: 2, loki: 1 },
        },
        {
          id: 'b',
          text: '좋아하는 사람과 세상 끝까지 폭주하기',
          patternScores: { harley: 2, joker: 1 },
        },
        {
          id: 'c',
          text: '아무도 못 풀던 문제를 내 방식으로 끝내기',
          patternScores: { thanos: 2, vader: 1 },
        },
        {
          id: 'd',
          text: '나를 무시한 모두가 후회하게 만들기',
          patternScores: { maleficent: 2, cruella: 1 },
        },
      ],
    },
  ],

  results: [
    {
      id: 'joker',
      min: 0,
      max: 0,
      title: '웃는 얼굴의 혼돈, 조커',
      emoji: '🃏',
      keyword: '추천 코스튬 · 네온 광대',
      description:
        '당신은 예상 가능한 분위기를 견디지 못하는 혼돈의 엔터테이너입니다. 모두가 정해진 순서대로 움직일 때 엉뚱한 한마디로 판을 뒤집고, 어색한 순간조차 웃음거리로 바꿉니다. 관심을 받기 위해서라기보다 재미없는 세상을 참을 수 없어서 움직이는 편입니다.',
      strengths: [
        '어색한 분위기를 순식간에 뒤집는 센스',
        '위기에서도 겁먹지 않는 대담함',
        '누구도 예상하지 못하는 발상',
      ],
      blindSpots: [
        '장난이 누군가에게는 선 넘는 행동이 될 수 있음',
        '진지해야 할 순간에도 분위기를 가볍게 만들 수 있음',
      ],
      situations: [
        '보라색이나 초록색 중 하나를 포인트 컬러로 선택',
        '살짝 번진 광대 메이크업과 과장된 미소',
        '정장을 반듯하게 입기보다 일부러 흐트러뜨리기',
      ],
      advice: '왜 이렇게 진지해? 오늘 밤만큼은 웃어.',
      shareText: '내 안의 할로윈 영화 빌런은 「조커」🃏 찰떡 코스튬은 네온 광대!',
      viralHint: '친구는 당신의 장난을 조커력 몇 퍼센트라고 생각할까요?',
    },
    {
      id: 'cruella',
      min: 0,
      max: 0,
      title: '패션이 곧 권력, 크루엘라',
      emoji: '🖤',
      keyword: '추천 코스튬 · 흑백 글램 디바',
      description:
        '당신에게 평범함은 가장 무서운 저주입니다. 어디에 있든 나만의 취향을 분명하게 보여주고, 중요한 순간에는 주인공 자리를 놓치지 않습니다. 남의 기준보다 내 미감과 확신을 믿으며, 제대로 마음먹은 날에는 등장만으로 분위기를 바꿉니다.',
      strengths: [
        '자신만의 취향을 끝까지 밀어붙이는 확신',
        '시선을 사로잡는 연출력과 표현력',
        '평범한 것도 특별하게 만드는 감각',
      ],
      blindSpots: [
        '완성도를 챙기다 주변 사람을 재촉할 수 있음',
        '비교 대상이 생기면 승부욕이 과열될 수 있음',
      ],
      situations: [
        '흑백으로 대비되는 헤어 또는 가발',
        '검정 의상에 강렬한 레드 포인트 추가',
        '퍼 소재 대신 깃털이나 튤로 과장된 실루엣 연출',
      ],
      advice: '남들은 코스튬을 입지만, 나는 코스튬을 지배해.',
      shareText: '내 안의 할로윈 영화 빌런은 「크루엘라」🖤 찰떡 코스튬은 흑백 글램 디바!',
      viralHint: '오늘 파티의 베스트 드레서는 이미 정해졌을지도 몰라요.',
    },
    {
      id: 'vader',
      min: 0,
      max: 0,
      title: '내가 곧 질서, 다스 베이더',
      emoji: '🌌',
      keyword: '추천 코스튬 · 다크 스페이스 로드',
      description:
        '당신은 떠들지 않아도 존재감이 느껴지는 카리스마형 빌런입니다. 우왕좌왕하는 상황을 답답해하고, 누군가는 결정을 내려야 한다면 자연스럽게 그 역할을 맡습니다. 감정 표현은 절제하지만 책임감이 강하고 자기 사람은 조용히 지키는 편입니다.',
      strengths: [
        '혼란스러운 상황을 정리하는 통솔력',
        '쉽게 흔들리지 않는 무게감',
        '말보다 행동으로 보여주는 책임감',
      ],
      blindSpots: [
        '설명이 짧아 명령처럼 들릴 수 있음',
        '약한 모습을 숨기느라 혼자 버틸 수 있음',
      ],
      situations: [
        '올블랙 의상에 긴 망토로 실루엣 강조',
        '기계적인 마스크나 실버 액세서리 추가',
        '말을 줄이고 천천히 등장하면 완성',
      ],
      advice: '설명은 필요 없다. 나를 따라와.',
      shareText: '내 안의 할로윈 영화 빌런은 「다스 베이더」🌌 찰떡 코스튬은 다크 스페이스 로드!',
      viralHint: '친구들 사이에서 은근히 대장 역할을 맡고 있지 않나요?',
    },
    {
      id: 'thanos',
      min: 0,
      max: 0,
      title: '신념 과몰입, 타노스',
      emoji: '💎',
      keyword: '추천 코스튬 · 코스믹 정복자',
      description:
        '당신은 목표가 생기면 감정보다 결과를 먼저 보는 신념형 빌런입니다. 복잡한 문제도 핵심만 남겨 정리하고, 모두가 망설일 때 결정을 내립니다. 스스로는 합리적이라고 생각하지만 너무 확신에 차 있을 때 주변 의견이 들리지 않을 수 있습니다.',
      strengths: [
        '목표를 끝까지 완수하는 추진력',
        '복잡한 문제에서 핵심을 찾는 판단력',
        '쉽게 타협하지 않는 강한 신념',
      ],
      blindSpots: [
        '효율을 중시하다 사람의 감정을 놓칠 수 있음',
        '내 답이 정답이라는 확신에 빠질 수 있음',
      ],
      situations: [
        '골드와 퍼플을 활용한 우주 갑옷 스타일',
        '큼직한 보석 반지나 장갑을 포인트로 사용',
        '사진에서는 손가락을 튕기기 직전의 포즈',
      ],
      advice: '완벽하게 균형 잡힌 밤이군.',
      shareText: '내 안의 할로윈 영화 빌런은 「타노스」💎 찰떡 코스튬은 코스믹 정복자!',
      viralHint: '친구들이 당신을 고집형으로 보는지 리더형으로 보는지 확인해보세요.',
    },
    {
      id: 'loki',
      min: 0,
      max: 0,
      title: '배신마저 매력적인, 로키',
      emoji: '🐍',
      keyword: '추천 코스튬 · 에메랄드 트릭스터',
      description:
        '당신은 힘으로 밀어붙이기보다 말과 센스로 판을 움직이는 책략가입니다. 상대가 원하는 것을 빠르게 파악하고, 불리한 상황도 재치 있게 빠져나갑니다. 진심과 장난의 경계가 묘해서 주변 사람들은 당신의 다음 행동을 늘 궁금해합니다.',
      strengths: [
        '상황과 사람을 빠르게 읽는 눈치',
        '불리한 순간도 기회로 바꾸는 임기응변',
        '미워하기 어려운 능청스러운 매력',
      ],
      blindSpots: [
        '장난이 반복되면 진심까지 의심받을 수 있음',
        '정면 승부보다 빠져나갈 방법부터 찾을 수 있음',
      ],
      situations: [
        '딥그린 의상에 골드 액세서리 조합',
        '뿔 형태의 헤드피스는 작고 세련되게 연출',
        '여유로운 미소와 의미심장한 눈빛 장착',
      ],
      advice: '내 계획이 궁금해? 그럼 이미 늦었어.',
      shareText: '내 안의 할로윈 영화 빌런은 「로키」🐍 찰떡 코스튬은 에메랄드 트릭스터!',
      viralHint: '당신에게 속아준 척하는 친구가 있을지도 몰라요.',
    },
    {
      id: 'maleficent',
      min: 0,
      max: 0,
      title: '상처를 잊지 않는, 말레피센트',
      emoji: '🪽',
      keyword: '추천 코스튬 · 다크 페어리 퀸',
      description:
        '당신은 차가워 보이지만 마음 깊은 곳에는 강한 애정과 자존심을 품은 빌런입니다. 아무에게나 마음을 열지 않지만 한번 내 사람으로 받아들이면 누구보다 든든하게 지킵니다. 받은 호의도 상처도 오래 기억하며, 무시당했을 때 가장 강력해집니다.',
      strengths: [
        '자기 사람을 끝까지 지키는 의리',
        '쉽게 휘둘리지 않는 높은 자존감',
        '조용히 시선을 끄는 신비로운 분위기',
      ],
      blindSpots: [
        '상처를 오래 품어 관계를 닫아버릴 수 있음',
        '괜찮지 않아도 괜찮은 척할 수 있음',
      ],
      situations: [
        '검은 드레스나 망토로 날카로운 실루엣 연출',
        '뿔 헤드피스와 보랏빛 또는 초록빛 메이크업',
        '화려한 장식보다 차가운 눈빛이 핵심',
      ],
      advice: '내 친절을 당연하게 생각하지 마.',
      shareText: '내 안의 할로윈 영화 빌런은 「말레피센트」🪽 찰떡 코스튬은 다크 페어리 퀸!',
      viralHint: '겉은 차가워도 내 사람에게만 따뜻한 친구를 소환해보세요.',
    },
    {
      id: 'harley',
      min: 0,
      max: 0,
      title: '사랑 앞에 급발진, 할리 퀸',
      emoji: '♦️',
      keyword: '추천 코스튬 · 펑크 서커스 퀸',
      description:
        '당신은 마음이 움직이면 계산보다 행동이 먼저 나가는 본능형 빌런입니다. 좋아하는 사람과 재미있는 일에는 아낌없이 에너지를 쏟고, 망설이는 시간에 일단 시작합니다. 감정의 진폭은 크지만 넘어져도 웃으며 다시 달리는 회복력이 있습니다.',
      strengths: [
        '주변까지 신나게 만드는 폭발적인 에너지',
        '좋아하는 것에 솔직하게 뛰어드는 용기',
        '실패도 에피소드로 만드는 회복력',
      ],
      blindSpots: [
        '순간의 감정으로 너무 빠르게 결정할 수 있음',
        '좋아하는 사람에게 내 기준을 잃을 수 있음',
      ],
      situations: [
        '레드와 블루 또는 레드와 블랙을 과감하게 믹스',
        '양 갈래 헤어와 번진 아이 메이크업',
        '장난감 망치 같은 코믹한 소품으로 마무리',
      ],
      advice: '망설일 시간에 더 재밌게 사고 치자!',
      shareText: '내 안의 할로윈 영화 빌런은 「할리 퀸」♦️ 찰떡 코스튬은 펑크 서커스 퀸!',
      viralHint: '급발진 메이트에게 이 결과를 공유해보세요.',
    },
    {
      id: 'hannibal',
      min: 0,
      max: 0,
      title: '우아한 압박, 한니발 렉터',
      emoji: '🍷',
      keyword: '추천 코스튬 · 클래식 고딕 젠틀맨',
      description:
        '당신은 목소리를 높이지 않고도 상대를 긴장시키는 관찰자형 빌런입니다. 말보다 표정과 행동을 읽고, 성급하게 속내를 보여주지 않습니다. 취향과 기준이 뚜렷하며 혼란스러운 자리에서도 끝까지 우아함을 유지하는 편입니다.',
      strengths: [
        '사람의 작은 변화를 포착하는 관찰력',
        '감정에 휩쓸리지 않는 침착함',
        '조용하지만 오래 남는 존재감',
      ],
      blindSpots: [
        '속을 드러내지 않아 거리감이 생길 수 있음',
        '사람을 지나치게 분석 대상으로 볼 수 있음',
      ],
      situations: [
        '단정한 수트에 버건디 또는 와인색 포인트',
        '고딕한 반가면이나 가죽 장갑을 소품으로 활용',
        '과장된 분장보다 침착한 표정과 자세가 핵심',
      ],
      advice: '말하지 않아도 네가 무슨 생각을 하는지 알아.',
      shareText: '내 안의 할로윈 영화 빌런은 「한니발 렉터」🍷 찰떡 코스튬은 클래식 고딕 젠틀맨!',
      viralHint: '당신의 무표정이 무섭다고 말한 친구가 있다면 공유해보세요.',
    },
  ],
}

export default test
