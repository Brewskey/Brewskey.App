// @flow

import type { Availability, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { AvailabilityStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props = {|
  error?: ?string,
  multiple?: boolean,
  onChange: (value: PickerValue<Availability>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Availability>,
|};

class AvailabilityPicker extends React.Component<Props> {
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
        daoStore={AvailabilityStore}
        headerTitle="Select Availability"
        label="Availability"
        renderRow={this._renderRow}
        stringValueExtractor={(availability: Availability): string =>
          availability.name
        }
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: availability, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={availability}
    title={availability.name}
    toggleItem={toggleItem}
  />
);

export default AvailabilityPicker;
