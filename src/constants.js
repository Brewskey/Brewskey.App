// @flow

import type { KegType } from 'brewskey.js-api';

import { Platform } from 'react-native';

export const NULL_STRING_PLACEHOLDER = '–';

// this seems the only working values for FlatList onEndReachedThreshold
// https://github.com/facebook/react-native/issues/16067
export const ON_END_REACHED_THRESHOLD = Platform.OS === 'ios' ? 0 : 0.5;

export const KEG_NAME_BY_KEG_TYPE: { [KegType]: string } = {
  Cornelius: 'Cornelius Keg',
  HalfBarrel: 'Half Barrel Keg',
  Mini: 'Mini Keg',
  QuarterBarrel: 'Quarter Barrel Keg',
  SixthBarrel: 'Sixth Barrel Keg',
  SlimQuarter: 'Slim Quarter Keg',
};
