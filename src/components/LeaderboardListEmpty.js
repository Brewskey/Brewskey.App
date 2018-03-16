// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingHorizontal: 50,
    paddingVertical: 200,
    textAlign: 'center',
  },
});

const LeaderboardListEmpty = () => (
  <Text style={styles.text}>
    There is nobody on the leaderboard for selected period!
  </Text>
);

export default LeaderboardListEmpty;
