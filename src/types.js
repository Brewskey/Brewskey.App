// @flow

import type { EntityID } from 'brewskey.js-api';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type { SectionBase } from 'react-native/Libraries/Lists/SectionList';

export type Style = StyleObj;

export type Section<TEntity> = { title: string } & SectionBase<TEntity>;

// todo make the type annotation
export type Navigation = Object;

export type Coordinates = {|
  latitude: number,
  longitude: number,
|};

export type NearbyTap = {
  currentKeg: {
    beverageId: number, // not translated to string
    beverageName: string,
    maxOunces: number,
    ounces: number,
  },
  device: {
    id: number, // not translated to string
    name: string,
  },
  id: EntityID,
  name: string,
  tapNumber: number,
};

export type NearbyLocation = {
  id: EntityID,
  name: string,
  summary: ?string,
  taps: Array<NearbyTap>,
};

export type WifiNetwork = {
  channel?: number,
  index?: number,
  password?: string,
  security: number,
  ssid: string,
};
