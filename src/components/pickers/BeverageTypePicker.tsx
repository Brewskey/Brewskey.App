import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
  required?: boolean | string;
}

const BeverageTypePicker = (props: Props): React.ReactElement => (
  <FormField<FieldValues, typeof DropdownInput>
    component={DropdownInput}
    defaultValue={props.defaultValue}
    headerTitle="Select Beverage Type"
    label="Beverage Type"
    labelField="label"
    name={props.name}
    required={props.required}
    testID={props.testID}
    valueField="value"
    data={[
      { label: 'Beer', value: 'Beer' },
      { label: 'Cider', value: 'Cider' },
      { label: 'Coffee', value: 'Coffee' },
      { label: 'Soda', value: 'Soda' },
    ]}
  />
);

export { BeverageTypePicker };
