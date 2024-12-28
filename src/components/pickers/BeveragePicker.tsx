import type { Beverage, QueryOptions } from '@brewskey/js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { BeverageStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Beverage, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Beverage, TMultiple>;
};

class BeveragePicker<TMultiple extends boolean> extends React.Component<
  Props<TMultiple>
> {
  static defaultProps: {
    multiple: boolean;
  } = {
    multiple: false,
  };

  _renderRow = ({ item: row, isSelected, toggleItem }) => (
    <LoaderRow
      isSelected={isSelected}
      loadedRow={LoadedRow}
      loader={row.loader}
      toggleItem={toggleItem}
    />
  );

  render(): React.ReactElement {
    const { multiple } = this.props;
    return (
      <DAOPicker
        {...this.props}
        daoStore={BeverageStore}
        headerTitle={`Select Beverage${multiple ? 's' : ''}`}
        label={`Beverage${multiple ? 's' : ''}`}
        queryOptions={{
          // order by ID so homebrew shows up first
          orderBy: [
            {
              column: 'id',
              direction: 'desc',
            },
          ],
        }}
        renderRow={this._renderRow}
        shouldUseSearchQuery
        stringValueExtractor={(beverage: Beverage): string => beverage.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: beverage, isSelected, toggleItem }: any) => (
  <SelectableListItem
    leftAvatar={<BeverageAvatar beverageId={beverage.id} />}
    chevron={false}
    isSelected={isSelected}
    item={beverage}
    subtitle={beverage.beverageType}
    title={beverage.name}
    onPress={toggleItem}
  />
);

export default BeveragePicker;
