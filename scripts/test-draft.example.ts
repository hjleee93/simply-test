/**
 * 새 테스트 작성용 템플릿. 이 파일을 복사해 내용을 채운 뒤
 *   npm run upload:test -- --file ./drafts/myNewTest.ts --publish-at 2026-10-28T00:00:00+09:00
 * 로 업로드한다. (drafts/ 디렉터리는 자유롭게 만들어서 써도 된다)
 */
import type { TestDefinition } from '../src/types/test'

const test: TestDefinition = {
  id: 'new-test-slug',
  title: '테스트 제목',
  description: '테스트 한 줄 설명',
  category: 'self',
  scoringMode: 'simple',
  thumbnailCharacter: 'adapted',
  resultLabel: '결과 라벨',

  questions: [
    {
      id: 1,
      question: '질문 1',
      answers: [
        { id: 'a', text: '답변 A', score: 1 },
        { id: 'b', text: '답변 B', score: 2 },
        { id: 'c', text: '답변 C', score: 3 },
        { id: 'd', text: '답변 D', score: 4 },
      ],
    },
  ],

  results: [
    {
      id: 'result-1',
      min: 0,
      max: 100,
      title: '결과 제목',
      emoji: '🫠',
      description: '결과 설명',
      keyword: '키워드',
    },
  ],
}

export default test
