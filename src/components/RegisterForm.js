// @flow

import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import AuthStore from '../stores/AuthStore';
import InjectedComponent from '../common/InjectedComponent';
import { FormValidationMessage } from 'react-native-elements';
import { form, FormField } from '../common/form';
import SectionContent from '../common/SectionContent';
import TextField from '../components/TextField';
import Button from '../common/buttons/Button';
import { validateEmail } from '../utils';

export type RegisterFormFields = {|
  email: string,
  password: string,
  userName: string,
|};

const validate = ({
  email,
  password,
  userName,
}: RegisterFormFields): { [key: string]: string } => {
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

  if (password && password.length < 6) {
    errors.password = 'password should be at least 6 characters long';
  }

  return errors;
};

@form({ validate })
@observer
class RegisterForm extends InjectedComponent<FormProps> {
  _onSubmit = async (values: RegisterFormFields): Promise<void> => {
    await DAOApi.Auth.register(values);
    const { password, userName } = values;
    await AuthStore.login({ password, userName });
  };

  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(this._onSubmit);

  render(): React.Node {
    const { formError, invalid, submitting } = this.injectedProps;

    return (
      <View>
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
      </View>
    );
  }
}

export default RegisterForm;
