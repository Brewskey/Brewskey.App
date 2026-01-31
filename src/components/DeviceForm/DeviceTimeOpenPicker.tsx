import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

interface Props {
  name: string;
  testID?: string;
  defaultValue?: number;
  required?: boolean | string;
}

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

const DeviceTimeOpenPicker = (props: Props): React.ReactElement => (
  <FormField<FieldValues, typeof DropdownInput>
    component={DropdownInput}
    defaultValue={props.defaultValue}
    headerTitle="Select Time to Keep Valve Open"
    label="Time to stay in device state (will keep valve open)"
    labelField="label"
    name={props.name}
    required={props.required}
    testID={props.testID}
    valueField="value"
    data={[
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
  />
);

export { DeviceTimeOpenPicker };
