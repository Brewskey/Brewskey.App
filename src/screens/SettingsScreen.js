// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { ScrollView } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { ListItem } from 'react-native-elements';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import { OrganizationStore } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import AppSettingsStore from '../stores/AppSettingsStore';
import Section from '../common/Section';
import OrganizationPicker from '../components/pickers/OrganizationPicker';

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
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
      onOrganizationChange,
      onToggleManageTaps,
      selectedOrganization,
    } = AppSettingsStore;

    return (
      <Container>
        <Header showBackButton title="Settings" />
        <ScrollView>
          <Section bottomPadded>
            <OrganizationPicker
              onChange={onOrganizationChange}
              value={selectedOrganization}
            />
          </Section>
          <Section>
            <ListItem
              hideChevron
              onSwitch={onToggleManageTaps}
              switchButton
              switched={isManageTapsEnabled}
              title="Manage taps"
            />
          </Section>
        </ScrollView>
      </Container>
    );
  }
}

export default SettingsScreen;
