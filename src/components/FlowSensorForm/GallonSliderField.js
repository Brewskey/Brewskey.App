// @flow

import type { Props as SliderFieldProps } from '../../common/SliderField';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SliderField from '../../common/SliderField';
import { TYPOGRAPHY } from '../../theme';

const BOUNDARIES_PERCENT = 10;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDescription: { ...TYPOGRAPHY.paragraph, textAlign: 'center' },
  textHeading: { ...TYPOGRAPHY.secondary, textAlign: 'center' },
  textSlider: { ...TYPOGRAPHY.secondary },
  textValuePercent: { ...TYPOGRAPHY.secondary, textAlign: 'center' },
  textValuePulses: { ...TYPOGRAPHY.secondary, textAlign: 'center' },
});

type Props = {
  defaultPulses: number,
} & SliderFieldProps;

const GallonSliderField = ({
  defaultPulses,
  onChange,
  value,
  ...rest
}: Props) => {
  const minValue = defaultPulses * (100 - BOUNDARIES_PERCENT) / 100;
  const maxValue = defaultPulses * (100 + BOUNDARIES_PERCENT) / 100;
  const valuePercent = (value - defaultPulses) / defaultPulses * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.textHeading}>Tweak your sensor</Text>
      <Text style={styles.textDescription}>
        You can calibrate your sensor if it's not measuring correctly. Add more
        pulses if your sensor is over-reporting the amount of beer poured
      </Text>
      <View>
        <SliderField
          {...rest}
          maximumValue={maxValue}
          minimumValue={minValue}
          onChange={onChange}
          style={styles.slider}
          value={value}
        />
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.textSlider}>-{BOUNDARIES_PERCENT}%</Text>
          <Text style={styles.textSlider}>+{BOUNDARIES_PERCENT}%</Text>
        </View>
      </View>
      <Text style={styles.textValuePercent}>{valuePercent.toFixed(1)}%</Text>
      <Text style={styles.textValuePulses}>
        {value.toFixed(0)} pulses per gallon
      </Text>
    </View>
  );
};

export default GallonSliderField;
