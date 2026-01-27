import * as React from 'react';

import { DropdownInput } from '../../common/form/DropdownInput';
import { FormField } from '../../common/form/FormField';

interface Props {
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const LocationTypePicker = (props: Props): React.ReactElement => (
  <FormField
    component={DropdownInput}
    defaultValue={props.defaultValue}
    disabled={props.disabled}
    headerTitle="Select Location Type"
    label="Location type"
    labelField="label"
    name={props.name || 'locationType'}
    testID="picker-location-type"
    valueField="value"
    data={[
      { label: 'Kegerator', value: 'Kegerator' },
      { label: 'Bar', value: 'Bar' },
    ]}
  />
);

export { LocationTypePicker };
