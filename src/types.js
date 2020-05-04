// @flow

import type { EntityID, KegType } from 'brewskey.js-api';
import type { SectionBase } from 'react-native/Libraries/Lists/SectionList';

// no longer works(they made the style internal with ___ prefix):
// import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
// fix when there will be some new solution there:
// https://github.com/flowtype/flow-typed/issues/631
export type Style = any;

export type Section<TEntity> = {|
  data: $ReadOnlyArray<TEntity>,
  key?: string,
  renderItem?: ?(info: {
    item: SectionItemT,
    index: number,
    section: SectionBase<SectionItemT>,
    separators: {
      highlight: () => void,
      unhighlight: () => void,
      updateProps: (select: 'leading' | 'trailing', newProps: Object) => void,
      ...
    },
    ...
  }) => React.Node,
  ItemSeparatorComponent?: ?React.ComponentType<any>,
  keyExtractor?: (item: SectionItemT, index?: ?number) => string,
  title: string,
|};

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
    kegType: KegType,
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

export type NearbyLocation = {|
  id: EntityID,
  name: string,
  summary: ?string,
  taps: Array<NearbyTap>,
|};

export type WifiNetwork = {|
  channel?: number,
  index?: number,
  password?: string,
  security: number,
  ssid: string,
|};
