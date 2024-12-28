import { QueryStatus, UseQueryResult } from '@tanstack/react-query';

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type UseMultipleQueryResultsData<
  T extends Record<string, UseQueryResult<unknown, Error>>,
> = {
  [K in keyof T]: Exclude<T[K]['data'], undefined>;
};

export const useMultipleQueryResults = <
  TQueries extends Record<string, UseQueryResult<unknown, Error>>,
>(
  queries: TQueries,
): UseQueryResult<UseMultipleQueryResultsData<TQueries>, Error> => {
  const itemsInQuery = Object.entries(queries) as Entries<TQueries>;
  return itemsInQuery.reduce(
    (
      accumulator,
      [key, queryResult],
    ): UseQueryResult<UseMultipleQueryResultsData<TQueries>, Error> => {
      const statuses = [accumulator.status, queryResult.status];
      let status: QueryStatus = 'success';
      if (statuses.includes('error')) {
        status = 'error';
      } else if (statuses.includes('pending')) {
        status = 'pending';
      }
      return {
        ...accumulator,
        data: {
          ...accumulator.data,
          [key]: queryResult.data,
        },
        error: queryResult.error ?? accumulator.error,
        isError: queryResult.isError || accumulator.isError,
        isPending: queryResult.isPending || accumulator.isPending,
        isLoading: queryResult.isLoading || accumulator.isLoading,
        isLoadingError:
          queryResult.isLoadingError || accumulator.isLoadingError,
        isRefetchError:
          queryResult.isRefetchError || accumulator.isRefetchError,
        isSuccess: queryResult.isSuccess || accumulator.isSuccess,
        status,
      } as UseQueryResult<UseMultipleQueryResultsData<TQueries>, Error>;
    },
    {} as UseQueryResult<UseMultipleQueryResultsData<TQueries>, Error>,
  );
};
