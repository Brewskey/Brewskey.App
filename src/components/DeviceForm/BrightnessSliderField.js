// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import FormLabel from '../../common/form/FormLabel';
import { COLORS, TYPOGRAPHY } from '../../theme';

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

type Props<RNSliderProps> = {|
  ...RNSliderProps,
  onChange: (value: number) => void,
  value: number,
  // other RNSlider props
|};

const BrightnessSliderField = <RNSliderProps>({
  onChange,
  value,
  ...rest
}: Props<RNSliderProps>): React.Node => (
  <View>
    <FormLabel>LED Brightness</FormLabel>
    <View style={styles.container}>
      <Slider
        {...rest}
        maximumValue={255}
        minimumValue={0}
        onValueChange={onChange}
        value={value}
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

export default BrightnessSliderField;
