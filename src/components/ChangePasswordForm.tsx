import * as React from 'react';

import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '../common/buttons/Button';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';
import { TextInput } from '../common/form/TextInput';
import { SectionContent } from '../common/SectionContent';

export interface ChangePasswordFormFields {
  newPassword: string;
  oldPassword: string;
}

interface Props {
  onSubmit: (values: ChangePasswordFormFields) => undefined | Promise<unknown>;
}

const ChangePasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm<ChangePasswordFormFields>({
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const validate = (values: ChangePasswordFormFields): boolean => {
    const errors: Record<string, string> = {};

    if (!values.oldPassword) {
      errors.oldPassword = 'Old password is required';
    }

    if (!values.newPassword) {
      errors.newPassword = 'New password is required';
    }

    if (values.newPassword && values.newPassword === values.oldPassword) {
      errors.newPassword = 'New password the same as old';
    }

    if (values.newPassword && values.newPassword.length < 6) {
      errors.newPassword = 'password should be at least 6 characters long';
    }

    // Set errors in react-hook-form
    Object.keys(errors).forEach((key) => {
      form.setError(key as keyof ChangePasswordFormFields, {
        type: 'manual',
        message: errors[key],
      });
    });

    return Object.keys(errors).length === 0;
  };

  const onSubmitForm = async (values: ChangePasswordFormFields) => {
    if (validate(values)) {
      await onSubmit(values);
    }
  };

  return (
    <Form form={form}>
      <View testID="change-password-form">
        <FormValidationMessage testID="change-password-error-message" />
        <FormField
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Old password"
          name="oldPassword"
          nextFocusTo="newPassword"
          testID="input-oldPassword"
        />
        <FormField
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="New password"
          name="newPassword"
          onSubmitEditing={handleSubmitWithError(form, onSubmitForm)}
          testID="input-newPassword"
        />
        <SectionContent paddedVertical>
          <Button
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            onPress={handleSubmitWithError(form, onSubmitForm)}
            testID="button-change-password"
            title="Change password"
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export { ChangePasswordForm };
