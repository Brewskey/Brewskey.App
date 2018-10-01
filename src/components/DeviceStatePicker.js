// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SimplePicker from '../components/pickers/SimplePicker';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

const styles = StyleSheet.create({
  descriptionText: {
    alignItems: 'center',
    marginHorizontal: 13,
    textAlign: 'center',
  },
});

type Props = {|
  error?: string,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DeviceStatePicker = (props: Props) => (
  <View>
    <SimplePicker
      headerTitle="Select State"
      label="State"
      onChange={props.onChange}
      pickerValues={[
        { label: 'Active', value: 'Active' },
        { label: 'Cleaning', value: 'Cleaning' },
        { label: 'Unlocked', value: 'Unlocked' },
        { label: 'Incative', value: 'Incative' },
      ]}
      value={props.value}
    />
    <Text style={styles.descriptionText}>
      {DESCRIPTION_BY_DEVICE_STATE[props.value]}
    </Text>
  </View>
);

export default DeviceStatePicker;
