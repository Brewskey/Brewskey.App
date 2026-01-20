import * as React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';

import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { validateEmail } from '../utils';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { TextInput } from '../common/form/TextInput';
import { SubmitButton } from '../common/form/SubmitButton';

export type ResetPasswordFormValues = {
  email: string;
};

export const ForgotPasswordForm: React.FC<{
  onSubmit: (values: ResetPasswordFormValues) => void;
}> = ({ onSubmit }) => {
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const validate = (values: ResetPasswordFormValues): boolean => {
    const errors: Record<string, string> = {};

    if (!values.email) {
      errors.email = 'Email name is required';
    }

    if (values.email && !validateEmail(values.email)) {
      errors.email = 'Email is not valid';
    }

    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof ResetPasswordFormValues, {
        type: 'manual',
        message: errors[key],
      });
    });

    return Object.keys(errors).length === 0;
  };

  const onSubmitHandler = async (values: ResetPasswordFormValues): Promise<void> => {
    if (validate(values)) {
      await onSubmit(values);
    }
  };

  const onSubmitButtonPress = handleSubmit(onSubmitHandler);

  return (
    <Form form={form}>
      <View testID="reset-password-form">
        <FormValidationMessage testID="reset-password-error-message" />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Email"
          name="email"
          testID="input-email"
        />
        <SectionContent paddedVertical>
          <Button
            disabled={isSubmitting}
            loading={isSubmitting}
            onPress={onSubmitButtonPress}
            testID="button-reset-password"
            title="Request password reset"
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export const ResetPasswordForm = ForgotPasswordForm;
