// @flow

import makeRequestApiStore from './makeRequestApiStore';
import { Platform } from 'react-native';
import {
  checkMultiple,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

const PERMISSION_TYPES = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
];

const REQUEST_API = makeRequestApiStore(() => checkMultiple(PERMISSION_TYPES));

export class LocationPermissionStore {
  static isLoadingPermissions(): boolean {
    return REQUEST_API.get().isLoading();
  }

  static hasLocationPermissions(): boolean {
    return (
      REQUEST_API.get()
        .map((status) =>
          PERMISSION_TYPES.some(
            (permission) => status[permission] === RESULTS.GRANTED,
          ),
        )
        .getValue() || false
    );
  }

  static flushCache(): void {
    REQUEST_API.flushCache();
  }
}
