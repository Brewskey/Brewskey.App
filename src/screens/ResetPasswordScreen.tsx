import type { ResetPasswordFormValues } from '../components/ResetPasswordForm';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import Header from '../common/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SectionContent from '../common/SectionContent';
import Container from '../common/Container';
import ResetPasswordModal from '../components/modals/ResetPasswordModal';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { COLORS, TYPOGRAPHY } from '../theme';
import { useResetPassword } from '../hooks/queries/AuthQueries';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
    textAlign: 'center',
  },
});

export const ResetPasswordScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const resetPassword = useResetPassword();
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const onFormSubmit = async (
    formFields: ResetPasswordFormValues,
  ): Promise<void> => {
    await resetPassword.mutate(formFields);
    setIsModalOpen(true);
  };

  const onSuccessModalHide = () => {
    setIsModalOpen(false);
    navigation.goBack();
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
};

export default ResetPasswordScreen;
