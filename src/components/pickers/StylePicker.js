// @flow

import type { Style, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { StyleStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props = {|
  error?: ?string,
  onChange: (value: ?PickerValue<Style, false>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Style, false>,
|};

class GlassPicker extends React.Component<Props> {
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
        daoStore={StyleStore}
        headerTitle="Select Style"
        label="Style"
        multiple={false}
        renderRow={this._renderRow}
        stringValueExtractor={(style: Style): string => style.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: style, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={style}
    title={style.name}
    toggleItem={toggleItem}
  />
);

export default GlassPicker;
