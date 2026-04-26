import * as React from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from 'common/Container';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { Header } from 'common/Header';
import { Section } from 'common/Section';
import { SectionContent } from 'common/SectionContent';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useUpdateUsername } from 'hooks/queries/AuthQueries';
import { COLORS, TYPOGRAPHY } from 'theme';

interface SetUsernameFormFields {
  userName: string;
}

const styles = StyleSheet.create({
  helpText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textFaded,
    marginBottom: 12,
  },
});

const SetUsernameScreen: React.FC = () => {
  const updateUsernameMutation = useUpdateUsername();
  const addSnackBarMessage = useAddSnackBarMessage();
  const form = useForm<SetUsernameFormFields>({
    mode: 'onChange',
    defaultValues: { userName: '' },
  });

  const onSubmit = async ({ userName }: SetUsernameFormFields) => {
    await updateUsernameMutation.mutateAsync({ userName: userName.trim() });
    addSnackBarMessage({ content: 'Username saved.' });
  };

  return (
    <Container>
      <Header testID="header-set-username" title="Choose a username" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Section>
          <SectionContent paddedHorizontal paddedVertical>
            <FormProvider {...form}>
              <View testID="set-username-form">
                <Text style={styles.helpText}>
                  Pick the username other Brewskey users will see on pours,
                  leaderboards, and friend requests.
                </Text>
                <FormValidationMessage testID="set-username-error-message" />
                <TextInput
                  required
                  autoCapitalize="none"
                  autoCorrect={false}
                  label="Username"
                  name="userName"
                  testID="set-username-input"
                />
                <SubmitButton<SetUsernameFormFields>
                  allowSubmitWhenValid
                  onSubmit={onSubmit}
                  testID="set-username-submit-button"
                  title="Save username"
                />
              </View>
            </FormProvider>
          </SectionContent>
        </Section>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default SetUsernameScreen;
