import * as React from 'react';

import { FieldValues } from 'react-hook-form';

import { DropdownInput } from 'common/form/DropdownInput';
import { FormField } from 'common/form/FormField';

const YEARS_RANGE_LENGTH = 10;

interface Props {
  name: string;
  testID?: string;
  defaultValue?: string;
}

const YearPicker = (props: Props): React.ReactElement => {
  const currentYear = new Date().getFullYear();
  const yearsRange = [...Array(YEARS_RANGE_LENGTH)]
    .map(
      (_value: null, index: number): number =>
        currentYear - YEARS_RANGE_LENGTH + index + 1,
    )
    .reverse();

  const pickerValues = yearsRange.map((year: number) => ({
    label: year.toString(),
    value: year.toString(),
  }));

  return (
    <FormField<FieldValues, typeof DropdownInput>
      component={DropdownInput}
      data={pickerValues}
      defaultValue={props.defaultValue}
      headerTitle="Select Year"
      label="Year"
      labelField="label"
      name={props.name}
      testID={props.testID}
      valueField="value"
    />
  );
};

export { YearPicker };
