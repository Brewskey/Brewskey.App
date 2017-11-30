// @flow

import type { Navigation } from '../types';
import type { Organization } from 'brewskey.js-api';

import * as React from 'react';
import { View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import Header from '../common/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DAOApi from 'brewskey.js-api';
import AppSettingsStore from '../stores/AppSettingsStore';
import DAOEntityStore from '../stores/DAOEntityStore';

import PickerField from '../components/PickerField';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class SettingsScreen extends InjectedComponent<InjectedProps> {
  _organizationStore: DAOEntityStore<Organization> = new DAOEntityStore(
    DAOApi.OrganizationDAO,
  );

  render() {
    const organizationsLoader = this._organizationStore.allItemsLoader;
    const organizations = organizationsLoader.getValue() || [];
    const {
      isManageTapsEnabled,
      isMultiAccountModeEnabled,
      onOrganizationChange,
      onToggleManageTaps,
      onToggleMultiAccountMode,
      selectedOrganizationID,
    } = AppSettingsStore;

    return (
      <View>
        <Header title="Settings" />
        {organizations.length < 1 ? null : (
          <PickerField
            key="organization"
            label="Selected Organization"
            name="organization"
            onChange={onOrganizationChange}
            placeholder="None"
            value={selectedOrganizationID}
          >
            {organizations.map((organization: Organization): React.Node => (
              <PickerField.Item
                key={organization.id}
                label={`${organization.id} - ${organization.name}`}
                value={organization.id}
              />
            ))}
          </PickerField>
        )}
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
      </View>
    );
  }
}

export default SettingsScreen;
