// @flow

import * as React from 'react';
import { Slider, StyleSheet, Text, View } from 'react-native';
import { TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitleText: { ...TYPOGRAPHY.paragraph, textAlign: 'center' },
  titleText: { ...TYPOGRAPHY.secondary, textAlign: 'center' },
  valueText: { ...TYPOGRAPHY.heading, textAlign: 'center' },
});

type Props<RNSliderProps> = {|
  ...RNSliderProps,
  maxOunces: number,
  onChange: (value: number) => void,
  value: number,
  // other RNSlider props
|};

const KegLevelSliderField = <RNSliderProps>({
  maxOunces,
  onChange,
  value,
  ...rest
}: Props<RNSliderProps>) => {
  const ozValue = value === 0 ? 0 : (maxOunces * value) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Is your keg not completely full?</Text>
      <Text style={styles.subtitleText}>
        Here you can manually set the level on your keg.
      </Text>
      <View>
        <Slider
          {...rest}
          maximumValue={100}
          minimumValue={0}
          onValueChange={onChange}
          value={value}
        />
        <View style={styles.sliderLabelContainer}>
          <Text>0%</Text>
          <Text>100%</Text>
        </View>
      </View>
      <Text style={styles.valueText}>
        {value.toFixed(0)}% – {ozValue.toFixed(0)} oz
      </Text>
    </View>
  );
};

export default KegLevelSliderField;
