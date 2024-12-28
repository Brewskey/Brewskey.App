import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  EntityID,
  Permission,
  PermissionDAO,
  PermissionEntityType,
} from '@brewskey/js-api';

enum PermissionQueries {
  ByEntityId = 'permission_by_entity_id',
}

export const useGetPermissionForEntityById = (
  permissionEntityType: PermissionEntityType,
  entityID: EntityID,
): UseQueryResult<Permission, Error> =>
  useQuery({
    queryKey: [PermissionQueries.ByEntityId, permissionEntityType, entityID],
    queryFn: () =>
      PermissionDAO.fetchForEntityId(permissionEntityType, entityID),
  });
