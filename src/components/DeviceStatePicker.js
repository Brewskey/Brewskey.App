// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PickerField from '../common/PickerField';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

const styles = StyleSheet.create({
  descriptionText: {
    alignItems: 'center',
    marginHorizontal: 13,
    textAlign: 'center',
  },
});

type Props = {|
  error?: ?string,
  onBlur: () => void,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DeviceStatePicker = (props: Props) => (
  <View>
    <PickerField label="Type" {...props}>
      <PickerField.Item label="Active" value="Active" />
      <PickerField.Item label="Cleaning" value="Cleaning" />
      <PickerField.Item label="Free" value="Free" />
      <PickerField.Item label="Inactive" value="Inactive" />
    </PickerField>
    <Text style={styles.descriptionText}>
      {DESCRIPTION_BY_DEVICE_STATE[props.value]}
    </Text>
  </View>
);

export default DeviceStatePicker;
