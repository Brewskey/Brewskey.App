// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
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

const styles = StyleSheet.create({
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginLeft: 4,
    marginTop: 12,
  },
});

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
      updateMetadata,
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
          <Section bottomPadded={updateMetadata !== null}>
            <ListItem
              hideChevron
              onSwitch={onToggleManageTaps}
              switchButton
              switched={isManageTapsEnabled}
              title="Manage taps"
            />
          </Section>
          {updateMetadata === null ? null : (
            <Section topPadded>
              <Text style={styles.versionText}>
                {updateMetadata.appVersion} - {updateMetadata.label}
              </Text>
            </Section>
          )}
        </ScrollView>
      </Container>
    );
  }
}

export default SettingsScreen;
