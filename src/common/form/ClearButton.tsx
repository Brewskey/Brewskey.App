import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { COLORS } from '../../theme';

import type { GestureResponderEvent } from 'react-native';

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 16, color: COLORS.textFaded },
});

interface Props {
  onPress: (event: GestureResponderEvent) => void;
  testID?: string;
}

export const ClearButton: React.FC<Props> = ({ onPress, testID }) => (
  <TouchableOpacity onPress={onPress} style={styles.button} testID={testID}>
    <Text style={styles.icon}>×</Text>
  </TouchableOpacity>
);
