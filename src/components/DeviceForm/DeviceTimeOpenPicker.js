// @flow

import * as React from 'react';
import SimplePicker from '../../components/pickers/SimplePicker';

type Props = {|
  error?: string,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
|};

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

const DeviceTimeOpenPicker = (props: Props) => (
  <SimplePicker
    doesRequireConfirmation={false}
    headerTitle="Select Time to Keep Valve Open"
    label="Time to stay in device state (will keep valve open)"
    onChange={props.onChange}
    pickerValues={[
      { label: '1 minute', value: SECONDS_PER_MINUTE },
      { label: '5 minutes', value: 5 * SECONDS_PER_MINUTE },
      { label: '15 minutes', value: 15 * SECONDS_PER_MINUTE },
      { label: '30 minutes', value: 30 * SECONDS_PER_MINUTE },
      { label: '1 Hour', value: 1 * SECONDS_PER_HOUR },
      { label: '2 Hours', value: 2 * SECONDS_PER_HOUR },
      { label: '3 Hours', value: 3 * SECONDS_PER_HOUR },
      { label: '4 Hours', value: 4 * SECONDS_PER_HOUR },
      { label: '5 Hours', value: 5 * SECONDS_PER_HOUR },
      { label: '6 Hours', value: 6 * SECONDS_PER_HOUR },
    ]}
    value={props.value}
  />
);

export default DeviceTimeOpenPicker;
