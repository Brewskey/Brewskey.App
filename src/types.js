// @flow

import type { EntityID } from 'brewskey.js-api';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type ViewStyleProp = StyleObj;

// todo make the type annotation
export type Navigation = Object;

export type Coordinates = {|
  latitude: number,
  longitude: number,
|};

export type NearbyTap = {
  CurrentKeg: {
    beverageId: number, // not translated to string
    beverageName: string,
    maxOunces: number,
    ounces: number,
  },
  deviceID: number, // not translated to string
  id: EntityID,
  name: string,
};

export type NearbyLocation = {
  CurrentKeg?: {
    beverageId: string,
    beverageName: string,
  },
  id: EntityID,
  name: string,
  summary: ?string,
  taps: Array<NearbyTap>,
};
