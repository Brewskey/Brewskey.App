// @flow

import type { Navigation } from '../types';
import type AppSettingsStore from '../stores/AppSettingsStore';
import type { Organization } from 'brewskey.js-api';

import * as React from 'react';
import { View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DAOApi from 'brewskey.js-api';
import DAOEntityStore from '../stores/DAOEntityStore';
import PickerField from '../components/PickerField';

type InjectedProps = {|
  navigation: Navigation,
  appSettingsStore: AppSettingsStore,
|};

@inject('appSettingsStore')
@observer
class SettingsScreen extends InjectedComponent<InjectedProps> {
  _organizationStore: DAOEntityStore<Organization> = new DAOEntityStore(
    DAOApi.OrganizationDAO,
  );

  static navigationOptions = {
    title: 'Settings',
  };

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
    } = this.injectedProps.appSettingsStore;
    return (
      <View>
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
