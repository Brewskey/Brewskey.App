import type { Permission, PermissionType } from '@brewskey/js-api';

const PERMISSION_RANG_BY_TYPE = {
  Administrator: 3,
  Edit: 2,
  Read: 1,
  BannedFromTap: 0,
} as const;

export const checkIsAdmin = (permission?: Permission | null): boolean =>
  !!permission &&
  PERMISSION_RANG_BY_TYPE[permission.permissionType] ===
    PERMISSION_RANG_BY_TYPE.Administrator;

export const checkCanEdit = (permission?: Permission | null): boolean =>
  !!permission &&
  PERMISSION_RANG_BY_TYPE[permission.permissionType] >=
    PERMISSION_RANG_BY_TYPE.Edit;
