import * as React from 'react';

import DAOApi from '@brewskey/js-api';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, TYPOGRAPHY } from '../theme';
import SnackBarStore from '../hooks/context/SnackBarContext';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import AppSettingsStore from '../stores/AppSettingsStore';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import OrganizationPicker from '../components/pickers/OrganizationPicker';
import ListItem from '../common/ListItem';

const styles = StyleSheet.create({
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginLeft: 4,
    marginTop: 12,
  },
});

@errorBoundary(<ErrorScreen showBackButton />)
class SettingsScreen extends React.Component {
  get _hasOrganizations(): boolean {
    // const organizationsLoader = OrganizationStore.count();
    // return (organizationsLoader.getValue() || 0) > 1;

    return false;
  }

  _onChangePasswordSubmit = async () => {
    // await DAOApi.Auth.changePassword(values);
    SnackBarStore.showMessage({ content: 'Password changed!' });
  };

  render(): React.ReactElement {
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
            {/* <ChangePasswordForm onSubmit={this._onChangePasswordSubmit} /> */}
          </Section>
          <Section bottomPadded={this._hasOrganizations}>
            <ListItem
              chevron={false}
              // switch={{
              //   onValueChange: onToggleManageTaps,
              //   value: isManageTapsEnabled,
              // }}
              title="Manage taps"
            />
          </Section>
          {!this._hasOrganizations ? null : (
            <Section bottomPadded={updateMetadata !== null}>
              {/* <OrganizationPicker
                onChange={onOrganizationChange}
                value={selectedOrganization}
              /> */}
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
