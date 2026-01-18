import type { Beverage, QueryOptions } from '@brewskey/js-api';
import type { PickerValue, RenderRowProps } from './DAOPicker';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import SelectableListItem from '../../common/SelectableListItem';
import { useGetBeverages } from '../../hooks/queries/BeverageQueries';

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Beverage, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Beverage, TMultiple>;
};

function BeveragePicker<TMultiple extends boolean>({
  multiple = false as TMultiple,
  ...props
}: Props<TMultiple>): React.ReactElement {
  const renderRow = ({
    item: beverage,
    isSelected,
    toggleItem,
  }: RenderRowProps<Beverage>): React.ReactElement => (
    <SelectableListItem
      leftAvatar={<BeverageAvatar beverageId={beverage.id} />}
      chevron={false}
      isSelected={isSelected}
      item={beverage}
      subtitle={beverage.beverageType}
      title={beverage.name}
      onPress={() => toggleItem(beverage)}
    />
  );

  return (
    <DAOPicker
      {...props}
      useQueryHook={useGetBeverages}
      headerTitle={`Select Beverage${multiple ? 's' : ''}`}
      label={`Beverage${multiple ? 's' : ''}`}
      multiple={multiple}
      queryOptions={{
        // order by ID so homebrew shows up first
        orderBy: [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        ...props.queryOptions,
      }}
      renderRow={renderRow}
      searchBy="name"
      shouldUseSearchQuery={true}
      stringValueExtractor={(beverage: Beverage): string => beverage.name}
    />
  );
}

export default BeveragePicker;
