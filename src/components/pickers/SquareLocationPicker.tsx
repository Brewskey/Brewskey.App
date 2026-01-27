import * as React from 'react';

import { DropdownInput } from '../../common/form/DropdownInput';
import { FormField } from '../../common/form/FormField';

interface SquareLocation {
  name: string;
  locationID: string;
}

interface Props {
  name?: string;
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
    <FormField
      component={DropdownInput}
      data={pickerValues}
      defaultValue={props.defaultValue}
      disabled={props.disabled}
      headerTitle="Select Square Location"
      label="Square Location"
      labelField="label"
      name={props.name || 'squareLocationID'}
      testID={`picker-${props.name || 'squareLocationID'}`}
      valueField="value"
    />
  );
};

export { SquareLocationPicker };
