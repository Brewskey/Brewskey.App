import * as React from 'react';

import { useFormContext } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { SliderInput } from '../../common/form/SliderInput';
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

type Props = Omit<
  React.ComponentProps<typeof SliderInput>,
  'minimumValue' | 'maximumValue'
> & {
  maxOunces: number;
};

const KegLevelSliderField = ({
  maxOunces,
  ...rest
}: Props): React.ReactElement => {
  const { watch } = useFormContext();
  const value: number | undefined = watch(rest.name);
  const numericValue = typeof value === 'number' ? value : 0;
  const ozValue = numericValue === 0 ? 0 : (maxOunces * numericValue) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Is your keg not completely full?</Text>
      <Text style={styles.subtitleText}>
        Here you can manually set the level on your keg.
      </Text>
      <View>
        <SliderInput {...rest} maximumValue={100} minimumValue={0} />
        <View style={styles.sliderLabelContainer}>
          <Text>0%</Text>
          <Text>100%</Text>
        </View>
      </View>
      <Text style={styles.valueText}>
        {numericValue.toFixed(0)}% – {ozValue.toFixed(0)} oz
      </Text>
    </View>
  );
};

export default KegLevelSliderField;
