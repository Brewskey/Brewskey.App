// @flow

import type { Glass, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { GlassStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple: boolean> = {|
  error?: ?string,
  multiple: TMultiple,
  onChange: (value: PickerValue<Glass, TMultiple>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Glass, TMultiple>,
|};

class GlassPicker<TMultiple: boolean> extends React.Component<
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
    const { multiple, value } = this.props;
    return (
      <DAOPicker
        daoStore={GlassStore}
        headerTitle="Select Glass"
        label="Glass"
        multiple={multiple}
        renderRow={this._renderRow}
        stringValueExtractor={(glass: Glass): string => glass.name}
        value={value}
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
