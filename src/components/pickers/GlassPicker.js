// @flow

import type { Glass, QueryOptions } from 'brewskey.js-api';
import type { BoolUnion, PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { GlassStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple: BoolUnion> = {|
  error?: ?string,
  multiple: TMultiple,
  onChange: (value: PickerValue<Glass, TMultiple>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Glass, TMultiple>,
|};

class GlassPicker<TMultiple: BoolUnion> extends React.Component<
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
    return (
      <DAOPicker
        {...this.props}
        daoStore={GlassStore}
        headerTitle="Select Glass"
        label="Glass"
        renderRow={this._renderRow}
        stringValueExtractor={(glass: Glass): string => glass.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: glass, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={glass}
    title={glass.name}
    toggleItem={toggleItem}
  />
);

export default GlassPicker;
