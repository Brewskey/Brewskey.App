import type { UserCredentials } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { COLORS } from '../theme';
import { TextInput } from '../common/form/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { useLogin } from '../hooks/queries/AuthQueries';
import { FormValidationText } from '../common/form/FormValidationMessage';

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

  const onSubmit = methods.handleSubmit(async (formData: FormProps) => {
    await loginMutator.mutateAsync(formData);
  });

  const { isSubmitting, isDirty, isValid } = methods.formState;
  return (
    <FormProvider {...methods}>
      <View>
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
          underlineColorAndroid={isInverse ? COLORS.secondary : undefined}
          validationTextStyle={styles.validationText}
        />
        {loginMutator.error != null ? (
          <FormValidationText>{loginMutator.error.message}</FormValidationText>
        ) : null}
        <SectionContent paddedVertical>
          <Button
            disabled={!isDirty || !isValid}
            loading={isSubmitting}
            onPress={onSubmit}
            secondary={isInverse}
            title="Log in"
          />
        </SectionContent>
      </View>
    </FormProvider>
  );
};
