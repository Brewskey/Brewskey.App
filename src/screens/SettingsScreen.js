// @flow

import type { Navigation } from '../types';
import type { Organization } from 'brewskey.js-api';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { List, ListItem } from 'react-native-elements';
import withComponentStores from '../common/withComponentStores';
import Container from '../common/Container';
import Header from '../common/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DAOApi from 'brewskey.js-api';
import AppSettingsStore from '../stores/AppSettingsStore';
import DAOEntityStore from '../stores/DAOEntityStore';

import PickerField from '../components/PickerField';

type InjectedProps = {|
  navigation: Navigation,
  organizationStore: DAOEntityStore<Organization>,
|};

@withComponentStores({
  organizationStore: new DAOEntityStore(DAOApi.OrganizationDAO),
})
@observer
class SettingsScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { organizationStore } = this.injectedProps;
    const organizations = organizationStore.allItems;
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
      </Container>
    );
  }
}

export default SettingsScreen;
