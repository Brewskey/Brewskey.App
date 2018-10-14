// @flow

import type { Beverage, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { BeverageStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple: boolean> = {|
  error?: ?string,
  multiple: TMultiple,
  onChange: (value: PickerValue<Beverage, TMultiple>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Beverage, TMultiple>,
|};

class BeveragePicker<TMultiple: boolean> extends React.Component<
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
