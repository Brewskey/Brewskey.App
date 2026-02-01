import * as React from 'react';

import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
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

import type { Organization } from '@brewskey/js-api';
import type { ChangePasswordFormFields } from 'components/ChangePasswordForm';

type SettingsOrganizationForm = {
  organization: Organization | null | undefined;
};

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

  // Create a minimal form for OrganizationPicker2
  const form = useForm<{ organization: typeof selectedOrganization }>({
    defaultValues: {
      organization: selectedOrganization,
    },
  });

  React.useEffect(() => {
    form.setValue('organization', selectedOrganization);
  }, [selectedOrganization, form]);

  // Watch form value changes and sync with custom callback
  const formOrganization = useWatch({
    control: form.control,
    name: 'organization',
  });
  React.useEffect(() => {
    if (formOrganization !== selectedOrganization) {
      onOrganizationChange(formOrganization);
    }
  }, [formOrganization, selectedOrganization, onOrganizationChange]);

  const hasOrganizations =
    organizationsData?.pages?.[0] != null &&
    organizationsData.pages[0].length > 0;

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
          <Section bottomPadded={updateMetadata != null}>
            <SectionContent>
              <FormProvider {...form}>
                <FormField<SettingsOrganizationForm, typeof OrganizationPicker>
                  component={OrganizationPicker}
                  defaultValue={selectedOrganization}
                  label="Organization"
                  name="organization"
                  testID="organization-dropdown"
                />
              </FormProvider>
            </SectionContent>
          </Section>
        ) : null}
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

export default withErrorBoundary(
  SettingsScreen,
  <ErrorScreen shouldShowBackButton />,
);
