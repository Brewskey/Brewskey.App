import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Account, AccountDAO, EntityID } from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum AccountQueryKeys {
  AccountById = 'account_by_id',
}

export const useGetAccountById = (
  id: EntityID | undefined | null,
): UseQueryResult<Account, Error> =>
  useQuery({
    queryKey: [AccountQueryKeys.AccountById, id],
    queryFn: () => AccountDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });
