import * as React from 'react';

import { DropdownInput } from '../../common/form/DropdownInput';
import { FormField } from '../../common/form/FormField';

interface Props {
  name?: string;
  defaultValue?: string;
  required?: boolean | string;
}

const BeverageTypePicker = (props: Props): React.ReactElement => (
  <FormField
    component={DropdownInput}
    defaultValue={props.defaultValue}
    headerTitle="Select Beverage Type"
    label="Beverage Type"
    labelField="label"
    name={props.name || 'beverageType'}
    required={props.required}
    testID={`picker-${props.name || 'beverageType'}`}
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
