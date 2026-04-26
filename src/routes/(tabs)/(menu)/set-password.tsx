import * as React from 'react';

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { ChangePasswordForm } from 'components/ChangePasswordForm';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useSetPassword } from 'hooks/queries/AuthQueries';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { ChangePasswordFormFields } from 'components/ChangePasswordForm';

const styles = StyleSheet.create({
  helpText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textFaded,
  },
});

const SetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const setPasswordMutation = useSetPassword();
  const addSnackBarMessage = useAddSnackBarMessage();

  const onSubmit = async ({ newPassword }: ChangePasswordFormFields) => {
    await setPasswordMutation.mutateAsync({ newPassword });
    addSnackBarMessage({ content: 'Password set.' });
    router.back();
  };

  return (
    <Container>
      <Header
        shouldShowBackButton
        testID="header-set-password"
        title="Set password"
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Section bottomPadded>
          <SectionContent paddedHorizontal paddedVertical>
            <Text style={styles.helpText}>
              Set a password so you can still sign in before unlinking your last
              connected account.
            </Text>
          </SectionContent>
          <SectionContent>
            <ChangePasswordForm mode="set" onSubmit={onSubmit} />
          </SectionContent>
        </Section>
      </ScrollView>
    </Container>
  );
};

export default SetPasswordScreen;
