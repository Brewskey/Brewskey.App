import type { InfiniteData } from '@tanstack/react-query';

/**
 * Flatten the `pages` of a React Query `useInfiniteQuery` result into a single array.
 * Returns an empty array when the data is not yet available.
 */
export const flattenInfinitePages = <TItem>(
  data: InfiniteData<TItem[]> | undefined,
): TItem[] => data?.pages.flatMap((page) => page) ?? [];
