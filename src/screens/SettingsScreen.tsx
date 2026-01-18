import * as React from 'react';

import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS, TYPOGRAPHY } from '../theme';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { useAppSettings } from '../hooks/context/AppSettingsContext';
import { useChangePassword } from '../hooks/queries/AuthQueries';
import { useGetOrganizations } from '../hooks/queries/OrganizationQueries';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import Section from '../common/Section';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import ListItem from '../common/ListItem';
import ChangePasswordForm, {
  type ChangePasswordFormFields,
} from '../components/ChangePasswordForm';
import OrganizationPicker from '../components/pickers/OrganizationPicker';

const styles = StyleSheet.create({
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginLeft: 4,
    marginTop: 12,
  },
});

const SettingsScreen: React.FC = () => {
  const addSnackBarMessage = useAddSnackBarMessage();
  const {
    isManageTapsEnabled,
    onOrganizationChange,
    onToggleManageTaps,
    selectedOrganization,
    updateMetadata,
  } = useAppSettings();
  const changePasswordMutation = useChangePassword();
  const { data: organizationsData } = useGetOrganizations();

  const hasOrganizations =
    organizationsData?.pages?.[0] != null &&
    organizationsData.pages[0].length > 0;

  const onChangePasswordSubmit = async (values: ChangePasswordFormFields) => {
    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      addSnackBarMessage({ content: 'Password changed!' });
    } catch (error) {
      addSnackBarMessage({
        content: error instanceof Error ? error.message : 'Failed to change password',
      });
    }
  };

  return (
    <Container>
      <Header showBackButton title="Settings" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Section bottomPadded>
          <SectionHeader title="Change password" />
          <SectionContent>
            <ChangePasswordForm onSubmit={onChangePasswordSubmit} />
          </SectionContent>
        </Section>
        <Section bottomPadded={hasOrganizations}>
          <SectionContent>
            <ListItem
              chevron={false}
              switch={{
                onValueChange: onToggleManageTaps,
                value: isManageTapsEnabled,
              }}
              title="Manage taps"
            />
          </SectionContent>
        </Section>
        {hasOrganizations && (
          <Section bottomPadded={updateMetadata != null}>
            <SectionContent>
              <OrganizationPicker
                onChange={onOrganizationChange}
                value={selectedOrganization}
              />
            </SectionContent>
          </Section>
        )}
        {updateMetadata != null && (
          <Section>
            <SectionContent>
              <Text style={styles.versionText}>
                {updateMetadata.appVersion} - {updateMetadata.label}
              </Text>
            </SectionContent>
          </Section>
        )}
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(SettingsScreen, <ErrorScreen showBackButton />);
