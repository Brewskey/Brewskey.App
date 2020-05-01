// @flow
import makeRequestApiStore from './makeRequestApiStore';
import Permissions from 'react-native-permissions';

export type LocationPermissionStatus =
  | 'authorized'
  | 'denied'
  | 'restricted'
  | 'undetermined';

export const LOCATION_PERMISSION_STATUSES: {
  [key: string]: LocationPermissionStatus,
} = {
  AUTHORIZED: 'authorized',
  DENIED: 'denied',
  RESTRICTED: 'restricted',
  UNDETERMINED: 'undetermined',
};

export const createLocationPermissionStore = () =>
  makeRequestApiStore<LocationPermissionStatus>(() =>
    Permissions.request('location'),
  );

export const LocationPermissionStore = createLocationPermissionStore();
