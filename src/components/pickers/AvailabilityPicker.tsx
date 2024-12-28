import type { Availability, QueryOptions } from '@brewskey/js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { AvailabilityStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props<TMultiple extends boolean> = {
  error?: string | null | undefined;
  multiple: TMultiple;
  onChange: (value: PickerValue<Availability, TMultiple>) => void;
  queryOptions?: QueryOptions;
  value: PickerValue<Availability, TMultiple>;
};

class AvailabilityPicker<TMultiple extends boolean> extends React.Component<
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
const LoadedRow = ({ item: availability, isSelected, toggleItem }: any) => (
  <SelectableListItem
    chevron={false}
    isSelected={isSelected}
    item={availability}
    title={availability.name}
    onPress={toggleItem}
  />
);

export default AvailabilityPicker;
