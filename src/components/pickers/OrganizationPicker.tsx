import type { QueryOptions, Organization } from '@brewskey/js-api';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetOrganizations } from '../../hooks/queries/OrganizationQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { COLORS } from '../../theme';

type Props = {
  error?: string | null | undefined;
  onChange: (value?: Organization | null | undefined) => void;
  queryOptions?: QueryOptions;
  value: Organization | null | undefined;
  // Form integration props
  name: string;
  defaultValue?: Organization | null | undefined;
  required?: boolean | string;
};

type OrganizationPickerItemProps = {
  item: Organization;
  selected?: boolean;
};

const OrganizationPickerItem = (item: Organization, selected?: boolean): React.ReactElement => {
  const displayText = `${item.id} - ${item.name}`;

  return (
    <View style={styles.itemContainer} testID={`organization-picker-item-${item.id}`}>
      <Text style={[styles.nameText, selected === true && styles.nameTextSelected]}>
        {displayText}
      </Text>
    </View>
  );
};

const OrganizationPicker: React.FC<Props> = ({
  name = 'organization',
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
    <DropdownInput<Organization>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetOrganizations}
      queryOptions={props.queryOptions ?? {}}
      onSearchFilter={onSearchFilter}
      labelField="name"
      valueField="id"
      multiple={false}
      mode="default"
      confirmSelectItem={false}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search organizations..."
      placeholder="None"
      onChange={(item) => {
        if (!Array.isArray(item)) {
          props.onChange(item as Organization | null);
        }
      }}
      renderItem={OrganizationPickerItem}
      keyExtractor={(item) => String(item.id)}
      testID={`organization-picker-${name}`}
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

export default OrganizationPicker;
