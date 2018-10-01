// @flow

import type { Device, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { DeviceStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple: boolean> = {|
  error?: ?string,
  multiple: TMultiple,
  onChange: (value: PickerValue<Device, TMultiple>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Device, TMultiple>,
|};

class DevicePicker<TMultiple: boolean> extends React.Component<
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
        daoStore={DeviceStore}
        headerTitle={`Select Brewskey Box${multiple ? 'es' : ''}`}
        label={`Brewskey box${multiple ? 'es' : ''}`}
        multiple={multiple}
        renderRow={this._renderRow}
        stringValueExtractor={(device: Device): string => device.name}
        value={value}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: device, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={device}
    title={device.name}
    toggleItem={toggleItem}
  />
);

export default DevicePicker;
