// @flow

import type { FormProps } from '../common/form/types';
import type { UserCredentials } from '../AuthApi';

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InjectedComponent from '../common/InjectedComponent';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { FormField, form } from '../common/form';
import AuthStore from '../stores/AuthStore';
import { COLORS } from '../theme';
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

const styles = StyleSheet.create({
  input: {
    color: COLORS.textInverse,
  },
  label: {
    color: COLORS.textInverse,
  },
  validationText: {
    color: COLORS.danger2,
  },
});

type InjectedProps = FormProps;

@form({ validate })
@observer
class LoginForm extends InjectedComponent<InjectedProps> {
  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(AuthStore.login);

  render() {
    const { formError, invalid, submitting } = this.injectedProps;
    return (
      <KeyboardAwareScrollView>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={styles.input}
          label="User name"
          labelStyle={styles.label}
          name="userName"
          nextFocusTo="password"
          selectionColor={COLORS.textInverse}
          underlineColorAndroid={COLORS.secondary}
          validationTextStyle={styles.validationText}
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={styles.input}
          label="Password"
          labelStyle={styles.label}
          name="password"
          onSubmitEditing={this._onSubmitButtonPress}
          secureTextEntry
          selectionColor={COLORS.textInverse}
          underlineColorAndroid={COLORS.secondary}
          validationTextStyle={styles.validationText}
        />
        <FormValidationMessage labelStyle={styles.validationText}>
          {formError}
        </FormValidationMessage>
        <SectionContent paddedVertical>
          <Button
            disabled={submitting || invalid}
            loading={submitting}
            onPress={this._onSubmitButtonPress}
            title="Log in"
            secondary
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginForm;
