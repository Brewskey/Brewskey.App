// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PickerField from '../common/PickerField';

const styles = StyleSheet.create({
  descriptionText: {
    alignItems: 'center',
    marginHorizontal: 13,
    textAlign: 'center',
  },
});

const DEVICE_STATUS_DESCRIPTION = {
  Active:
    'The Brewskey Box is currently in the standard mode.' +
    ' If you have a valve it will be closed and the sensors will' +
    ' track pours normally.',
  Cleaning:
    'Your Brewskey Box is in cleaning mode.' +
    ' After an hour the box will be put into "disabled" mode',
  Free:
    'Your Brewskey Box will open the valve' +
    ' and allow users to pour without authentication.',
  Inactive:
    'Your Brewskey Box is disabled.' +
    ' The valve will not open and pours will not be tracked.',
};

type Props = {|
  error?: ?string,
  onBlur: () => void,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DeviceStatusPicker = (props: Props) => (
  <View>
    <PickerField label="Type" {...props}>
      <PickerField.Item label="Active" value="Active" />
      <PickerField.Item label="Cleaning" value="Cleaning" />
      <PickerField.Item label="Free" value="Free" />
      <PickerField.Item label="Inactive" value="Inactive" />
    </PickerField>
    <Text style={styles.descriptionText}>
      {DEVICE_STATUS_DESCRIPTION[props.value]}
    </Text>
  </View>
);

export default DeviceStatusPicker;
