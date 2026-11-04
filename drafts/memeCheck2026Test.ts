/**
 * 2026 올해 밈 체크.
 *
 * 점수: ○ 알지 4 / × 모름 0. 퍼센트 = 아는 비율.
 * 한 판 20문항은 src/lib/questionSample.ts.
 * UI는 resultTemplate: 'meme' (시험지 톤). 문구는 원문 베끼지 말 것.
 */
import type { Question, TestDefinition } from '../src/types/test'

const KNOW = { id: 'y', text: '○ 알지', score: 4 }
const DONT = { id: 'n', text: '× 모름', score: 0 }

function item(id: number, highlight: string, question: string): Question {
  return {
    id,
    highlight,
    question,
    answers: [KNOW, DONT],
  }
}

const test: TestDefinition = {
  id: 'meme-check-2026',
  title: '2026 올해 밈 체크',
  description:
    '올해 유행한 말, 단톡에서 진짜로 써본 것만 ○. 20문제가 랜덤으로 나옵니다. 아는 만큼 점수가 올라가요.',
  category: 'self',
  scoringMode: 'simple',
  resultTemplate: 'meme',
  minScorePerAnswer: 0,
  thumbnailCharacter: '/characters/meme-check/hero.png',
  resultLabel: '올해 밈 지수',

  questions: [
    item(1, '왜요 ○○쌤', '이름 넣고 챌린지 돌리는 그거. 따라할 줄 앎?'),
    item(2, '좋다 👍', '엄지·새끼손가락 번갈아 까딱까딱. 손 나감?'),
    item(3, '운동 많이 된다', '힘든 일 담담하게 말해 오히려 위로가 되는 그 말.'),
    item(4, '단어 습득하는 몬스터', '좋은 표현 보면 저장하는 그 멘트.'),
    item(5, '김냄비 놀기 신청', '좋아하는 사람한테 보내는 주접 신청서.'),
    item(6, '난리자베스', '상황 터지면 자동으로 나오는 그 말. OO자베스도 됨.'),
    item(7, '공룡만 해', '마음이 아주 클 때. 대상 바꿔 써도 됨.'),
    item(8, '몸이 안 좋아졌어요', '최애 보면 낫는 척하는 릴스 포맷.'),
    item(9, '기도해 드릴게요', '별일도 진지하게 받아 주는 그 톤.'),
    item(10, '냐냐냥', '다음이 궁금해서 기다리게 만드는 추임새.'),
    item(11, '그럼 다음은 무조건 ~겠지', '알고리즘에 내 취향 뜨길 바라는 빈칸.'),
    item(12, '동결건조', '소중한 거 그대로 두고 싶을 때.'),
    item(13, '남쟈 없냐 남쟈', '언니한테 원하는 거 부탁하는 그 말투.'),
    item(14, '레드 / 그린', '별로면 레드, 좋으면 그린. 비교할 때.'),
    item(15, '강남스타일 리믹스', '아무 노래나 그 비트로 갈아엎은 영상.'),
    item(16, '라을라~', '지루할 때 하품 과장하는 그거.'),
    item(17, '골든이여라', '기분 좋을 때 외치는 그 함성.'),
    item(18, '감정 없는 싸이코', '덕질하면서 안 흔들린다는 허세.'),
    item(19, '나 ○○년생 ○○○인데~', '나이·직업 밝히고 엉뚱한 말 이어서 춤추는 거.'),
    item(20, '밀레니얼 vs 젠지 담당', '같은 제품, 세대별 말투 비교 영상.'),
    item(21, '직업 불법적으로 말하기', '평범한 직업을 조직처럼 소개하는 놀이.'),
    item(22, '피라미드 악플', '위축될 때 스스로 위로하는 그 리뷰 톤.'),
    item(23, '아이런걸로피곤하고싶지않다', '사소한 일에 지칠 때 치는 그 문장.'),
    item(24, '니가 좋아', '영화 노래로 립싱크 챌린지 하는 그거.'),
    item(25, '파라파라 오이데', '손님·상품 부르며 추는 춤.'),
    item(26, '띠로리 리믹스', '익숙한 노래를 클래식처럼 바꾼 영상.'),
    item(27, '디오 주간', '힘든 한 주를 짧은 일기로 부르는 말.'),
    item(28, '천연 위고비', '아무 음식에나 레시피처럼 붙이는 놀이.'),
    item(29, '면접 포기', '결정했다가 다시 뒤집는 그 감정.'),
    item(30, '○○삐', '삐에로를 별명으로 부르는 호칭 놀이.'),
    item(31, '무례하지 않게 말해 주세요', '돌려 말해 달라는 릴스 형식.'),
    item(32, '일하기 전 제 모습이고요', '출근 전후 비포·애프터 짤.'),
    item(33, '연락 없네 잘 살아', '답장 기다리다 극단적으로 말하는 그거.'),
    item(34, '이 파트는 꼭 하고 싶음', '킬링파트 듣고 아이돌 주접 치는 그거.'),
    item(35, '최고의 히어로가 되기까지의 이야기', '아무 콘텐츠에나 붙이는 서사 한 줄.'),
    item(36, '느리구나, 쓰러지는 것조차', '답장 느릴 때 도발하는 그 말.'),
    item(37, '○○ 정보', '엄마 정보, 다음 화 정보… 정보 좀요 변형.'),
    item(38, '~하겠어', '다짐을 나열하는 그 포맷. 체포하겠어 계열.'),
    item(39, '이 순간이 영원할 거 같지', '빨리 끝났으면 하는 순간이 안 끝날 때.'),
    item(40, '숨긴다고 숨겨지는 게 아니고', '자랑에 "불법적인 일 하고 있을 것" 맞장구.'),
    item(41, '딸깍', 'AI로 대충 끝내는 그 소리.'),
    item(42, '쉬었음 청년', '놀았음·먹었음으로도 바뀌는 그 말.'),
    item(43, '전업자녀', '부모 집이랑 집안일 루틴을 부르는 말.'),
    item(44, '캥 / 유료캥', '부모 집에 얹혀 사는 상황을 부르는 말.'),
    item(45, '처서매직', '처서 지나니 갑자기 선선해진 그 현상.'),
    item(46, '잼컨', '재밌는 컨텐츠. "잼컨 ㄱㄱ" 할 때.'),
    item(47, '늙크크 / 영크크', '부모 ㅋㅋ이랑 내 ㅋㅋ 구분하는 그거.'),
    item(48, '아리가땡스 / 아자스', '감사·파이팅을 장난스럽게 바꾼 말.'),
  ],

  results: [
    {
      id: 'offline',
      min: 0,
      max: 12,
      title: '속세 밖 주민',
      emoji: '🪨',
      keyword: '타임라인과 절연',
      characterImage: '/characters/meme-check/results/offline.png',
      description:
        '올해 밈이 거의 안 스쳐 간 타입. 유행어 없어도 차는 잘 우러남.\n\n친구가 웃을 때 한 박자 늦게 "그게 뭐야?" 할 수 있음. 그래도 물어보는 쪽이 이김.',
      advice: '모르는 게 죄는 아님. 궁금한 말 하나만 주워도 다음엔 달라짐.',
      shareText: '2026 올해 밈 체크… 나 속세 밖 주민이래ㅋㅋ',
    },
    {
      id: 'heard-the-name',
      min: 13,
      max: 25,
      title: '이름은 들어본 적 있음',
      emoji: '👂',
      keyword: '고개만 끄덕',
      characterImage: '/characters/meme-check/results/heard-the-name.png',
      description:
        '몇 개는 어디선가 본 듯함. 뜻은 흐릿해도 단어는 남음.\n\n유행 가장자리. 한 발만 더 들어오면 댓글이 열림.',
      advice: '릴스 세 개만 더 보면, 다음엔 맞장구가 먼저 나옴.',
      shareText: '올해 밈 체크 결과: 이름은 들어봄 수준.',
    },
    {
      id: 'reels-passer',
      min: 26,
      max: 37,
      title: '릴스 스침 전문',
      emoji: '📱',
      keyword: '알고리즘 의존형',
      characterImage: '/characters/meme-check/results/reels-passer.png',
      description:
        '피드가 가져다주면 아는 타입. 저장은 잘 안 하고 그 순간만 웃고 넘김.\n\n목격자 포지션. 생산은 아직 다음 시험.',
      advice: '저장 폴더 하나 만들면 다음엔 점수가 달라짐.',
      shareText: '올해 밈 체크: 나는 릴스 스침 전문.',
    },
    {
      id: 'can-comment',
      min: 38,
      max: 50,
      title: '댓글은 달 줄 앎',
      emoji: '💬',
      keyword: '절반 합격',
      characterImage: '/characters/meme-check/results/can-comment.png',
      description:
        '올해 말의 절반쯤은 바로 뜻이 떠오름. 유행 한가운데에 한 발.\n\n설명 없이 웃을 수 있는 구간. 나머지는 친구가 알려 주면 됨.',
      advice: '아는 척은 이미 충분함. 모르는 말도 가끔은 그냥 물어봐.',
      shareText: '올해 밈 체크 절반 통과. 댓글은 달 수 있음.',
    },
    {
      id: 'timeline-local',
      min: 51,
      max: 62,
      title: '타임라인 현지인',
      emoji: '🗺️',
      keyword: '단톡 통역사',
      characterImage: '/characters/meme-check/results/timeline-local.png',
      description:
        '올해 말을 현지 언어처럼 씀. 친구가 못 알아들으면 당신이 먼저 풀어 줌.\n\n이 정도면 올해를 같이 산 사람.',
      advice: '풀어 주는 건 한 줄이면 됨. 두 줄부터는 강의임.',
      shareText: '2026 올해 밈 체크, 나 타임라인 현지인.',
    },
    {
      id: 'archive',
      min: 63,
      max: 75,
      title: '밈 저장소',
      emoji: '🗂️',
      keyword: '보는 족족 저장',
      characterImage: '/characters/meme-check/results/archive.png',
      description:
        '스치면 저장하는 타입. 폴더 이름이 곧 올해 연표.\n\n말은 알아도 타이밍을 고름. 꺼내는 순간 그 자리가 올해가 됨.',
      advice: '저장만 하면 폴더가 이김. 오늘은 하나만 써 봐.',
      shareText: '내 저장 폴더 = 2026 밈 연표.',
    },
    {
      id: 'evangelist',
      min: 76,
      max: 87,
      title: '밈 전도사',
      emoji: '📣',
      keyword: '식기 전에 바름',
      characterImage: '/characters/meme-check/results/evangelist.png',
      description:
        '유행이 식기 전에 주변에 갖다 바르는 타입. 새 말을 가장 먼저 실험함.\n\n친구들 밈 점수를 당신이 끌어올리고 있을 가능성 큼.',
      advice: '상대가 모르면 한 줄만. 설명은 짧을수록 잘 붙음.',
      shareText: '올해 밈 체크 고득점. 전도사 나옴. 미안.',
    },
    {
      id: 'the-meme',
      min: 88,
      max: 100,
      title: '밈 그 자체 · 만점 후보',
      emoji: '🏆',
      keyword: '만점 후보',
      characterImage: '/characters/meme-check/results/the-meme.png',
      description:
        '올해 말을 거의 다 아는 타입. 새 표현이 돌기 전에 이미 비슷한 말 쓰고 있었을 수도.\n\n시험지가 당신을 테스트한 게 아니라, 당신이 시험지를 검수한 쪽에 가까움.',
      advice: '너무 빠르면 혼자 됨. 한 박자만 늦춰도 같이 웃을 수 있음.',
      shareText: '2026 올해 밈 체크 만점 근처. 내가 밈이다.',
    },
  ],
}

export default test
