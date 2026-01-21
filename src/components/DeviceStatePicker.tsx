import * as React from 'react';
import { SimplePicker } from '../components/pickers';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';

type Props = {
  error?: string,
  onChange: (value?: string) => void,
  placeholder?: string,
  value: string | undefined,
  name?: string;
  label?: string;
  defaultValue?: string;
  required?: boolean | string;
};

const DeviceStatePicker = (props: Props): React.ReactElement => <SimplePicker
  description={props.value ? DESCRIPTION_BY_DEVICE_STATE[props.value as keyof typeof DESCRIPTION_BY_DEVICE_STATE] : undefined}
  doesRequireConfirmation={false}
  headerTitle="Select State"
  label={props.label || "State"}
  name={props.name || 'deviceStatus'}
  onChange={props.onChange}
  pickerValues={[
    { label: 'Active', value: 'Active' },
    { label: 'Cleaning', value: 'Cleaning' },
    { label: 'Unlocked', value: 'Unlocked' },
    { label: 'Inactive', value: 'Inactive' },
  ]}
  value={props.value}
  defaultValue={props.defaultValue}
  required={props.required}
/>;

export default DeviceStatePicker;
