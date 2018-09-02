// @flow

import type { Permission, PermissionType } from 'brewskey.js-api';

/* eslint-disable sorting/sort-object-props */
const PERMISSION_RANG_BY_TYPE: { [key: PermissionType]: number } = {
  Administrator: 3,
  Edit: 2,
  Read: 1,
  BannedFromTap: 0,
};
/* eslint-enable sorting/sort-object-props */

export const checkIsAdmin = (permission: ?Permission): boolean =>
  !!permission &&
  PERMISSION_RANG_BY_TYPE[permission.permissionType] ===
    PERMISSION_RANG_BY_TYPE.Administrator;

export const checkCanEdit = (permission: ?Permission): boolean =>
  !!permission &&
  PERMISSION_RANG_BY_TYPE[permission.permissionType] >=
    PERMISSION_RANG_BY_TYPE.Edit;
