// @flow

import type { Srm, QueryOptions } from 'brewskey.js-api';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { SrmStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';
import ColorIcon from '../../common/ColorIcon';
import PickerSrmInput from './PickerSrmInput';

type Props = {|
  error?: ?string,
  onChange: (value: PickerValue<Srm, false>) => void,
  queryOptions?: QueryOptions,
  value: PickerValue<Srm, false>,
|};

class SrmPicker extends React.Component<Props> {
  _renderRow = ({ item: row, isSelected, toggleItem }) => (
    <LoaderRow
      isSelected={isSelected}
      loadedRow={LoadedRow}
      loader={row.loader}
      toggleItem={toggleItem}
    />
  );

  render(): React.Node {
    return (
      <DAOPicker
        {...this.props}
        daoStore={SrmStore}
        headerTitle="Select Srm"
        multiple={false}
        label="Srm"
        pickerInputComponent={PickerSrmInput}
        renderRow={this._renderRow}
        stringValueExtractor={(srm: Srm): string => srm.name}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: srm, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    leftAvatar={<ColorIcon color={`#${srm.hex}`} />}
    chevron={false}
    isSelected={isSelected}
    item={srm}
    onPress={toggleItem}
  />
);

export default SrmPicker;
