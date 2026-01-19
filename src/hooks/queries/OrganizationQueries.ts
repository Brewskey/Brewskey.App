import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  EntityID,
  Organization,
  OrganizationDAO,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum OrganizationQueryKeys {
  OrganizationById = 'organization_by_id',
  Organizations = 'organizations',
  SquareLocations = 'square_locations',
}

export const useGetOrganizationById = (
  id: EntityID | undefined,
): UseQueryResult<Organization, Error> =>
  useQuery({
    queryKey: [OrganizationQueryKeys.OrganizationById, id],
    queryFn: () => OrganizationDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetOrganizations = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Organization[]>, Error> =>
  useInfiniteQuery({
    queryKey: [OrganizationQueryKeys.Organizations, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
  }[],
  Error
> => {
  const { data: organization } = useGetOrganizationById(organizationId ?? undefined);

  return useQuery({
    queryKey: [OrganizationQueryKeys.SquareLocations, organizationId],
    queryFn: () => OrganizationDAO.fetchSquareLocations(nullthrows(organizationId)),
    enabled: organizationId != null && (organization?.canEnablePayments ?? false),
  });
};
