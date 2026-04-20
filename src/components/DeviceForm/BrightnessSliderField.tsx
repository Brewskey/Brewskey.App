import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { SliderInput } from 'common/form/SliderInput';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { FieldValues } from 'react-hook-form';

import type { SliderInputProps } from 'common/form/SliderInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitleText: { ...TYPOGRAPHY.small, color: COLORS.textFaded, marginTop: 8 },
});

type Props<TFormFields extends FieldValues> = Omit<
  SliderInputProps<TFormFields>,
  'minimumValue' | 'maximumValue' | 'step'
>;

const BrightnessSliderField = <TFormFields extends FieldValues>(
  props: Props<TFormFields>,
): React.ReactElement => {
  const { testID } = props;

  return (
    <View testID={testID}>
      <View style={styles.container}>
        <SliderInput<TFormFields>
          {...props}
          maximumValue={255}
          minimumValue={0}
          step={1}
        />
        <View style={styles.sliderLabelContainer}>
          <Text>0%</Text>
          <Text>100%</Text>
        </View>
        <Text style={styles.subtitleText}>
          You can change the brightness of the LED ring on your Brewskey box.
        </Text>
      </View>
    </View>
  );
};

export { BrightnessSliderField };
