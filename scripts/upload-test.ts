/**
 * 새 테스트를 Supabase에 업로드/예약 공개한다.
 *
 * 사용법:
 *   npm run upload:test -- --file ./drafts/newTest.ts
 *   npm run upload:test -- --file ./drafts/newTest.ts --publish-at 2026-10-28T00:00:00+09:00
 *
 * --file 은 TestDefinition 객체를 default export 하는 .ts 파일 (scripts/test-draft.example.ts 참고).
 * --publish-at 을 생략하면 지금 바로 공개된다. 미래 시각을 주면 그 시각부터 자동 공개된다
 * (코드 재배포 불필요 — 단 OG/sitemap 등 정적 SEO 자산은 다음 빌드에서 반영됨).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { TestDefinition } from '../src/types/test'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
loadDotenv({ path: path.join(root, 'scripts/.env') })

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {}
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token.startsWith('--')) {
      args[token.slice(2)] = argv[i + 1] ?? ''
      i += 1
    }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (!args.file) {
    console.error('사용법: npm run upload:test -- --file ./drafts/newTest.ts [--publish-at 2026-10-28T00:00:00+09:00]')
    process.exit(1)
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('scripts/.env 에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 를 설정해주세요.')
    process.exit(1)
  }

  const modulePath = path.resolve(process.cwd(), args.file)
  const mod = (await import(modulePath)) as { default?: TestDefinition }
  const test = mod.default

  if (!test?.id || !test.questions?.length || !test.results?.length) {
    console.error(`${args.file} 은 TestDefinition 객체를 default export 해야 해요.`)
    process.exit(1)
  }

  const publishAt = args['publish-at'] ? new Date(args['publish-at']) : new Date()
  if (Number.isNaN(publishAt.getTime())) {
    console.error(`--publish-at 값을 파싱할 수 없어요: ${args['publish-at']}`)
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { error } = await supabase.from('tests').upsert(
    {
      id: test.id,
      title: test.title,
      description: test.description,
      category: test.category,
      character: test.thumbnailCharacter ?? 'adapted',
      scoring_mode: test.scoringMode ?? 'simple',
      result_template: test.resultTemplate ?? null,
      requires_gender: test.requiresGender ?? false,
      result_label: test.resultLabel ?? null,
      min_score_per_answer: test.minScorePerAnswer ?? null,
      questions: test.questions,
      results: test.results,
      publish_at: publishAt.toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw error
  console.log(`"${test.title}" (${test.id}) → publish_at ${publishAt.toISOString()} 로 업로드 완료!`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
