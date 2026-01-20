import * as React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';

import { useAuthActions } from '../stores/AuthStore';
import { useRegister } from '../hooks/queries/AuthQueries';

import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { validateEmail } from '../utils';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { TextInput } from '../common/form/TextInput';

export type RegisterFormFields = {
  email: string;
  password: string;
  userName: string;
};

const RegisterForm: React.FC = () => {
  const registerMutation = useRegister();
  const { login } = useAuthActions();
  const form = useForm<RegisterFormFields>({
    defaultValues: {
      email: '',
      password: '',
      userName: '',
    },
  });

  const {
    handleSubmit,
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
      try {
        await registerMutation.mutateAsync(values);
        const { password, userName } = values;
        await login({ password, userName });
      } catch (error) {
        // Error is handled by FormValidationMessage via registerMutation.error
        // Don't rethrow - let the form display the error
      }
    }
  };

  const onSubmitButtonPress = handleSubmit(onSubmit);

  return (
    <Form form={form}>
      <View testID="register-form">
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="User name"
          name="userName"
          nextFocusTo="email"
          testID="input-userName"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Email"
          name="email"
          nextFocusTo="password"
          testID="input-email"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Password"
          name="password"
          onSubmitEditing={onSubmitButtonPress}
          secureTextEntry
          testID="input-password"
        />
        <FormValidationMessage 
          testID="register-error-message" 
          error={registerMutation.error?.message}
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

export default RegisterForm;
