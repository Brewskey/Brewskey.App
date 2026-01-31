import { OrganizationDAO } from '@brewskey/js-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, Organization, QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum OrganizationQueryKeys {
  OrganizationById = 'organization_by_id',
  Organizations = 'organizations',
  SquareLocations = 'square_locations',
}

export const useGetOrganizationById = (
  id: EntityID | undefined,
): UseQueryResult<Organization> =>
  useQuery({
    queryKey: [
      OrganizationQueryKeys.OrganizationById,
      getStringFromEntityID(id),
    ],
    queryFn: async () => OrganizationDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetOrganizations = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Organization[]>> =>
  useInfiniteQuery({
    queryKey: [OrganizationQueryKeys.Organizations, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      OrganizationDAO.fetchMany({
        ...queryOptions,
        orderBy: queryOptions?.orderBy ?? [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        skip: pageParam * 20,
        take: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useGetSquareLocations = (
  organizationId: EntityID | undefined | null,
): UseQueryResult<
  {
    locationID: string;
    name: string;
  }[]
> => {
  const { data: organization } = useGetOrganizationById(
    organizationId ?? undefined,
  );

  return useQuery({
    queryKey: [
      OrganizationQueryKeys.SquareLocations,
      getStringFromEntityID(organizationId),
    ],
    queryFn: async () =>
      OrganizationDAO.fetchSquareLocations(nullthrows(organizationId)),
    enabled:
      organizationId != null && (organization?.canEnablePayments ?? false),
  });
};
