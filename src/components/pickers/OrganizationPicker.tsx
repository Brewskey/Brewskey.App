import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { FieldValues } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { DropdownInput } from 'common/form/DropdownInput';
import { useGetOrganizations } from 'hooks/queries/OrganizationQueries';
import { COLORS } from 'theme';

import type {
  Organization,
  QueryOptions,
  ShortenedEntity,
} from '@brewskey/js-api';

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  // Form integration props
  name: string;
  testID?: string;
  defaultValue?: Organization | ShortenedEntity | null | undefined;
  required?: boolean | string;
  onChange?: (organization: Organization | ShortenedEntity | null) => void;
}

const OrganizationPickerItem = ({
  item,
  selected,
  testID,
}: {
  item: Organization;
  selected?: boolean;
  testID?: string;
}): React.ReactElement => {
  const displayText = `${item.id} - ${item.name}`;

  return (
    <View
      style={styles.itemContainer}
      testID={`${testID ?? 'organization-picker'}-item-${item.id}`}
    >
      <Text style={[styles.nameText, selected && styles.nameTextSelected]}>
        {displayText}
      </Text>
    </View>
  );
};

export const OrganizationPicker: React.FC<Props> = ({
  name,
  testID,
  defaultValue,
  required,
  onChange,
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
    <DropdownInput<FieldValues, Organization | ShortenedEntity>
      {...props}
      search
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      onChange={onChange}
      onSearchFilter={onSearchFilter}
      placeholder="None"
      queryOptions={props.queryOptions ?? {}}
      renderItem={(item, selected) => (
        <OrganizationPickerItem
          item={item}
          selected={selected}
          testID={testID}
        />
      )}
      required={required}
      searchPlaceholder="Search organizations..."
      testID={testID}
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
