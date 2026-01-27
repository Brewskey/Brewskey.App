import * as React from 'react';

import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from '../../common/Container';
import { Header } from '../../common/Header';
import { SectionContent } from '../../common/SectionContent';
import { ResetPasswordModal } from '../../components/modals/ResetPasswordModal';
import { ResetPasswordForm } from '../../components/ResetPasswordForm';
import { useResetPassword } from '../../hooks/queries/AuthQueries';
import { COLORS, TYPOGRAPHY } from '../../theme';

import type { ResetPasswordFormValues } from '../../components/ResetPasswordForm';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default function ResetPasswordScreen() {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const resetPassword = useResetPassword();
  const router = useRouter();

  const onFormSubmit = async (
    formFields: ResetPasswordFormValues,
  ): Promise<void> => {
    await resetPassword.mutateAsync(formFields);
    setIsModalOpen(true);
  };

  const onSuccessModalHide = () => {
    setIsModalOpen(false);
    router.back();
  };

  return (
    <Container>
      <Header shouldShowBackButton title="Reset password" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <SectionContent paddedHorizontal paddedVertical>
          <Text style={styles.text}>
            Enter your email address and we'll send a password reset email to
            you.
          </Text>
        </SectionContent>
        <ResetPasswordForm onSubmit={onFormSubmit} />
        <ResetPasswordModal
          isVisible={isModalOpen}
          onHideModal={onSuccessModalHide}
        />
      </KeyboardAwareScrollView>
    </Container>
  );
}
