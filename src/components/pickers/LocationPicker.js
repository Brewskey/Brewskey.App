// @flow

import type { Location, QueryOptions } from 'brewskey.js-api';
import type { Style } from '../../types';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { LocationStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';
import { NULL_STRING_PLACEHOLDER } from '../../constants';

type Props = {|
  error?: ?string,
  inputStyle?: Style,
  labelStyle?: Style,
  multiple?: boolean,
  onChange: (value: PickerValue<Location>) => void,
  placeholderTextColor?: string,
  queryOptions?: QueryOptions,
  selectionColor?: string,
  underlineColorAndroid?: string,
  validationTextStyle?: Style,
  value: PickerValue<Location>,
  // react-native textInput props
|};

class LocationPicker extends React.PureComponent<Props> {
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
        daoStore={LocationStore}
        headerTitle={`Select Location${multiple ? 's' : ''}`}
        label={`Location${multiple ? 's' : ''}`}
        renderRow={this._renderRow}
        stringValueExtractor={(location: Location): string => location.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: location, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={location}
    subtitle={location.summary || NULL_STRING_PLACEHOLDER}
    title={location.name}
    toggleItem={toggleItem}
  />
);

export default LocationPicker;
