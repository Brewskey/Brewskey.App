import type { Availability, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetAvailabilities } from '../../hooks/queries/AvailabilityQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Availability, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Availability, false>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Availability, false>;
  required?: boolean | string;
};

const AvailabilityPicker: React.FC<Props> = ({
  name = 'availability',
  defaultValue,
  required,
  ...props
}) => {

  const onSearchFilter = React.useCallback((searchText: string, baseQueryOptions: QueryOptions) => {
    return {
      ...baseQueryOptions,
      filters: [
        ...(baseQueryOptions.filters || []),
        createFilter('name').contains(searchText),
      ],
    };
  }, []);

  return (
    <DropdownInput<Availability>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetAvailabilities}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={false}
      mode="modal"
      headerTitle="Select Availability"
      confirmSelectItem={true}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search availability..."
      placeholder="Select Availability"
      onChange={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Availability);
        }
      }}
      onConfirmSelectItem={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Availability);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      testID={`availability-picker-${name}`}
    />
  );
};

export default AvailabilityPicker;
