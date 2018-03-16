// @flow

import * as React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { styles as baseStyles } from './LoadedUserBadges';
import { COLORS } from '../../theme';

const ErrorUserBadges = () => (
  <View style={baseStyles.container}>
    <Icon
      reverse
      reverseColor={COLORS.accent}
      color={COLORS.secondary2}
      name="priority-high"
      size={20}
    />
  </View>
);

export default ErrorUserBadges;
