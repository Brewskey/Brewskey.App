// @flow

import type AuthStore from '../stores/AuthStore';
import type { FormChildProps, FormFieldChildProps } from '../common/form/types';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Keyboard, View } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import Form from '../common/form/Form';
import FormField from '../common/form/FormField';
import TextField from './TextField';

const validate = (values: UserCredentials): { [key: string]: string } => {
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
          pristine,
          submitting,
        }: FormChildProps): React.Element<any> => (
          <View>
            <FormField name="userName">
              {(formFieldProps: FormFieldChildProps): React.Element<*> => (
                <TextField
                  disabled={submitting}
                  label="User name"
                  onSubmitEditing={this.onUserNameSubmit}
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormField name="password">
              {(formFieldProps: FormFieldChildProps): React.Element<*> => (
                <TextField
                  disabled={submitting}
                  label="Password"
                  inputRef={(ref: React.Element<*>) => {
                    this.passwordFieldRef = ref;
                  }}
                  secureTextEntry
                  {...formFieldProps}
                />
              )}
            </FormField>
            <FormValidationMessage>{formError}</FormValidationMessage>
            <Button
              disabled={submitting || invalid || pristine}
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
