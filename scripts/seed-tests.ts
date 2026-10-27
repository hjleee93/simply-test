/**
 * 1회용 마이그레이션: 기존에 코드에 하드코딩돼 있던 6개 테스트를 Supabase `tests` 테이블로 옮긴다.
 * 실행: npm run seed:tests  (scripts/.env 에 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요)
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

import { genderTest } from './legacy-test-data/genderTest'
import { jinSangTest } from './legacy-test-data/jinSangTest'
import { kkondaeTest } from './legacy-test-data/kkondaeTest'
import { relationshipPatternTest } from './legacy-test-data/relationshipPatternTest'
import { retirementTest } from './legacy-test-data/retirementTest'
import { workplacePersonaTest } from './legacy-test-data/workplacePersonaTest'
import type { TestDefinition } from '../src/types/test'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
loadDotenv({ path: path.join(root, 'scripts/.env') })

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('scripts/.env 에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 를 설정해주세요.')
  console.error('(scripts/.env.example 을 복사해서 채우면 됩니다)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// 기존 og.json에 있던 공개 순서를 그대로 과거 publish_at에 매핑해 "이미 공개된" 테스트로 이전한다.
const legacyOrder: { test: TestDefinition; character: string; daysAgo: number }[] = [
  { test: retirementTest, character: 'steel', daysAgo: 60 },
  { test: genderTest, character: 'subtle', daysAgo: 50 },
  { test: kkondaeTest, character: 'kkondae/main', daysAgo: 40 },
  { test: jinSangTest, character: 'jinsang/main', daysAgo: 30 },
  { test: relationshipPatternTest, character: 'relationship/main', daysAgo: 20 },
  { test: workplacePersonaTest, character: 'workplace/survival', daysAgo: 10 },
]

function toRow({ test, character, daysAgo }: (typeof legacyOrder)[number]) {
  const publishAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  return {
    id: test.id,
    title: test.title,
    description: test.description,
    category: test.category,
    character,
    scoring_mode: test.scoringMode ?? 'simple',
    result_template: test.resultTemplate ?? null,
    requires_gender: test.requiresGender ?? false,
    result_label: test.resultLabel ?? null,
    min_score_per_answer: test.minScorePerAnswer ?? null,
    questions: test.questions,
    results: test.results,
    publish_at: publishAt.toISOString(),
  }
}

async function main() {
  const rows = legacyOrder.map(toRow)
  const { error } = await supabase.from('tests').upsert(rows, { onConflict: 'id' })
  if (error) throw error
  console.log(`${rows.length}개 테스트를 Supabase로 이전했어요.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
