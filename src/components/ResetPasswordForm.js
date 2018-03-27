// @flow

import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { observer } from 'mobx-react';
import { FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InjectedComponent from '../common/InjectedComponent';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { FormField, form } from '../common/form';
import TextField from './TextField';
import { validateEmail } from '../utils';

export type ResetPasswordFormValues = {|
  email: string,
|};

const validate = ({
  email,
}: ResetPasswordFormValues): { [key: string]: string } => {
  const errors = {};

  if (!email) {
    errors.email = 'Email name is required';
  }

  if (email && !validateEmail(email)) {
    errors.email = 'Email is not valid';
  }

  return errors;
};

@form({ validate })
@observer
class ForgotPasswordForm extends InjectedComponent<FormProps> {
  render() {
    const { formError, handleSubmit, invalid, submitting } = this.injectedProps;

    return (
      <KeyboardAwareScrollView>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="Email"
          onSubmitEditing={handleSubmit}
          name="email"
        />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid}
            loading={submitting}
            onPress={handleSubmit}
            title="Request password reset"
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default ForgotPasswordForm;
