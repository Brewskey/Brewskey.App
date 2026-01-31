import * as React from 'react';

import { useWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { SliderInput } from 'common/form/SliderInput';
import { TYPOGRAPHY } from 'theme';

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

interface Props {
  defaultPulses: number;
  name: string;
}

const GallonSliderField = ({
  defaultPulses,
  name,
}: Props): React.ReactElement => {
  const values = useWatch();
  const value = (values[name] as number) ?? 0;
  const minValue = (defaultPulses * (100 - BOUNDARIES_PERCENT)) / 100;
  const maxValue = (defaultPulses * (100 + BOUNDARIES_PERCENT)) / 100;
  const valuePercent =
    (((values[name] ?? 0) - defaultPulses) / defaultPulses) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.textHeading}>Tweak your sensor</Text>
      <Text style={styles.textDescription}>
        You can calibrate your sensor if it&apos;s not measuring correctly. Add
        more pulses if your sensor is over-reporting the amount of beer poured
      </Text>
      <View>
        <SliderInput
          maximumValue={maxValue}
          minimumValue={minValue}
          name={name}
          testID="pulses-per-gallon-slider"
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

export { GallonSliderField };
