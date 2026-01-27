import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { BeverageAvatar } from '../../common/avatars/BeverageAvatar';
import { DropdownInput } from '../../common/form/DropdownInput';
import { useGetBeverages } from '../../hooks/queries/BeverageQueries';
import { COLORS } from '../../theme';

import type { Beverage, QueryOptions, ShortenedEntity } from '@brewskey/js-api';

export type PickerValue<T> = T | null | undefined;

interface Props {
  error?: string | null | undefined;
  queryOptions?: QueryOptions;
  name: string;
  defaultValue?: PickerValue<Beverage | ShortenedEntity>;
  required?: boolean | string;
  testID?: string;
}

interface BeveragePickerItemProps {
  item: Beverage;
  selected?: boolean;
}

export const BeveragePickerItem = (
  item: Beverage,
  selected?: boolean,
): React.ReactElement => (
  <View style={styles.itemContainer}>
    <View style={styles.avatarContainer}>
      <BeverageAvatar beverageId={item.id} size={45} testID="beverage-avatar" />
    </View>
    <View style={styles.contentContainer}>
      <Text style={[styles.nameText, selected && styles.nameTextSelected]}>
        {item.name}
      </Text>
      {item.beverageType ? (
        <Text style={styles.typeText}>{item.beverageType}</Text>
      ) : null}
    </View>
  </View>
);

export const BeveragePicker = ({
  name = 'beverage',
  defaultValue,
  required,
  testID,
  ...props
}: Props): React.ReactElement => {
  const queryOptions = React.useMemo(
    () => ({
      orderBy: [{ column: 'id', direction: 'desc' as const }],
      ...props.queryOptions,
    }),
    [props.queryOptions],
  );

  return (
    <DropdownInput<Beverage | ShortenedEntity>
      {...props}
      search
      shouldUseSearchQuery
      confirmSelectItem={false}
      defaultValue={defaultValue ?? undefined}
      labelField="name"
      name={name}
      placeholder="Select Beverage"
      queryOptions={queryOptions}
      renderItem={BeveragePickerItem}
      required={required}
      searchPlaceholder="Search beverages..."
      testID={testID}
      useQueryHook={useGetBeverages}
      valueField="id"
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    flexShrink: 0,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'normal',
  },
  nameTextSelected: {
    fontWeight: 'bold',
  },
  typeText: {
    fontSize: 14,
    color: COLORS.textFaded,
    marginTop: 4,
  },
});
