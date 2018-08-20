// @flow

import type { Device, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { DeviceStore } from '../stores/DAOStores';
import LoaderRow from '../common/LoaderRow';
import SelectableListItem from '../common/SelectableListItem';

type Props = {|
  error?: ?string,
  multiple?: boolean,
  onChange: (value: PickerValue<Device>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Device>,
|};

class DevicePicker extends React.Component<Props> {
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
        daoStore={DeviceStore}
        headerTitle={`Select Brewskey Box${multiple ? 'es' : ''}`}
        label={`Brewskey box${multiple ? 'es' : ''}`}
        renderRow={this._renderRow}
        stringValueExtractor={(device: Device): string => device.name}
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
