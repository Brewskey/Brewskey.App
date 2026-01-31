import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { FieldValues } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { DropdownInput } from 'common/form/DropdownInput';
import { NULL_STRING_PLACEHOLDER } from '@/constants';
import { useGetLocations } from 'hooks/queries/LocationQueries';
import { COLORS } from 'theme';

import type { Location, QueryOptions, ShortenedEntity } from '@brewskey/js-api';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
  error?: string | null | undefined;
  inputStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  labelStyle?: TextStyle;
  placeholderTextColor?: string;
  queryOptions?: QueryOptions;
  selectionColor?: string;
  underlineColorAndroid?: string;
  validationTextStyle?: TextStyle;
  name: string;
  label?: string;
  defaultValue?: Location | ShortenedEntity;
  required?: boolean | string;
  testID?: string;
}

interface _LocationPickerItemProps {
  item: Location;
  selected?: boolean;
}

const LocationPickerItem = (
  item: Location,
  selected?: boolean,
): React.ReactElement => (
  <View style={styles.itemContainer} testID={`location-item-${item.id}`}>
    <Text style={[styles.nameText, selected && styles.nameTextSelected]}>
      {item.name}
    </Text>
    {item.description && item.description !== NULL_STRING_PLACEHOLDER ? (
      <Text style={styles.descriptionText}>{item.description}</Text>
    ) : null}
  </View>
);

export const LocationPicker = ({
  name,
  label: _label,
  defaultValue,
  required,
  testID,
  ...props
}: Props): React.ReactElement => {
  const onSearchFilter = React.useCallback(
    (searchText: string, baseQueryOptions: QueryOptions) => ({
      ...baseQueryOptions,
      filters: [
        ...(baseQueryOptions.filters || []),
        createFilter('name').contains(searchText),
      ],
    }),
    [],
  );

  return (
    <DropdownInput<FieldValues, Location | ShortenedEntity>
      {...props}
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="Select Location"
      queryOptions={props.queryOptions ?? {}}
      renderItem={LocationPickerItem}
      required={required}
      searchPlaceholder="Search locations..."
      testID={testID}
      useQueryHook={useGetLocations}
      valueField="id"
    />
  );
};

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
