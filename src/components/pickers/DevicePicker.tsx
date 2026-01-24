import type { Device, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { Platform } from 'react-native';
import { DropdownInput } from '../../common/form/DropdownInput';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetDevices } from '../../hooks/queries/DeviceQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Device, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Device, TMultiple>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Device, TMultiple>;
  required?: boolean | string;
};

function DevicePicker2<TMultiple extends boolean>({
  multiple = false as TMultiple,
  name = 'device',
  defaultValue,
  required,
  ...props
}: Props<TMultiple>): React.ReactElement {
  const renderItem = React.useCallback((item: Device, selected?: boolean) => {
    const isSelected = selected ?? false;
    if (Platform.OS === 'web') {
      return (
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 16, color: '#43484d', fontWeight: isSelected ? 'bold' : 'normal' }}>
            {item.name}
          </div>
        </div>
      );
    }

    // For native, use SelectableListItem
    return (
      <SelectableListItem
        chevron={false}
        isSelected={isSelected}
        item={item}
        title={item.name}
        onPress={() => { }}
      />
    );
  }, []);

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
    <DropdownInput<Device>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetDevices}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={multiple}
      
      headerTitle={`Select Brewskey Box${multiple ? 'es' : ''}`}
      confirmSelectItem={false}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search devices..."
      placeholder={`Select Brewskey box${multiple ? 'es' : ''}`}
      onChange={(item) => {
        if (!multiple && !Array.isArray(item)) {
          props.onChange(item as PickerValue<Device, TMultiple>);
        } else if (multiple && Array.isArray(item)) {
          props.onChange(item as PickerValue<Device, TMultiple>);
        }
      }}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      testID={`device-picker-${name}`}
    />
  );
}

export default DevicePicker2;
