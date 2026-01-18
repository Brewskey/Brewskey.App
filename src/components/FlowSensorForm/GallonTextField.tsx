import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TYPOGRAPHY } from '../../theme';
import { TextInput, TextInputProps } from '../../common/form/TextInput';
import { FormField } from '../../common/form/FormField';

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
    label="Set custom pulses"
    containerStyle={styles.container}
    labelStyle={styles.textHeading}
    descriptionStyle={styles.textDescription}
    keyboardType="numeric"
    description="Find out number of pulses per gallon for your flow sensor and type it here"
  />
);
