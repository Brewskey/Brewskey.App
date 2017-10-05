// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements';

class LoginForm extends React.Component {
  render(): React.Element<*> {
    const {
      loginError,
      onChangePassword,
      onChangeUserName,
      onSubmit,
      password,
      userName,
    } = this.props;

    return (
      <View>
        <FormLabel>User name</FormLabel>
        <FormInput onChangeText={onChangeUserName} value={userName} />
        <FormValidationMessage />
        <FormLabel>Password</FormLabel>
        <FormInput onChangeText={onChangePassword} value={password} />
        <FormValidationMessage>{loginError}</FormValidationMessage>
        <Button title="login" raised onPress={onSubmit} />
      </View>
    );
  }
}

export default LoginForm;
