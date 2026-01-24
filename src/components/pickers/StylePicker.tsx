import type { Style, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetStyles } from '../../hooks/queries/StyleQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { COLORS } from '../../theme';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props = {
  error?: string | null | undefined;
  onChange: (value: PickerValue<Style, false>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Style, false>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Style, false>;
  required?: boolean | string;
};

const StylePicker: React.FC<Props> = ({
  name = 'style',
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
    <DropdownInput<Style>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetStyles}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={false}
      
      headerTitle="Select Style"
      confirmSelectItem={false}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search styles..."
      placeholder="Select Style"
      onChange={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Style);
        }
      }}
      keyExtractor={(item) => String(item.id)}
      testID={`style-picker-${name}`}
    />
  );
};

export default StylePicker;
