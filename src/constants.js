// @flow

import { Platform } from 'react-native';

export const NULL_STRING_PLACEHOLDER = '–';

// this seems the only working values for FlatList onEndReachedThreshold
// https://github.com/facebook/react-native/issues/16067
export const ON_END_REACHED_THRESHOLD = Platform.OS === 'ios' ? 0 : 0.5;
