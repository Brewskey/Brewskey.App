import * as React from 'react';

import { StyleSheet } from 'react-native';

import { FormField } from '../../common/form/FormField';
import { TextInput } from '../../common/form/TextInput';
import { TYPOGRAPHY } from '../../theme';

import type { TextInputProps } from '../../common/form/TextInput';

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  textDescription: { ...TYPOGRAPHY.paragraph, textAlign: 'center' },
  textHeading: { ...TYPOGRAPHY.heading, textAlign: 'center' },
});

export const GallonTextField: React.FC<
  Omit<TextInputProps, 'label' | 'description' | 'keyboardType'>
> = (props): React.ReactElement => (
  <FormField
    component={TextInput}
    {...props}
    containerStyle={styles.container}
    description="Find out number of pulses per gallon for your flow sensor and type it here"
    descriptionStyle={styles.textDescription}
    keyboardType="numeric"
    label="Set custom pulses"
    labelStyle={styles.textHeading}
    testID="input-calibration"
  />
);
