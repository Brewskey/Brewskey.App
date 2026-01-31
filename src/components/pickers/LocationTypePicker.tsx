import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean | string;
}

const LocationTypePicker = (props: Props): React.ReactElement => (
  <FormField<FieldValues, typeof DropdownInput>
    component={DropdownInput}
    defaultValue={props.defaultValue}
    disable={props.disabled}
    headerTitle="Select Location Type"
    label="Location type"
    labelField="label"
    name={props.name}
    required={props.required}
    testID={props.testID}
    valueField="value"
    data={[
      { label: 'Kegerator', value: 'Kegerator' },
      { label: 'Bar', value: 'Bar' },
    ]}
  />
);

export { LocationTypePicker };
