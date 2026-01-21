import type { UserCredentials } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { COLORS } from '../theme';
import { TextInput } from '../common/form/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { useLogin } from '../hooks/queries/AuthQueries';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';

const styles = StyleSheet.create({
  input: {
    color: COLORS.textInverse,
  },
  label: {
    color: COLORS.textInverse,
  },
  validationText: {
    color: COLORS.danger2,
  },
});

type FormProps = {
  userName: string;
  password: string;
};

export const LoginForm = ({ isInverse }: { isInverse: boolean }) => {
  const methods = useForm<FormProps>({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const loginMutator = useLogin();

  const onSubmit = async (formData: FormProps) => {
    await loginMutator.mutateAsync(formData);
  };

  const { isSubmitting, isDirty, isValid } = methods.formState;
  return (
    <FormProvider {...methods}>
      <View testID="login-form">
        <FormValidationMessage testID="login-error-message" />
        <TextInput
          required
          autoCapitalize="none"
          autoCorrect={false}
          disabled={!loginMutator.isIdle}
          inputStyle={isInverse ? styles.input : undefined}
          label="User name"
          labelStyle={isInverse ? styles.label : undefined}
          name="userName"
          nextFocusTo="password"
          selectionColor={isInverse ? COLORS.textInverse : undefined}
          testID="login-username-input"
          underlineColorAndroid={isInverse ? COLORS.secondary : undefined}
          validationTextStyle={styles.validationText}
        />
        <TextInput
          required
          autoCapitalize="none"
          autoCorrect={false}
          disabled={!loginMutator.isIdle}
          inputStyle={isInverse ? styles.input : null}
          label="Password"
          labelStyle={isInverse ? styles.label : null}
          name="password"
          secureTextEntry
          selectionColor={isInverse ? COLORS.textInverse : undefined}
          testID="login-password-input"
          underlineColorAndroid={isInverse ? COLORS.secondary : undefined}
          validationTextStyle={styles.validationText}
        />
        <SectionContent paddedVertical>
          <Button
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
            onPress={handleSubmitWithError(methods, onSubmit)}
            secondary={isInverse}
            testID="login-submit-button"
            title="Log in"
          />
        </SectionContent>
      </View>
    </FormProvider>
  );
};
