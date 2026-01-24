import type { Location, QueryOptions } from '@brewskey/js-api';
import type { TextStyle, ViewStyle, StyleProp } from 'react-native';

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DropdownInput } from '../../common/form/DropdownInput';
import { NULL_STRING_PLACEHOLDER } from '../../constants';
import { useGetLocations } from '../../hooks/queries/LocationQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { COLORS } from '../../theme';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  inputStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  labelStyle?: TextStyle;
  multiple: TMultiple;
  onChange: (value: PickerValue<Location, TMultiple>) => void;
  placeholderTextColor?: string;
  queryOptions?: QueryOptions;
  selectionColor?: string;
  underlineColorAndroid?: string;
  validationTextStyle?: TextStyle;
  value: PickerValue<Location, TMultiple>;
  // Form integration props
  name: string;
  label?: string;
  defaultValue?: PickerValue<Location, TMultiple>;
  required?: boolean | string;
  testID?: string;
};

type LocationPickerItemProps = {
  item: Location;
  selected?: boolean;
};

const LocationPickerItem = (item: Location, selected?: boolean): React.ReactElement => {
  return (
    <View style={styles.itemContainer} testID={`location-item-${item.id}`}>
      <Text style={[styles.nameText, selected === true && styles.nameTextSelected]}>
        {item.name}
      </Text>
      {item.description && item.description !== NULL_STRING_PLACEHOLDER && (
        <Text style={styles.descriptionText}>{item.description}</Text>
      )}
    </View>
  );
};

function LocationPicker<TMultiple extends boolean>({
  multiple = false as TMultiple,
  name = 'location',
  label,
  defaultValue,
  required,
  testID,
  ...props
}: Props<TMultiple>): React.ReactElement {

  const onSearchFilter = React.useCallback((searchText: string, baseQueryOptions: QueryOptions) => {
    return {
      ...baseQueryOptions,
      filters: [
        ...(baseQueryOptions.filters || []),
        createFilter('name').contains(searchText),
      ],
    };
  }, []);

  // Generate testID from label prop (from FormField) or fallback to testID prop or default
  const pickerTestID = testID ?? (label ? `picker-${label.toLowerCase().replace(/\s+/g, '-')}` : `location-picker-${name}`);

  return (
    <DropdownInput<Location>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetLocations}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={multiple}
      
      headerTitle={`Select Location${multiple ? 's' : ''}`}
      confirmSelectItem={false}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search locations..."
      placeholder={`Select Location${multiple ? 's' : ''}`}
      onChange={(item) => {
        if (!multiple && !Array.isArray(item)) {
          props.onChange(item as PickerValue<Location, TMultiple>);
        } else if (multiple && Array.isArray(item)) {
          props.onChange(item as PickerValue<Location, TMultiple>);
        }
      }}
      renderItem={LocationPickerItem}
      keyExtractor={(item) => String(item.id)}
      testID={pickerTestID}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
  },
  nameText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'normal',
  },
  nameTextSelected: {
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textFaded,
    marginTop: 4,
  },
});

export default LocationPicker;
