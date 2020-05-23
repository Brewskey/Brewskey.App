// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, TYPOGRAPHY } from '../theme';
import SnackBarStore from '../stores/SnackBarStore';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ListItem } from 'react-native-elements';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import { OrganizationStore } from '../stores/DAOStores';
import Container from '../common/Container';
import Header from '../common/Header';
import AppSettingsStore from '../stores/AppSettingsStore';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import OrganizationPicker from '../components/pickers/OrganizationPicker';
import ChangePasswordForm from '../components/ChangePasswordForm';

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
    const organizationsLoader = OrganizationStore.count();
    return (organizationsLoader.getValue() || 0) > 1;
  }

  _onChangePasswordSubmit = async (values) => {
    await DAOApi.Auth.changePassword(values);
    SnackBarStore.showMessage({ text: 'Password changed!' });
  };

  render(): React.Node {
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
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Section bottomPadded>
            <SectionHeader title="Change password" />
            <ChangePasswordForm onSubmit={this._onChangePasswordSubmit} />
          </Section>
          <Section bottomPadded={this._hasOrganizations}>
            <ListItem
              chevron={false}
              switch={{
                onValueChange: onToggleManageTaps,
                value: isManageTapsEnabled,
              }}
              title="Manage taps"
            />
          </Section>
          {!this._hasOrganizations ? null : (
            <Section bottomPadded={updateMetadata !== null}>
              <OrganizationPicker
                onChange={onOrganizationChange}
                value={selectedOrganization}
              />
            </Section>
          )}
          {!updateMetadata ? null : (
            <Section>
              <Text style={styles.versionText}>
                {updateMetadata.appVersion} - {updateMetadata.label}
              </Text>
            </Section>
          )}
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default SettingsScreen;
