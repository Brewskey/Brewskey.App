// @flow

import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import InjectedComponent from '../common/InjectedComponent';
import { FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { form, FormField } from '../common/form';
import SectionContent from '../common/SectionContent';
import TextField from '../components/TextField';
import Button from '../common/buttons/Button';
import { validateEmail } from '../utils';

const validate = ({
  email,
  password,
  passwordConfirm,
  userName,
}: Object): { [key: string]: string } => {
  const errors = {};

  if (!userName) {
    errors.userName = 'User name is required';
  }

  if (!email) {
    errors.email = 'Email name is required';
  }

  if (email && !validateEmail(email)) {
    errors.email = 'Email is not valid';
  }

  if (!password) {
    errors.password = 'password is required';
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "password doesn't match";
  }

  return errors;
};

@form({ validate })
@observer
class RegisterForm extends InjectedComponent<FormProps> {
  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(AuthStore.register);

  render() {
    const { formError, invalid, submitting } = this.injectedProps;

    return (
      <KeyboardAwareScrollView>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="User name"
          name="userName"
          nextFocusTo="email"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="Email"
          name="email"
          nextFocusTo="password"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="Password"
          name="password"
          nextFocusTo="passwordConfirm"
          secureTextEntry
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="Confirm password"
          name="passwordConfirm"
          onSubmitEditing={this._onSubmitButtonPress}
          secureTextEntry
        />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid}
            loading={submitting}
            onPress={this._onSubmitButtonPress}
            title="Register"
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default RegisterForm;
