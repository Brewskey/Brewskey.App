import { AccountDAO } from '@brewskey/js-api';
import { useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { Account, EntityID } from '@brewskey/js-api';
import type { UseQueryResult } from '@tanstack/react-query';

export enum AccountQueryKeys {
  AccountById = 'account_by_id',
}

export const useGetAccountById = (
  id: EntityID | undefined | null,
): UseQueryResult<Account> =>
  useQuery({
    queryKey: [AccountQueryKeys.AccountById, getStringFromEntityID(id)],
    queryFn: async () => AccountDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });
