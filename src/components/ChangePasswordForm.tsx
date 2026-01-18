import * as React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';

import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import SectionContent from '../common/SectionContent';
import { TextInput } from '../common/form/TextInput';
import Button from '../common/buttons/Button';

export type ChangePasswordFormFields = {
  newPassword: string;
  oldPassword: string;
};

type Props = {
  onSubmit: (values: ChangePasswordFormFields) => undefined | Promise<unknown>;
};

const ChangePasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm<ChangePasswordFormFields>({
    defaultValues: {
      newPassword: '',
      oldPassword: '',
    },
  });

  const {
    handleSubmit,
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
      <View>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="Old password"
          name="oldPassword"
          nextFocusTo="newPassword"
          secureTextEntry
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextInput}
          disabled={isSubmitting}
          label="New password"
          name="newPassword"
          onSubmitEditing={handleSubmit(onSubmitForm)}
          secureTextEntry
        />
        <FormValidationMessage />
        <SectionContent paddedVertical>
          <Button
            disabled={isSubmitting || !isValid}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmitForm)}
            title="Change password"
          />
        </SectionContent>
      </View>
    </Form>
  );
};

export default ChangePasswordForm;
