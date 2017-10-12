// @flow

import type AuthStore from '../stores/AuthStore';
import type { FormChildProps, FormFieldChildProps } from '../common/form/types';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Keyboard, View } from 'react-native';
import {
  Button,
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';
import Form from '../common/form/Form';
import FormField from '../common/form/FormField';

const validate = (values: UserCreadentials): { [key: string]: string } => {
  const errors = {};
  if (!values.userName) {
    errors.userName = 'User name is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

type Props = {|
  authStore: AuthStore,
|};

@inject('authStore')
@observer
class LoginForm extends React.Component<Props> {
  passwordFieldRef: ?React.Element<*>;

  onUserNameSubmit = () => {
    if (this.passwordFieldRef) {
      this.passwordFieldRef.focus();
    }
  };

  onSubmit = async (formValues: Object): Promise<void> => {
    Keyboard.dismiss();
    await this.props.authStore.login(formValues);
  };

  render(): React.Element<*> {
    return (
      <Form validate={validate}>
        {({
          formError,
          handleSubmit,
          invalid,
          submitting,
        }: FormChildProps): React.Element<any> => (
          <View>
            <FormField name="userName">
              {({
                error,
                onBlur,
                onChange,
                value,
              }: FormFieldChildProps): React.Element<*> => (
                <View>
                  <FormLabel>User name</FormLabel>
                  <FormInput
                    onBlur={onBlur}
                    onSubmitEditing={this.onUserNameSubmit}
                    onChangeText={onChange}
                    value={value}
                  />
                  <FormValidationMessage>{error}</FormValidationMessage>
                </View>
              )}
            </FormField>
            <FormField name="password">
              {({
                error,
                onBlur,
                onChange,
                value,
              }: FormFieldChildProps): React.Element<*> => (
                <View>
                  <FormLabel>Password</FormLabel>
                  <FormInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    ref={(ref: React.Element<*>) => {
                      this.passwordFieldRef = ref;
                    }}
                    secureTextEntry
                    value={value}
                  />
                  <FormValidationMessage>{error}</FormValidationMessage>
                </View>
              )}
            </FormField>
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid}
              onPress={(): Promise<void> => handleSubmit(this.onSubmit)}
              title="Log in"
            />
          </View>
        )}
      </Form>
    );
  }
}

export default LoginForm;
