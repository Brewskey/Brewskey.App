import type { Glass, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetGlasses } from '../../hooks/queries/GlassQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Glass, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Glass, false>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Glass, false>;
  required?: boolean | string;
};

const GlassPicker: React.FC<Props> = ({
  name = 'glass',
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
    <DropdownInput<Glass>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetGlasses}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={false}
      mode="modal"
      headerTitle="Select Glass"
      confirmSelectItem={true}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search glasses..."
      placeholder="Select Glass"
      onChange={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Glass);
        }
      }}
      onConfirmSelectItem={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Glass);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      testID={`glass-picker-${name}`}
    />
  );
};

export default GlassPicker;
