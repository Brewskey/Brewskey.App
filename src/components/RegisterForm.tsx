import * as React from 'react';

import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { handleSubmitWithError } from 'common/form/handleSubmitWithError';
import { TextInput } from 'common/form/TextInput';
import { SectionContent } from 'common/SectionContent';
import { useLogin, useRegister } from 'hooks/queries/AuthQueries';
import { validateEmail } from 'utils';

export interface RegisterFormFields {
  email: string;
  password: string;
  userName: string;
}

const RegisterForm: React.FC = () => {
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const form = useForm<RegisterFormFields>({
    defaultValues: {
      email: '',
      password: '',
      userName: '',
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const validate = (values: RegisterFormFields): boolean => {
    const errors: Record<string, string> = {};

    if (!values.userName) {
      errors.userName = 'User name is required';
    }

    if (!values.email) {
      errors.email = 'Email name is required';
    }

    if (values.email && !validateEmail(values.email)) {
      errors.email = 'Email is not valid';
    }

    if (!values.password) {
      errors.password = 'password is required';
    }

    if (values.password && values.password.length < 6) {
      errors.password = 'password should be at least 6 characters long';
    }

    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof RegisterFormFields, {
        type: 'manual',
        message: errors[key],
      });
    });

    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (values: RegisterFormFields): Promise<void> => {
    if (validate(values)) {
      await registerMutation.mutateAsync(values);
      const { password, userName } = values;
      try {
        await loginMutation.mutateAsync({ password, userName });
      } catch (loginError) {
        // If login fails after successful registration, set a form-level error
        // so it can be displayed by FormValidationMessage
        form.setError('root', {
          type: 'manual',
          message:
            loginError instanceof Error
              ? loginError.message
              : 'Registration successful but login failed. Please try logging in manually.',
        });
      }
    }
  };

  const onSubmitButtonPress = handleSubmitWithError(form, onSubmit);

  return (
    <Form form={form}>
      <View testID="register-form">
        <FormValidationMessage testID="register-error-message" />
        <FormField<RegisterFormFields, typeof TextInput>
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="User name"
          name="userName"
          nextFocusTo="email"
          required
          testID="input-userName"
        />
        <FormField<RegisterFormFields, typeof TextInput>
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Email"
          name="email"
          nextFocusTo="password"
          required
          testID="input-email"
        />
        <FormField<RegisterFormFields, typeof TextInput>
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Password"
          name="password"
          onSubmitEditing={onSubmitButtonPress}
          required
          testID="input-password"
        />
        <SectionContent paddedVertical>
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            loading={isSubmitting}
            onPress={onSubmitButtonPress}
            testID="register-submit-button"
            title="Register"
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export { RegisterForm };
