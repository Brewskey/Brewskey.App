import * as React from 'react';
import { View } from 'react-native';

import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { validateEmail } from '../utils';
import { TextInput } from '../common/form/TextInput';
import { Form, useForm } from 'react-hook-form';

export type ResetPasswordFormValues = {
  email: string;
};

const validate = (email: string) => {
  if (!email) {
    return 'Email name is required';
  }

  if (email && !validateEmail(email)) {
    return 'Email is not valid';
  }
};

export const ForgotPasswordForm: React.FC<{
  onSubmit: (values: ResetPasswordFormValues) => void;
}> = ({ onSubmit }) => {
  const form = useForm<ResetPasswordFormValues>();
  const { isSubmitting, isValid, isDirty } = form.formState;

  return (
    <View>
      <Form {...form}>
        <TextInput
          name="email"
          label="Email"
          autoCorrect={false}
          autoCapitalize="none"
          required
          validate={validate}
        />
        <SectionContent paddedVertical>
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            loading={isSubmitting}
            onPress={form.handleSubmit(onSubmit)}
            title="Request password reset"
          />
        </SectionContent>
      </Form>
    </View>
  );
};
