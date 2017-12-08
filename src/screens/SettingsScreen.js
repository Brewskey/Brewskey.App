// @flow

import type { Navigation } from '../types';
import type { Organization } from 'brewskey.js-api';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import { OrganizationStore } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppSettingsStore from '../stores/AppSettingsStore';
import LoaderPickerField from '../common/PickerField/LoaderPickerField';

import PickerField from '../common/PickerField';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class SettingsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _hasOrganizations(): boolean {
    const organizationsLoader = OrganizationStore.getMany();
    return (
      organizationsLoader.hasValue() &&
      organizationsLoader.getValueEnforcing().length > 0
    );
  }

  render() {
    const {
      isManageTapsEnabled,
      isMultiAccountModeEnabled,
      onOrganizationChange,
      onToggleManageTaps,
      onToggleMultiAccountMode,
      selectedOrganizationID,
    } = AppSettingsStore;

    return (
      <Container>
        <Header title="Settings" />
        <LoaderPickerField
          enabled={this._hasOrganizations}
          itemsLoader={OrganizationStore.getMany()}
          key="organization"
          label="Selected Organization"
          name="organization"
          onChange={onOrganizationChange}
          placeholder="None"
          value={selectedOrganizationID}
        >
          {(items: Array<Organization>): Array<React.Node> =>
            items.map(({ id, name }: Organization): React.Node => (
              <PickerField.Item key={id} label={`${id} - ${name}`} value={id} />
            ))
          }
        </LoaderPickerField>
        <List>
          <KeyboardAwareScrollView>
            <ListItem
              title="Multi account mode"
              hideChevron
              onSwitch={onToggleMultiAccountMode}
              switchButton
              switched={isMultiAccountModeEnabled}
            />
            <ListItem
              hideChevron
              onSwitch={onToggleManageTaps}
              switchButton
              switched={isManageTapsEnabled}
              title="Manage taps"
            />
          </KeyboardAwareScrollView>
        </List>
      </Container>
    );
  }
}

export default SettingsScreen;
