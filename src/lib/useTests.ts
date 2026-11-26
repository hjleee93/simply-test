import { useEffect, useState } from 'react'
import {
  fetchAllTests,
  fetchFeaturedTests,
  fetchHomeTests,
  fetchRecommendedTests,
  fetchViewCounts,
  fetchTest,
  getPreloadedFeaturedTests,
  getPreloadedHomeTests,
  getPreloadedRecommendedTests,
  getPreloadedTest,
  MAIN_PAGE_TEST_LIMIT,
  RECOMMENDED_TEST_LIMIT,
} from '../data'
import type { TestDefinition } from '../types/test'

type ListState = {
  tests: TestDefinition[]
  loading: boolean
}

type TestState = {
  test: TestDefinition | undefined
  loading: boolean
}

export function useAllTests(): ListState {
  const [state, setState] = useState<ListState>({ tests: [], loading: true })

  useEffect(() => {
    let active = true
    fetchAllTests().then((tests) => {
      if (active) setState({ tests, loading: false })
    })
    return () => {
      active = false
    }
  }, [])

  return state
}

export function useFeaturedTests(limit = MAIN_PAGE_TEST_LIMIT): ListState {
  const preloaded = getPreloadedFeaturedTests(limit)
  const [state, setState] = useState<ListState>({
    tests: preloaded,
    loading: preloaded.length === 0,
  })

  useEffect(() => {
    let active = true
    fetchFeaturedTests(limit).then((tests) => {
      if (active) setState({ tests, loading: false })
    })
    return () => {
      active = false
    }
  }, [limit])

  return state
}

export function useRecommendedTests(
  excludeTestId: string,
  limit = RECOMMENDED_TEST_LIMIT,
): ListState {
  const preloaded = getPreloadedRecommendedTests(excludeTestId, limit)
  const [state, setState] = useState<ListState>({
    tests: preloaded,
    loading: preloaded.length === 0,
  })

  useEffect(() => {
    let active = true
    fetchRecommendedTests(excludeTestId, limit).then((tests) => {
      if (active) setState({ tests, loading: false })
    })
    return () => {
      active = false
    }
  }, [excludeTestId, limit])

  return state
}

export function useTest(id: string | undefined): TestState {
  const preloaded = id ? getPreloadedTest(id) : undefined
  const [state, setState] = useState<{ id: string | undefined } & TestState>(() => ({
    id: preloaded ? id : undefined,
    test: preloaded,
    loading: Boolean(id) && !preloaded,
  }))

  useEffect(() => {
    if (!id) return

    let active = true
    fetchTest(id).then((test) => {
      if (active) setState({ id, test, loading: false })
    })
    return () => {
      active = false
    }
  }, [id])

  // id가 바뀐 직후, 아직 그 id에 대한 fetch 결과로 state가 갱신되지 않은 구간은
  // 렌더 중에 바로 "loading"으로 취급한다 (effect에서 동기 setState 호출을 피하기 위함).
  // 단, 프리로드된 데이터가 있으면 그것을 사용한다.
  if (state.id !== id) {
    const preloadedNow = id ? getPreloadedTest(id) : undefined
    if (preloadedNow) {
      return { test: preloadedNow, loading: false }
    }
    return { test: undefined, loading: Boolean(id) }
  }

  return { test: state.test, loading: state.loading }
}

/** 홈: 최신 공개순 전체 + 조회수. 빌드 때 심어둔 데이터로 먼저 그리고, 최신 값으로 갱신한다. */
export function useHomeTests(): ListState {
  const [state, setState] = useState<ListState>(() => {
    const preloaded = getPreloadedHomeTests()
    return { tests: preloaded, loading: preloaded.length === 0 }
  })

  useEffect(() => {
    let active = true
    fetchHomeTests().then((tests) => {
      if (active) setState({ tests, loading: false })
    })
    return () => {
      active = false
    }
  }, [])

  return state
}

/** 테스트 한 개의 누적 조회수. 모르면 null. */
export function useViewCount(testId: string | undefined): number | null {
  const [state, setState] = useState<{ id: string; count: number | null } | null>(null)

  useEffect(() => {
    if (!testId) return
    let active = true
    fetchViewCounts().then((counts) => {
      if (active) setState({ id: testId, count: counts?.get(testId) ?? null })
    })
    return () => {
      active = false
    }
  }, [testId])

  return state && state.id === testId ? state.count : null
}
