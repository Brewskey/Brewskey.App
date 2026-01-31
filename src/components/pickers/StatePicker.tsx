import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';
import { STATE_LIST } from 'components/LocationForm/stateList';

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean | string;
}

const StatePicker = (props: Props): React.ReactElement => (
  <FormField<FieldValues, typeof DropdownInput>
    component={DropdownInput}
    data={STATE_LIST}
    defaultValue={props.defaultValue}
    disable={props.disabled}
    headerTitle="Select State"
    label="State"
    labelField="label"
    name={props.name}
    required={props.required}
    testID={props.testID}
    valueField="value"
  />
);

export { StatePicker };
