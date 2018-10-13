// @flow

import type { QueryOptions, Organization } from 'brewskey.js-api';

import * as React from 'react';
import DAOPicker from './DAOPicker';
import { OrganizationStore } from '../../stores/DAOStores';
import LoaderRow from '../../common/LoaderRow';
import SelectableListItem from '../../common/SelectableListItem';

type Props = {|
  error?: ?string,
  onChange: (value: ?Organization) => void,
  queryOptions?: QueryOptions,
  value: ?Organization,
|};

class OrganizaionPicker extends React.Component<Props> {
  _renderRow = ({ item: row, isSelected, toggleItem }) => (
    <LoaderRow
      isSelected={isSelected}
      loadedRow={LoadedRow}
      loader={row.loader}
      toggleItem={toggleItem}
    />
  );

  render() {
    const { onChange, value } = this.props;
    return (
      <DAOPicker
        daoStore={OrganizationStore}
        headerTitle="Select Organization"
        label="Organization"
        multiple={false}
        onChange={onChange}
        placeholder="None"
        renderRow={this._renderRow}
        stringValueExtractor={({ id, name }: Organization): string =>
          `${id} - ${name}`
        }
        value={value}
      />
    );
  }
}

// todo annotate better
const LoadedRow = ({ item: organization, isSelected, toggleItem }: Object) => (
  <SelectableListItem
    hideChevron
    isSelected={isSelected}
    item={organization}
    title={`${organization.id} - ${organization.name}`}
    toggleItem={toggleItem}
  />
);

export default OrganizaionPicker;
