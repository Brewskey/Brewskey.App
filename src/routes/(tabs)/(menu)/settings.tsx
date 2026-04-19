import * as React from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { FormField } from 'common/form/FormField';
import { Header } from 'common/Header';
import { ListItem } from 'common/ListItem';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { ChangePasswordForm } from 'components/ChangePasswordForm';
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
  versionBlock: {
    marginLeft: 4,
    marginTop: 12,
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
  const addSnackBarMessage = useAddSnackBarMessage();
  const {
    isManageTapsEnabled,
    onOrganizationChange,
    onToggleManageTaps,
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
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    addSnackBarMessage({ content: 'Password changed!' });
  };

  return (
    <Container>
      <Header shouldShowBackButton testID="header-settings" title="Settings" />
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
              testID="switch-manage-taps"
              title="Manage taps"
              switch={{
                onValueChange: onToggleManageTaps,
                value: isManageTapsEnabled,
              }}
            />
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
        <Section>
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
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default SettingsScreen;
