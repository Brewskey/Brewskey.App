// @flow

import type { FormProps } from '../common/form/types';
import type { UserCredentials } from '../authApi';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import AuthStore from '../stores/AuthStore';
import { form, FormField } from '../common/form';
import TextField from './TextField';
import { COLORS } from '../theme';

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

const styles = StyleSheet.create({
  disabledButtonStyle: {
    backgroundColor: COLORS.primary,
  },
  disabledTextStyle: {
    color: COLORS.textFaded,
  },
  inputStyle: {
    color: COLORS.textInverse,
  },
  labelStyle: {
    color: COLORS.textInverse,
  },
});

type InjectedProps = FormProps;

@form({ validate })
@observer
class LoginForm extends InjectedComponent<InjectedProps> {
  _onSubmit = async (formValues: Object): Promise<void> => {
    await AuthStore.login(formValues);
  };

  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(this._onSubmit);

  render() {
    const { formError, invalid, pristine, submitting } = this.injectedProps;
    return (
      <KeyboardAwareScrollView>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={styles.inputStyle}
          label="User name"
          labelStyle={styles.labelStyle}
          name="userName"
          nextFocusTo="password"
          underlineColorAndroid={COLORS.secondary}
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={styles.inputStyle}
          label="Password"
          labelStyle={styles.labelStyle}
          name="password"
          onSubmitEditing={this._onSubmitButtonPress}
          secureTextEntry
          underlineColorAndroid={COLORS.secondary}
        />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            backgroundColor={COLORS.primary}
            disabled={submitting || invalid || pristine}
            disabledStyle={styles.disabledButtonStyle}
            disabledTextStyle={styles.disabledTextStyle}
            loading={submitting}
            onPress={this._onSubmitButtonPress}
            raised
            title="Log in"
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginForm;
