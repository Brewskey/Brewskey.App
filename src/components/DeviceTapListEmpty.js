// @flow

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});

type Props = {|
  onAddTapPress: () => void,
|};

const DeviceTapListEmpty = ({ onAddTapPress }: Props): React.Node => (
  <View style={styles.container}>
    <Text style={styles.text}>You don't any taps for this device.</Text>
    <TouchableOpacity onPress={onAddTapPress}>
      <Text style={[styles.text, styles.textLink]}>Click to set one up</Text>
    </TouchableOpacity>
  </View>
);

export default DeviceTapListEmpty;
