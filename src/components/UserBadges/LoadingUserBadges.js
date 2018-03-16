// @flow

import * as React from 'react';
import { View } from 'react-native';
import LoadingIndicator from '../../common/LoadingIndicator';
import { styles as baseStyles } from './LoadedUserBadges';

const LoadingUserBadges = () => (
  <View style={baseStyles.container}>
    <LoadingIndicator />
  </View>
);

export default LoadingUserBadges;
