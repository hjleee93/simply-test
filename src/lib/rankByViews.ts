/** 조회수가 많은 순. 같으면 원래 순서(공개 시각이 최근인 순)를 유지한다. */
export function rankByViewCount<T extends { id: string }>(
  items: readonly T[],
  viewCounts: ReadonlyMap<string, number>,
): T[] {
  return items
    .map((item, index) => ({ item, index, views: viewCounts.get(item.id) ?? 0 }))
    .sort((a, b) => b.views - a.views || a.index - b.index)
    .map(({ item }) => item)
}
