import * as React from 'react';
import { SimplePicker } from '../components/pickers/SimplePicker';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

type Props = {
  error?: string,
  onChange: (value?: string) => void,
  placeholder?: string,
  value: string | undefined
};

const DeviceStatePicker = (props: Props): React.ReactElement => <SimplePicker
  description={props.value ? DESCRIPTION_BY_DEVICE_STATE[props.value as keyof typeof DESCRIPTION_BY_DEVICE_STATE] : undefined}
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
/>;

export default DeviceStatePicker;
