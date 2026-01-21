import type { Beverage, QueryOptions } from '@brewskey/js-api';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DropdownInput } from '../../common/form/DropdownInput';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { useGetBeverages } from '../../hooks/queries/BeverageQueries';
import { COLORS } from '../../theme';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Beverage, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Beverage, TMultiple>;
  // Form integration props
  name: string;
  defaultValue?: PickerValue<Beverage, TMultiple>;
  required?: boolean | string;
};

type BeveragePickerItemProps = {
  item: Beverage;
  selected?: boolean;
};

const BeveragePickerItem = (item: Beverage, selected?: boolean): React.ReactElement => {
  return (
    <View style={styles.itemContainer} testID={`beverage-picker-item-${item.id}`}>
      <View style={styles.avatarContainer}>
        <BeverageAvatar beverageId={item.id} size={45} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.nameText, selected === true && styles.nameTextSelected]}>
          {item.name}
        </Text>
        {item.beverageType && (
          <Text style={styles.typeText}>{item.beverageType}</Text>
        )}
      </View>
    </View>
  );
};

function BeveragePicker<TMultiple extends boolean>({
  multiple = false as TMultiple,
  name = 'beverage',
  defaultValue,
  required,
  ...props
}: Props<TMultiple>): React.ReactElement {

  const queryOptions = React.useMemo(() => ({
    // order by ID so homebrew shows up first
    orderBy: [
      {
        column: 'id',
        direction: 'desc' as const,
      },
    ],
    ...props.queryOptions,
  }), [props.queryOptions]);

  return (
    <DropdownInput<Beverage>
      name={name}
      defaultValue={defaultValue ?? undefined}
      required={required}
      useQueryHook={useGetBeverages}
      queryOptions={queryOptions}
      labelField="name"
      valueField="id"
      multiple={multiple}
      mode="modal"
      headerTitle={`Select Beverage${multiple ? 's' : ''}`}
      confirmSelectItem={true}
      inputVariant="picker"
      search={true}
      searchPlaceholder="Search beverages..."
      shouldUseSearchQuery={true}
      placeholder={`Select Beverage${multiple ? 's' : ''}`}
      onChange={(item) => {
        if (!multiple && !Array.isArray(item)) {
          props.onChange(item as PickerValue<Beverage, TMultiple>);
        } else if (multiple && Array.isArray(item)) {
          props.onChange(item as PickerValue<Beverage, TMultiple>);
        }
      }}
      onConfirmSelectItem={(item) => {
        if (multiple && Array.isArray(item)) {
          props.onChange(item as PickerValue<Beverage, TMultiple>);
        } else if (!multiple && !Array.isArray(item)) {
          props.onChange(item as PickerValue<Beverage, TMultiple>);
        }
      }}
      renderItem={BeveragePickerItem}
      keyExtractor={(item) => String(item.id)}
      testID={`beverage-picker-${name}`}
    />
  );
}

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

export default BeveragePicker;
