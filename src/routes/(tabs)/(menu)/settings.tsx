import * as React from 'react';

import { useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { FormField } from 'common/form/FormField';
import { Header } from 'common/Header';
import { ListItem } from 'common/ListItem';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { ChangePasswordForm } from 'components/ChangePasswordForm';
import { DeleteAccountButton } from 'components/DeleteAccountButton';
import { OrganizationPicker } from 'components/pickers/OrganizationPicker';
import { useAppSettings } from 'hooks/context/AppSettingsContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useChangePassword } from 'hooks/queries/AuthQueries';
import { useGetOrganizations } from 'hooks/queries/OrganizationQueries';
import { COLORS, TYPOGRAPHY } from 'theme';
import {
  getNativeAppVersionLabel,
  getOtaDetailsLabel,
} from 'utils/appVersionInfo';

import type { EntityID, Organization, ShortenedEntity } from '@brewskey/js-api';

import type { ChangePasswordFormFields } from 'components/ChangePasswordForm';

interface SettingsOrganizationForm {
  organization: EntityID | null;
}

const styles = StyleSheet.create({
  linkedAccountsButton: {
    borderColor: COLORS.primary2,
    borderWidth: 1,
    marginHorizontal: 0,
  },
  versionBlock: {
    marginLeft: 4,
    marginTop: 12,
    marginBottom: 24,
  },
  versionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  versionOtaText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginTop: 4,
  },
});

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const addSnackBarMessage = useAddSnackBarMessage();
  const {
    isManageTapsEnabled,
    onOrganizationChange,
    updateAppSettings,
    selectedOrganization,
  } = useAppSettings();
  const changePasswordMutation = useChangePassword();
  const { data: organizationsData } = useGetOrganizations();

  const form = useForm<SettingsOrganizationForm>({
    defaultValues: { organization: selectedOrganization?.id ?? null },
  });

  // Mirror external context changes (e.g. storage hydration) into the form so
  // the picker reflects them. User-initiated changes flow the other way via
  // `handleOrganizationChange`; setValue is a no-op when the id is unchanged.
  React.useEffect(() => {
    form.setValue('organization', selectedOrganization?.id ?? null);
  }, [selectedOrganization?.id, form]);

  const handleOrganizationChange = (
    organization: Organization | ShortenedEntity | null,
  ) => {
    // The picker only emits full Organization rows from `useGetOrganizations`,
    // never a `ShortenedEntity`, so this cast is safe in practice.
    onOrganizationChange((organization as Organization | null) ?? undefined);
  };

  const hasOrganizations =
    organizationsData?.pages?.[0] != null &&
    organizationsData.pages[0].length > 0;

  const otaDetailsLabel = getOtaDetailsLabel();

  const onChangePasswordSubmit = async (values: ChangePasswordFormFields) => {
    await changePasswordMutation.mutateAsync({
      oldPassword: values.oldPassword ?? '',
      newPassword: values.newPassword,
    });
    addSnackBarMessage({ content: 'Password changed!' });
  };

  const onManageTapsChange = (value: boolean) => {
    updateAppSettings({ manageTapsEnabled: value });
  };

  return (
    <Container>
      <Header shouldShowBackButton testID="header-settings" title="Settings" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Section bottomPadded>
          <SectionHeader title="Change password" />
          <SectionContent>
            <ChangePasswordForm onSubmit={onChangePasswordSubmit} />
          </SectionContent>
        </Section>
        <Section bottomPadded>
          <SectionContent>
            <Button
              backgroundColor={COLORS.secondary}
              color={COLORS.primary2}
              onPress={() => router.navigate('/(tabs)/(menu)/linked-accounts')}
              style={styles.linkedAccountsButton}
              testID="settings-linked-accounts-button"
              title="Linked Login Providers"
            />
          </SectionContent>
        </Section>
        <Section bottomPadded testID="settings-delete-account-section">
          <SectionContent>
            <DeleteAccountButton />
          </SectionContent>
        </Section>
        {hasOrganizations ? (
          <Section bottomPadded>
            <SectionContent>
              <FormProvider {...form}>
                <FormField<SettingsOrganizationForm, typeof OrganizationPicker>
                  component={OrganizationPicker}
                  defaultValue={selectedOrganization}
                  label="Organization"
                  name="organization"
                  onChange={handleOrganizationChange}
                  testID="organization-dropdown"
                />
              </FormProvider>
            </SectionContent>
          </Section>
        ) : null}
        <Section bottomPadded>
          <SectionContent>
            <ListItem
              chevron={false}
              testID="switch-manage-taps"
              title="Manage taps"
              switch={{
                onValueChange: onManageTapsChange,
                value: isManageTapsEnabled,
              }}
            />
          </SectionContent>
        </Section>
        <Section bottomPadded>
          <SectionContent>
            <View style={styles.versionBlock}>
              <Text style={styles.versionText} testID="settings-app-version">
                Version {getNativeAppVersionLabel()}
              </Text>
              {otaDetailsLabel ? (
                <Text
                  style={styles.versionOtaText}
                  testID="settings-app-version-ota"
                >
                  {otaDetailsLabel}
                </Text>
              ) : null}
            </View>
          </SectionContent>
        </Section>
      </ScrollView>
    </Container>
  );
};

export default SettingsScreen;
