import { PermissionDAO } from '@brewskey/js-api';
import { useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type {
  EntityID,
  Permission,
  PermissionEntityKeysType,
} from '@brewskey/js-api';
import type { UseQueryResult } from '@tanstack/react-query';

enum PermissionQueries {
  ByEntityId = 'permission_by_entity_id',
}

export const useGetPermissionForEntityById = (
  permissionEntityType: PermissionEntityKeysType,
  entityID: EntityID | null | undefined,
): UseQueryResult<Permission> =>
  useQuery({
    queryKey: [
      PermissionQueries.ByEntityId,
      permissionEntityType,
      getStringFromEntityID(entityID),
    ],
    queryFn: async () =>
      PermissionDAO.fetchForEntityId(
        permissionEntityType,
        nullthrows(entityID),
      ),
    enabled: !!entityID,
  });
