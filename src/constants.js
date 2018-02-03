// @flow

import type { DeviceStatus, KegType } from 'brewskey.js-api';

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

export const DESCRIPTION_BY_DEVICE_STATE: { [key: DeviceStatus]: string } = {
  Active:
    'The Brewskey Box is currently in the standard mode.' +
    ' If you have a valve it will be closed and the sensors will' +
    ' track pours normally.',
  Cleaning:
    'Your Brewskey Box is in cleaning mode.' +
    ' After an hour the box will be put into "disabled" mode',
  Free:
    'Your Brewskey Box will open the valve' +
    ' and allow users to pour without authentication.',
  Inactive:
    'Your Brewskey Box is disabled.' +
    ' The valve will not open and pours will not be tracked.',
};
