import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { StyleSheet, Text, View } from 'react-native';

import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetOrganizations } from '../../hooks/queries/OrganizationQueries';
import { COLORS } from '../../theme';

import type { Organization, QueryOptions } from '@brewskey/js-api';

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  // Form integration props
  name: string;
  defaultValue?: Organization | null | undefined;
  required?: boolean | string;
}

interface OrganizationPickerItemProps {
  item: Organization;
  selected?: boolean;
}

const OrganizationPickerItem = (
  item: Organization,
  selected?: boolean,
): React.ReactElement => {
  const displayText = `${item.id} - ${item.name}`;

  return (
    <View
      style={styles.itemContainer}
      testID={`organization-picker-item-${item.id}`}
    >
      <Text style={[styles.nameText, selected && styles.nameTextSelected]}>
        {displayText}
      </Text>
    </View>
  );
};

export const OrganizationPicker: React.FC<Props> = ({
  name = 'organization',
  defaultValue,
  required,
  ...props
}) => {
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
    <DropdownInput<Organization>
      {...props}
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onSearchFilter={onSearchFilter}
      placeholder="None"
      queryOptions={props.queryOptions ?? {}}
      renderItem={OrganizationPickerItem}
      required={required}
      searchPlaceholder="Search organizations..."
      testID={`organization-picker-${name}`}
      useQueryHook={useGetOrganizations}
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
});
