import * as React from 'react';

import { DropdownInput } from '../../common/form/DropdownInput';
import { FormField } from '../../common/form/FormField';
import { STATE_LIST } from '../LocationForm/stateList';

interface Props {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const StatePicker = (props: Props): React.ReactElement => (
  <FormField
    component={DropdownInput}
    data={STATE_LIST}
    defaultValue={props.defaultValue}
    disabled={props.disabled}
    headerTitle="Select State"
    label="State"
    labelField="label"
    name={props.name || 'state'}
    testID="picker-state"
    valueField="value"
  />
);

export { StatePicker };
