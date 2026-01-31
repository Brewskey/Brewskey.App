import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

interface SquareLocation {
  name: string;
  locationID: string;
}

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
  disabled?: boolean;
  squareLocations: SquareLocation[];
}

const SquareLocationPicker = (props: Props): React.ReactElement => {
  const pickerValues = props.squareLocations.map((item) => ({
    label: item.name,
    value: item.locationID,
  }));

  return (
    <FormField<FieldValues, typeof DropdownInput>
      component={DropdownInput}
      data={pickerValues}
      defaultValue={props.defaultValue}
      disable={props.disabled}
      headerTitle="Select Square Location"
      label="Square Location"
      labelField="label"
      name={props.name}
      testID={props.testID}
      valueField="value"
    />
  );
};

export { SquareLocationPicker };
