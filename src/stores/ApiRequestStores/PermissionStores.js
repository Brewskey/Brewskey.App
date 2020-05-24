// @flow

import makeRequestApiStore from './makeRequestApiStore';
import { Platform } from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import { action, computed } from 'mobx';

const PERMISSION_TYPES = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
];

const REQUEST_API = makeRequestApiStore(() =>
  checkMultiple(PERMISSION_TYPES).then((r) => {
    console.log('PERMISSION_TYPES', r);
    return r;
  }),
);

class PermissionStore {
  @computed
  get isLoadingPermissions(): boolean {
    return REQUEST_API.get().isLoading();
  }

  @computed
  get hasLocationPermissions(): boolean {
    const result =
      REQUEST_API.get()
        .map((status) => {
          console.log('STATUS', status);
          return PERMISSION_TYPES.some(
            (permission) => status[permission] === RESULTS.GRANTED,
          );
        })
        .getValue() || false;
    console.log(result);
    return result;
  }

  @action
  flushCache(): void {
    REQUEST_API.flushCache();
  }
}

export default new PermissionStore();
