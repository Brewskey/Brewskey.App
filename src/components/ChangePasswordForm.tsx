import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { View } from 'react-native';

import FormValidationMessage from '../common/form/FormValidationMessage';
import { form, FormField } from '../common/form';
import SectionContent from '../common/SectionContent';
import { AdvancedTextField } from '../common/form/TextField';
import Button from '../common/buttons/Button';

export type ChangePasswordFormFields = {
  newPassword: string;
  oldPassword: string;
};

const validate = ({
  newPassword,
  oldPassword,
}: ChangePasswordFormFields): Partial<
  Record<keyof ChangePasswordFormFields, string>
> => {
  const errors: Record<string, any> = {};

  if (!oldPassword) {
    errors.oldPassword = 'Old password is required';
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required';
  }

  if (newPassword && newPassword === oldPassword) {
    errors.newPassword = 'New password the same as old';
  }

  if (newPassword && newPassword.length < 6) {
    errors.newPassword = 'password should be at least 6 characters long';
  }

  return errors;
};

type Props = {
  onSubmit: (values: ChangePasswordFormFields) => undefined | Promise<any>;
};

@form({ validate })
class ChangePasswordForm extends InjectedComponent<FormProps, Props> {
  render(): React.ReactElement {
    const { formError, handleSubmit, invalid, submitting } = this.injectedProps;
    return (
      <View>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={AdvancedTextField}
          disabled={submitting}
          label="Old password"
          name="oldPassword"
          nextFocusTo="newPassword"
          secureTextEntry
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={AdvancedTextField}
          disabled={submitting}
          label="New password"
          name="newPassword"
          onSubmitEditing={handleSubmit}
          secureTextEntry
        />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid}
            loading={submitting}
            onPress={handleSubmit}
            title="Change password"
          />
        </SectionContent>
      </View>
    );
  }
}

export default ChangePasswordForm;
