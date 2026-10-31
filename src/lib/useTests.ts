import { useEffect, useState } from 'react'
import {
  fetchAllTests,
  fetchFeaturedTests,
  fetchRecommendedTests,
  fetchTest,
  getPreloadedFeaturedTests,
  getPreloadedRecommendedTests,
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
  const [state, setState] = useState<{ id: string | undefined } & TestState>({
    id: undefined,
    test: undefined,
    loading: Boolean(id),
  })

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
  if (state.id !== id) {
    return { test: undefined, loading: Boolean(id) }
  }

  return { test: state.test, loading: state.loading }
}
