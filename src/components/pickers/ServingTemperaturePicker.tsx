import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
}

const ServingTemperaturePicker = (props: Props): React.ReactElement => (
  <FormField<FieldValues, typeof DropdownInput>
    component={DropdownInput}
    defaultValue={props.defaultValue}
    headerTitle="Select Serving Temperature"
    label="Serving temperature"
    labelField="label"
    name={props.name}
    testID={props.testID}
    valueField="value"
    data={[
      { label: 'Cellar', value: 'cellar' },
      { label: 'Very Cold', value: 'very_cold' },
      { label: 'Cold', value: 'cold' },
      { label: 'Cool', value: 'cool' },
      { label: 'Warm', value: 'warm' },
      { label: 'Hot', value: 'hot' },
    ]}
  />
);

export { ServingTemperaturePicker };
