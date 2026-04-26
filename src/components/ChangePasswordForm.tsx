import * as React from 'react';

import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { handleSubmitWithError } from 'common/form/handleSubmitWithError';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { SectionContent } from 'common/SectionContent';

export interface ChangePasswordFormFields {
  newPassword: string;
  oldPassword?: string;
}

interface Props {
  mode?: 'change' | 'set';
  onSubmit: (values: ChangePasswordFormFields) => undefined | Promise<unknown>;
}

const ChangePasswordForm: React.FC<Props> = ({ mode = 'change', onSubmit }) => {
  const form = useForm<ChangePasswordFormFields>({
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const validate = (values: ChangePasswordFormFields): boolean => {
    const errors: Record<string, string> = {};

    if (mode === 'change' && !values.oldPassword) {
      errors.oldPassword = 'Old password is required';
    }

    if (!values.newPassword) {
      errors.newPassword = 'New password is required';
    }

    if (
      mode === 'change' &&
      values.oldPassword &&
      values.newPassword === values.oldPassword
    ) {
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
      <View
        testID={mode === 'set' ? 'set-password-form' : 'change-password-form'}
      >
        <FormValidationMessage
          testID={
            mode === 'set'
              ? 'set-password-error-message'
              : 'change-password-error-message'
          }
        />
        {mode === 'change' ? (
          <FormField<ChangePasswordFormFields, typeof TextInput>
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            component={TextInput}
            disabled={isSubmitting}
            label="Old password"
            name="oldPassword"
            nextFocusTo="newPassword"
            required
            testID="input-oldPassword"
          />
        ) : null}
        <FormField<ChangePasswordFormFields, typeof TextInput>
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="New password"
          name="newPassword"
          onSubmitEditing={handleSubmitWithError(form, onSubmitForm)}
          required
          testID={
            mode === 'set' ? 'input-set-newPassword' : 'input-newPassword'
          }
        />
        <SectionContent paddedVertical>
          <SubmitButton<ChangePasswordFormFields>
            allowSubmitWhenValid
            onSubmit={onSubmitForm}
            testID={
              mode === 'set' ? 'button-set-password' : 'button-change-password'
            }
            title={mode === 'set' ? 'Set password' : 'Change password'}
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export { ChangePasswordForm };
