// @flow

import type { Props as TextFieldProps } from '../TextField';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextField from '../TextField';
import { TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  textDescription: { ...TYPOGRAPHY.paragraph, textAlign: 'center' },
  textHeading: { ...TYPOGRAPHY.heading, textAlign: 'center' },
});

const GallonTextField = (props: TextFieldProps): React.Node => (
  <View style={styles.container}>
    <Text style={styles.textHeading}>Set custom pulses</Text>
    <TextField {...props} keyboardType="numeric" />
    <Text style={styles.textDescription}>
      Find out number of pulses per gallon for your flow sensor and type it here
    </Text>
  </View>
);

export default GallonTextField;
