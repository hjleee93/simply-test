import type { Question, TestResult } from '../types/test'
import og from '../lib/og.json' with { type: 'json' }

const meta = og.tests.find((test) => test.id === 'workplace-persona-test')!

const WORKPLACE_CHAR = '/characters/pixel/workplace'

export const workplacePersonaTest = {
  id: meta.id,
  title: meta.title,
  description: meta.description,
  scoringMode: 'pattern' as const,
  resultTemplate: 'company' as const,
  thumbnailCharacter: 'workplace/survival',
  resultLabel: '회사 자아 유형',

  questions: [
    {
      id: 1,
      question: '퇴근 10분 전, 팀장님이 "혹시 이것만 하나 해줄 수 있어요?"라고 한다면?',
      answers: [
        { id: 'a', text: '일단 알겠다고 하고 바로 처리한다', patternScores: { doer: 2 } },
        { id: 'b', text: '어떤 일인지, 얼마나 걸리는지부터 확인한다', patternScores: { watcher: 2 } },
        { id: 'c', text: '내일 처리해도 되는지 물어본다', patternScores: { survival: 2 } },
        { id: 'd', text: '웃으면서 "네..."라고 하지만 속으로는 퇴근 생각만 한다', patternScores: { pleaser: 2 } },
      ],
    },
    {
      id: 2,
      question: '업무 메신저가 왔는데, 지금 당장 답하지 않아도 되는 내용이다.',
      answers: [
        { id: 'a', text: '일단 확인하고 바로 답장부터 보낸다', patternScores: { doer: 2 } },
        { id: 'b', text: '급한 건지 아닌지 먼저 판단하고 타이밍을 본다', patternScores: { watcher: 2 } },
        { id: 'c', text: '바로 답 안 하면 서운해할까 봐 일단 답한다', patternScores: { pleaser: 2 } },
        { id: 'd', text: '답장이 늦으면 상대가 어떻게 생각할지 신경 쓰인다', patternScores: { sensitive: 2 } },
      ],
    },
    {
      id: 3,
      question: '회의에서 내가 생각한 것과 다른 의견이 나왔다.',
      answers: [
        { id: 'a', text: '분위기를 보고 말할 타이밍을 잰다', patternScores: { watcher: 2 } },
        { id: 'b', text: '굳이 반박하지 않고 맞춰준다', patternScores: { pleaser: 2 } },
        { id: 'c', text: '내 의견이 무시된 것 같아 계속 신경 쓰인다', patternScores: { sensitive: 2 } },
        { id: 'd', text: '감정은 접어두고 내 의견도 짧게 말한다', patternScores: { detached: 2 } },
      ],
    },
    {
      id: 4,
      question: '동료가 갑자기 "이거 좀 대신 처리해줄 수 있어요?"라고 부탁한다.',
      answers: [
        { id: 'a', text: '바쁘지만 거절하지 못하고 결국 맡는다', patternScores: { pleaser: 2 } },
        { id: 'b', text: '거절한 뒤에도 괜히 미안해서 계속 신경 쓰인다', patternScores: { sensitive: 2 } },
        { id: 'c', text: '내 업무가 아니면 담백하게 거절한다', patternScores: { detached: 2 } },
        { id: 'd', text: '내가 처리할 수 있는 선에서 조용히 해결한다', patternScores: { selfSolver: 2 } },
      ],
    },
    {
      id: 5,
      question: '단톡방에 올린 내 의견에 아무도 반응이 없다.',
      answers: [
        { id: 'a', text: '괜히 신경 쓰이고 계속 생각난다', patternScores: { sensitive: 2 } },
        { id: 'b', text: '반응이 없어도 별로 신경 쓰지 않는다', patternScores: { detached: 2 } },
        { id: 'c', text: '필요한 내용이면 다시 한번 정리해서 올린다', patternScores: { selfSolver: 2 } },
        { id: 'd', text: '분위기를 보고 다른 방식으로 다시 언급한다', patternScores: { social: 2 } },
      ],
    },
    {
      id: 6,
      question: '싫어하는 동료와 같은 프로젝트를 하게 됐다.',
      answers: [
        { id: 'a', text: '감정은 접어두고 업무적으로만 대한다', patternScores: { detached: 2 } },
        { id: 'b', text: '최대한 내 몫은 확실히 끝내서 문제 없게 만든다', patternScores: { selfSolver: 2 } },
        { id: 'c', text: '겉으로는 무난하게, 적당한 선에서 잘 지낸다', patternScores: { social: 2 } },
        { id: 'd', text: '이 프로젝트만 끝나면 된다는 생각으로 버틴다', patternScores: { survival: 2 } },
      ],
    },
    {
      id: 7,
      question: '내가 맡은 업무 진행 방식에 대해 상사가 다른 의견을 냈다.',
      answers: [
        { id: 'a', text: '내 몫은 확실히 끝내서 결과로 보여준다', patternScores: { selfSolver: 2 } },
        { id: 'b', text: '상사 의견도 일부 받아들이며 절충안을 찾는다', patternScores: { social: 2 } },
        { id: 'c', text: '굳이 부딪히지 않고 시키는 대로 한다', patternScores: { survival: 2 } },
        { id: 'd', text: '바로 수정해서 다시 진행한다', patternScores: { doer: 2 } },
      ],
    },
    {
      id: 8,
      question: '친하지 않은 동료가 점심을 같이 먹자고 한다.',
      answers: [
        { id: 'a', text: '당연히 좋다고 하며 같이 먹는다', patternScores: { social: 2 } },
        { id: 'b', text: '분위기를 보고 괜찮을 것 같으면 함께한다', patternScores: { watcher: 2 } },
        { id: 'c', text: '일단 알겠다고 대답부터 한다', patternScores: { doer: 2 } },
        { id: 'd', text: '혼자만의 시간이 필요해서 자연스럽게 거절한다', patternScores: { survival: 2 } },
      ],
    },
    {
      id: 9,
      question: '내가 맡은 업무에서 실수가 발견됐다.',
      answers: [
        { id: 'a', text: '바로 인정하고 해결 방법부터 찾는다', patternScores: { doer: 2 } },
        { id: 'b', text: '누가 먼저 알아챘는지, 분위기가 어떤지부터 살핀다', patternScores: { watcher: 2 } },
        { id: 'c', text: '"제 실수예요, 죄송해요"부터 말하고 본다', patternScores: { pleaser: 2 } },
        { id: 'd', text: '큰 문제 아니면 넘어가고 다음부턴 조심하자고 생각한다', patternScores: { survival: 2 } },
      ],
    },
    {
      id: 10,
      question: '퇴근 직전에 동료가 업무 관련 질문을 한다.',
      answers: [
        { id: 'a', text: '자세히 답해주고 나서 퇴근한다', patternScores: { pleaser: 2 } },
        { id: 'b', text: '간단히 답하고 나머지는 내일 이야기하자고 한다', patternScores: { doer: 2 } },
        { id: 'c', text: '길어질 것 같으면 눈치껏 대화를 정리한다', patternScores: { watcher: 2 } },
        { id: 'd', text: '답해주면서도 상대가 서운해할까 봐 신경 쓰인다', patternScores: { sensitive: 2 } },
      ],
    },
    {
      id: 11,
      question: '팀 단톡방에서 내가 보낸 메시지에 아무도 답이 없다.',
      answers: [
        { id: 'a', text: '별생각 없이 넘어간다', patternScores: { detached: 2 } },
        { id: 'b', text: '내가 뭔가 이상하게 말했나 계속 생각한다', patternScores: { sensitive: 2 } },
        { id: 'c', text: '필요한 내용이면 다시 한번 확인 차 언급한다', patternScores: { watcher: 2 } },
        { id: 'd', text: '답이 없어도 티 내지 않고 그러려니 한다', patternScores: { pleaser: 2 } },
      ],
    },
    {
      id: 12,
      question: '갑자기 할 일이 없어서 붕 뜨는 시간이 생겼다.',
      answers: [
        { id: 'a', text: '도와줄 일 없는지 동료들을 둘러본다', patternScores: { pleaser: 2 } },
        { id: 'b', text: '밀렸던 개인 업무나 공부를 스스로 챙겨서 한다', patternScores: { selfSolver: 2 } },
        { id: 'c', text: '조용히 개인적인 일을 한다', patternScores: { detached: 2 } },
        { id: 'd', text: '괜히 일을 더 만들어서 바쁘게 있는 척한다', patternScores: { sensitive: 2 } },
      ],
    },
    {
      id: 13,
      question: '상사가 내 업무 스타일에 대해 돌려서 지적하는 것 같다.',
      answers: [
        { id: 'a', text: '그 말이 계속 머릿속에 맴돈다', patternScores: { sensitive: 2 } },
        { id: 'b', text: '감정 상하지 않고 필요한 부분만 받아들인다', patternScores: { detached: 2 } },
        { id: 'c', text: '스스로 원인을 찾아서 다음엔 안 그러려고 한다', patternScores: { selfSolver: 2 } },
        { id: 'd', text: '상사와 편하게 이야기하며 오해를 풀어본다', patternScores: { social: 2 } },
      ],
    },
    {
      id: 14,
      question: '회식 자리, 다들 늦게까지 남아 있는 분위기다.',
      answers: [
        { id: 'a', text: '감정 소모하지 않고 적당히 있다가 조용히 빠진다', patternScores: { detached: 2 } },
        { id: 'b', text: '내 페이스대로 있다가 할 일이 끝나면 먼저 정리한다', patternScores: { selfSolver: 2 } },
        { id: 'c', text: '분위기 봐가며 적당히 어울리다 눈치껏 빠진다', patternScores: { social: 2 } },
        { id: 'd', text: '몸은 있어도 마음은 이미 집에 가 있다', patternScores: { survival: 2 } },
      ],
    },
    {
      id: 15,
      question: '프로젝트가 산으로 가고 있는데 아무도 먼저 나서지 않는다.',
      answers: [
        { id: 'a', text: '내가 맡은 부분만이라도 확실히 마무리 짓는다', patternScores: { selfSolver: 2 } },
        { id: 'b', text: '분위기를 살피며 적절한 타이밍에 의견을 낸다', patternScores: { social: 2 } },
        { id: 'c', text: '나서봤자 나만 손해라는 생각에 조용히 있는다', patternScores: { survival: 2 } },
        { id: 'd', text: '일단 내가 먼저 나서서 상황을 정리한다', patternScores: { doer: 2 } },
      ],
    },
    {
      id: 16,
      question: '입사한 지 얼마 안 된 후배가 나에게 조언을 구한다.',
      answers: [
        { id: 'a', text: '적당히 도움 되는 선에서 친절하게 알려준다', patternScores: { social: 2 } },
        { id: 'b', text: '나도 여유가 없어서 짧게 답해주고 만다', patternScores: { survival: 2 } },
        { id: 'c', text: '바로 시간 내서 자세히 알려준다', patternScores: { doer: 2 } },
        { id: 'd', text: '후배가 어떤 스타일인지 먼저 파악하고 맞춰서 알려준다', patternScores: { watcher: 2 } },
      ],
    },
  ] as Question[],

  results: [
    {
      id: 'survival',
      min: 0,
      max: 0,
      emoji: '⏰',
      title: '퇴근만 기다리는 생존형 직장인',
      keyword: '몸은 자리에, 마음은 이미 퇴근한 타입',
      description:
        '당신에게 회사에서 가장 중요한 목표는 "오늘도 무사히"입니다. 열정을 최대치로 끌어올리기보다, 정시 퇴근과 워라밸을 지키는 것이 우선입니다. 큰 사고 없이 하루를 버텨내는 것 자체가 성과라고 생각하는 편이라, 불필요한 일에는 힘을 빼지 않습니다.',
      strengths: [
        '자기 시간과 에너지를 지킬 줄 안다',
        '불필요한 일에 힘을 빼지 않는다',
        '워라밸을 지키려는 기준이 뚜렷하다',
      ],
      blindSpots: [
        '열정 없어 보인다는 오해를 살 수 있음',
        '애매한 업무 태도로 비칠 수 있음',
        '정말 중요한 순간에도 발 빼려는 것처럼 보일 수 있음',
      ],
      situations: [
        '퇴근 10분 전엔 시계만 보임',
        '회의가 길어지면 마음이 급해짐',
        '"오늘 안에 될까요?"에 "내일 하면 안 될까요?"가 먼저 나옴',
      ],
      advice: '버티는 것도 능력입니다. 다만 티는 조금만 내보세요.',
      shareText: '나는 「퇴근만 기다리는 생존형 직장인」 · 몸은 자리에, 마음은 이미 퇴근한 타입',
      viralHint: '회사에서 이러고 있는 거 나만 아는 줄 알았는데, 동료한테도 시켜보세요.',
      characterImage: `${WORKPLACE_CHAR}/survival.png`,
    },
    {
      id: 'doer',
      min: 0,
      max: 0,
      emoji: '🏃',
      title: '일단 몸부터 움직이는 행동파',
      keyword: '생각보다 실행이 빠른 타입',
      description:
        '당신은 뭔가 시켜지면 고민보다 실행이 먼저입니다. 일이 생기면 바로 뛰어들고, 문제가 터지면 일단 해결부터 하려고 합니다. 빠른 반응 속도 덕분에 믿음직하다는 평가를 받지만, 그만큼 일이 자꾸 몰리는 편이기도 합니다.',
      strengths: [
        '실행력이 빠르고 믿음직함',
        '문제가 생기면 일단 나서서 해결함',
        '신뢰를 빠르게 쌓는 편',
      ],
      blindSpots: [
        '일이 자꾸 몰릴 수 있음 (만만해 보임)',
        '생각보다 몸이 먼저 움직여 손해 볼 때도 있음',
        '거절을 잘 못해 과부하가 걸릴 수 있음',
      ],
      situations: [
        '"네!"가 생각보다 먼저 나감',
        '문제가 생기면 일단 뛰어들고 봄',
        '시키는 일보다 빨리 끝내는 편',
      ],
      advice: '빠른 실행도 좋지만, 가끔은 숨 고르고 가도 됩니다.',
      shareText: '나는 「일단 몸부터 움직이는 행동파」 · 생각보다 실행이 빠른 타입',
      viralHint: '일 잘한다는 소리 듣는 만큼, 일도 제일 많이 받고 있지 않나요?',
      characterImage: `${WORKPLACE_CHAR}/doer.png`,
    },
    {
      id: 'watcher',
      min: 0,
      max: 0,
      emoji: '👀',
      title: '분위기부터 읽는 눈치형',
      keyword: '말보다 분위기를 먼저 파악하는 타입',
      description:
        '당신은 회의실 문을 열기 전에도 분위기부터 살핍니다. 무언가 말하기 전에 "지금 말해도 되나?"를 늘 먼저 생각하고, 상사의 표정 하나로 오늘 컨디션을 짐작할 수 있습니다. 눈치가 빠른 만큼 타이밍을 놓치는 일은 별로 없습니다.',
      strengths: [
        '분위기 파악이 빠름',
        '타이밍을 잘 맞춤',
        '눈치껏 대처하는 능력이 뛰어남',
      ],
      blindSpots: [
        '눈치 보다가 정작 하고 싶은 말을 못 함',
        '지나치게 신중해서 타이밍을 놓칠 수 있음',
        '표현하지 않는 만큼 감정 소모가 은근히 큼',
      ],
      situations: [
        '회의실 들어가기 전에 분위기부터 살핌',
        '"이거 지금 말해도 되나?"를 늘 고민함',
        '상사 표정만 봐도 오늘 컨디션이 감이 옴',
      ],
      advice: '눈치는 이미 충분합니다. 가끔은 그냥 말해도 괜찮아요.',
      shareText: '나는 「분위기부터 읽는 눈치형」 · 말보다 분위기를 먼저 파악하는 타입',
      viralHint: '이 정도 눈치면, 사실 다 알고 있는 거 아니에요?',
      characterImage: `${WORKPLACE_CHAR}/watcher.png`,
    },
    {
      id: 'pleaser',
      min: 0,
      max: 0,
      emoji: '🥲',
      title: '거절 못하는 착한 직장인',
      keyword: '"괜찮아요"라고 말하지만 하나도 안 괜찮은 타입',
      description:
        '당신은 부탁을 받으면 거절하기가 어렵습니다. "혹시 이것도 해줄 수 있어요?"라는 말을 들으면, 싫어도 일단 해주는 경우가 많습니다. 팀에서는 좋은 사람이라는 평가를 받지만, 그만큼 본인은 조금씩 지쳐가고 있을 수 있습니다.',
      strengths: [
        '팀에서 평판이 좋음',
        '누구에게나 친절하게 대함',
        '부탁받으면 웬만하면 다 들어줌',
      ],
      blindSpots: [
        '점점 지쳐가면서도 티를 잘 안 냄',
        '정작 내 업무는 뒤로 밀림',
        '"원래 다 해주는 사람"으로 굳어질 수 있음',
      ],
      situations: [
        '"이것도 해줄 수 있어요?"에 거의 항상 "네"라고 함',
        '부탁을 거절하면 하루 종일 마음이 쓰임',
        '정작 힘들다는 말은 잘 못 함',
      ],
      advice: '"괜찮아요"라고 말하면서 하나도 안 괜찮습니다. 가끔은 솔직해져도 됩니다.',
      shareText: '나는 「거절 못하는 착한 직장인」 · "괜찮아요"라고 말하지만 하나도 안 괜찮은 타입',
      viralHint: '부탁 자주 받는 편이라면, 이거 동료한테도 보내보세요.',
      characterImage: `${WORKPLACE_CHAR}/pleaser.png`,
    },
    {
      id: 'sensitive',
      min: 0,
      max: 0,
      emoji: '💭',
      title: '일보다 인간관계가 더 피곤한 타입',
      keyword: '업무는 끝이 있는데 사람은 끝이 없는 타입',
      description:
        '당신은 업무보다 사람 때문에 에너지가 더 많이 소모되는 편입니다. 회의에서의 말투, 메신저 답장, 애매한 분위기 같은 것들을 계속 생각하게 됩니다. 오히려 업무는 명확해서 편하게 느껴질 정도입니다.',
      strengths: [
        '관계의 미묘한 신호를 잘 알아챔',
        '사람들과의 조화를 중요하게 여김',
        '세심하고 배려심이 깊음',
      ],
      blindSpots: [
        '별일 아닌 것도 계속 곱씹음',
        '사람 때문에 에너지를 다 씀',
        '업무 스트레스보다 관계 스트레스가 더 큼',
      ],
      situations: [
        '메신저 답장 하나에도 신경이 쓰임',
        '회의에서 말투 하나까지 계속 생각남',
        '애매한 반응을 받으면 하루 종일 생각남',
      ],
      advice: '업무는 하면 끝인데 사람은 끝이 없습니다. 모든 반응에 이유가 있는 건 아니에요.',
      shareText: '나는 「일보다 인간관계가 더 피곤한 타입」 · 업무는 끝이 있는데 사람은 끝이 없는 타입',
      viralHint: '이거 나 아는 사람이 보면 바로 알아챌 것 같은데, 보내볼까요.',
      characterImage: `${WORKPLACE_CHAR}/sensitive.png`,
    },
    {
      id: 'detached',
      min: 0,
      max: 0,
      emoji: '🧊',
      title: '감정 숨기고 일하는 냉정형',
      keyword: '싫어도 티 내지 않고 할 일은 하는 타입',
      description:
        '당신은 회사에서 감정보다 업무를 우선합니다. 싫어하는 사람이 있어도 필요한 업무는 깔끔하게 처리하고, 화가 나도 웬만하면 티를 내지 않습니다. 프로페셔널하다는 평가를 받는 만큼, 속마음은 아무도 모를 수 있습니다.',
      strengths: [
        '감정에 휘둘리지 않고 업무를 처리함',
        '불필요한 감정 소모를 하지 않음',
        '프로페셔널하다는 평가를 받음',
      ],
      blindSpots: [
        '속마음을 아무도 모를 수 있음',
        '감정을 너무 눌러서 갑자기 터질 수 있음',
        '차갑다는 오해를 살 수 있음',
      ],
      situations: [
        '싫은 사람과도 업무는 깔끔하게 처리함',
        '화나도 티 내지 않고 넘어감',
        '"저 사람 무슨 생각하는지 모르겠다"는 말을 종종 들음',
      ],
      advice: '감정을 숨기는 것과 없는 것은 다릅니다. 가끔은 표현해도 괜찮아요.',
      shareText: '나는 「감정 숨기고 일하는 냉정형」 · 싫어도 티 내지 않고 할 일은 하는 타입',
      viralHint: '겉으론 쿨해 보여도 속은 다를 수 있죠. 친구는 어떨지 궁금하지 않아요?',
      characterImage: `${WORKPLACE_CHAR}/detached.png`,
    },
    {
      id: 'selfSolver',
      min: 0,
      max: 0,
      emoji: '🧩',
      title: '혼자 조용히 해결하는 자기완결형',
      keyword: '웬만하면 스스로 끝내는 타입',
      description:
        '당신은 문제가 생기면 도움을 요청하기보다 혼자 해결하려는 편입니다. 실수를 하든, 모르는 게 있든 일단 스스로 찾아보고 수습해봅니다. 책임감이 강하고 남에게 폐 끼치는 걸 싫어하지만, 그만큼 혼자 짊어지는 부담도 큽니다.',
      strengths: [
        '책임감이 강하고 믿음직함',
        '스스로 문제를 해결하는 힘이 있음',
        '남에게 폐 끼치는 걸 싫어함',
      ],
      blindSpots: [
        '혼자 끙끙 앓다가 일이 커질 수 있음',
        '도움을 청하는 게 서툶',
        '힘든 티를 안 내서 아무도 몰라줌',
      ],
      situations: [
        '실수하면 먼저 혼자 수습해봄',
        '모르는 것도 일단 스스로 찾아봄',
        '"괜찮아요, 혼자 할 수 있어요"가 입에 붙음',
      ],
      advice: '혼자 다 짊어지지 않아도 됩니다. 가끔은 도와달라고 해도 돼요.',
      shareText: '나는 「혼자 조용히 해결하는 자기완결형」 · 웬만하면 스스로 끝내는 타입',
      viralHint: '이거 혼자 다 하는 사람 은근 많던데, 동료도 시켜보세요.',
      characterImage: `${WORKPLACE_CHAR}/selfSolver.png`,
    },
    {
      id: 'social',
      min: 0,
      max: 0,
      emoji: '🙂',
      title: '적당히 사회생활 잘하는 밸런스형',
      keyword: '선 넘지 않고 딱 적당하게 지내는 타입',
      description:
        '당신은 회사에서 관계를 능숙하게 조절할 줄 압니다. 무리해서 맞추지는 않지만, 누구와도 무난하게 지내고 갈등 상황도 매끄럽게 넘깁니다. 사회생활의 고수라는 평가를 받지만, 진짜 속마음은 잘 안 보여줄 때가 많습니다.',
      strengths: [
        '관계에서 적당한 거리와 균형을 잘 잡음',
        '누구와도 무난하게 지냄',
        '갈등 상황도 매끄럽게 넘김',
      ],
      blindSpots: [
        '진짜 속마음은 잘 안 보여줄 수 있음',
        '너무 무난해서 존재감이 약할 수 있음',
        '모두에게 좋은 사람이려다 정작 나를 놓칠 수 있음',
      ],
      situations: [
        '누구와 있어도 적당히 잘 지냄',
        '갈등이 생기면 자연스럽게 중재함',
        '"저 사람은 참 무난해"라는 평을 자주 들음',
      ],
      advice: '다 잘 맞추는 것도 좋지만, 편한 사람에게는 좀 더 솔직해져도 됩니다.',
      shareText: '나는 「적당히 사회생활 잘하는 밸런스형」 · 선 넘지 않고 딱 적당하게 지내는 타입',
      viralHint: '회사에서 같이 일하는 친구한테 이거 보내보세요. 결과가 다를 수도 있어요.',
      characterImage: `${WORKPLACE_CHAR}/social.png`,
    },
  ] as TestResult[],
} as const
