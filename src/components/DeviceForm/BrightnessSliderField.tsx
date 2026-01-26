import * as React from 'react';

import { Slider } from '@rneui/themed';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { FormLabel } from '../../common/form/FormLabel';
import { COLORS, TYPOGRAPHY } from '../../theme';

import type { SliderProps as RNEUISliderProps } from '@rneui/themed';

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

type Props = RNEUISliderProps & {
  name: string;
  testID?: string;
};

const BrightnessSliderField = ({
  name,
  testID,
  ...rest
}: Props): React.ReactElement => {
  const { control } = useFormContext();

  return (
    <View testID={testID}>
      <View style={styles.container}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Slider
              {...rest}
              maximumValue={255}
              minimumValue={0}
              onValueChange={onChange}
              step={1}
              value={value}
            />
          )}
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

export default BrightnessSliderField;
