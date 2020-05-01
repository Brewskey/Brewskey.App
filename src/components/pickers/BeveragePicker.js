// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type { BoolUnion, PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { BeverageStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple: BoolUnion> = {|
  error?: ?string,
  multiple: TMultiple,
  onChange: (value: PickerValue<Beverage, TMultiple>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Beverage, TMultiple>,
|};

class BeveragePicker<TMultiple: BoolUnion> extends React.Component<
  Props<TMultiple>,
> {
  static defaultProps = {
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

  render() {
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
        stringValueExtractor={(beverage: Beverage): string => beverage.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: beverage, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    avatar={<BeverageAvatar beverageId={beverage.id} />}
    hideChevron
    isSelected={isSelected}
    item={beverage}
    subtitle={beverage.beverageType}
    title={beverage.name}
    toggleItem={toggleItem}
  />
);

export default BeveragePicker;
