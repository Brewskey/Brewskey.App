import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { styles as baseStyles } from './UserBadgesStyles';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

const EmptyUserBadges = () => (
  <View style={baseStyles.container}>
    <Text style={styles.text}>No badges</Text>
  </View>
);

export { EmptyUserBadges };
