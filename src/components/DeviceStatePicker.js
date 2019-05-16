// @flow

import * as React from 'react';
import SimplePicker from '../components/pickers/SimplePicker';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

type Props = {|
  error?: string,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const DeviceStatePicker = (props: Props) => (
  <SimplePicker
    description={DESCRIPTION_BY_DEVICE_STATE[props.value]}
    doesRequireConfirmation={false}
    headerTitle="Select State"
    label="State"
    onChange={props.onChange}
    pickerValues={[
      { label: 'Active', value: 'Active' },
      { label: 'Cleaning', value: 'Cleaning' },
      { label: 'Unlocked', value: 'Unlocked' },
      { label: 'Inactive', value: 'Inactive' },
    ]}
    value={props.value}
  />
);

export default DeviceStatePicker;
