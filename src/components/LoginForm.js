// @flow

import type FormField from '../containers/FormField';

import * as React from 'react';
import { observer } from 'mobx-react';
import { Text, View } from 'react-native';
import {
  Button,
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';

type Props = {|
  loginError: ?string,
  onSubmit: () => void,
  passwordField: FormField,
  submitting: boolean,
  userNameField: FormField,
|};

@observer
class LoginForm extends React.Component<Props> {
  passwordFieldRef: ?React.Element<*>;

  onUserNameSubmit = () => {
    if (this.passwordFieldRef) {
      this.passwordFieldRef.focus();
    }
  };

  render(): React.Element<*> {
    const {
      loginError,
      onSubmit,
      passwordField,
      submitting,
      userNameField,
    } = this.props;

    return (
      <View>
        <FormLabel>User name</FormLabel>
        <FormInput
          disabled={submitting}
          onBlur={userNameField.onBlur}
          onChangeText={userNameField.onChange}
          onSubmitEditing={this.onUserNameSubmit}
          value={userNameField.value}
        />
        <FormValidationMessage>{userNameField.error}</FormValidationMessage>
        <FormLabel>Password</FormLabel>
        <FormInput
          disabled={submitting}
          onBlur={passwordField.onBlur}
          onChangeText={passwordField.onChange}
          onSubmitEditing={onSubmit}
          ref={(passwordFieldRef: React.Element<*>) => {
            this.passwordFieldRef = passwordFieldRef;
          }}
          secureTextEntry
          value={passwordField.value}
        />
        <FormValidationMessage>{passwordField.error}</FormValidationMessage>
        <FormValidationMessage>{loginError}</FormValidationMessage>
        <Button
          disabled={
            submitting || !!passwordField.error || !!userNameField.error
          }
          title="login"
          onPress={onSubmit}
        />
      </View>
    );
  }
}

export default LoginForm;
