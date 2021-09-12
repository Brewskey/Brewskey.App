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

const REQUEST_API = makeRequestApiStore(async () => {
  const result = await checkMultiple(PERMISSION_TYPES);
  console.log(result);
  return result;
});

class PermissionStore {
  @computed
  get isLoadingPermissions(): boolean {
    return REQUEST_API.get().isLoading();
  }

  @computed
  get hasLocationPermissions(): boolean {
    const result = (
      REQUEST_API.get()
        .map((status) => {
          return PERMISSION_TYPES.some(
            (permission) => status[permission] === RESULTS.GRANTED,
          );
        })
        .getValue() || false
    );
    return result;
  }

  getLocationPermissions: () => Promise<$Values<typeof RESULTS>> = async () => {
    return await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );
  }

  @action
  flushCache(): void {
    REQUEST_API.flushCache();
    REQUEST_API.get();
  }
}

export default new PermissionStore();
