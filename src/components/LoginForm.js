// @flow

import type { FormProps } from '../common/form/types';
import type { UserCredentials } from 'brewskey.js-api';

import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import InjectedComponent from '../common/InjectedComponent';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { FormField, form } from '../common/form';
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

type InjectedProps = {|
  ...FormProps,
  isInverse: boolean,
  onSubmit: (values: any) => void,
|};

@form({ validate })
@observer
class LoginForm extends InjectedComponent<InjectedProps> {
  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(this.injectedProps.onSubmit);

  render(): React.Node {
    const { formError, invalid, isInverse, submitting } = this.injectedProps;
    return (
      <View>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={isInverse ? styles.input : undefined}
          label="User name"
          labelStyle={isInverse ? styles.label : undefined}
          name="userName"
          nextFocusTo="password"
          selectionColor={isInverse ? COLORS.textInverse : undefined}
          underlineColorAndroid={isInverse ? COLORS.secondary : undefined}
          validationTextStyle={styles.validationText}
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          inputStyle={isInverse ? styles.input : null}
          label="Password"
          labelStyle={isInverse ? styles.label : null}
          name="password"
          onSubmitEditing={this._onSubmitButtonPress}
          secureTextEntry
          selectionColor={isInverse ? COLORS.textInverse : undefined}
          underlineColorAndroid={isInverse ? COLORS.secondary : undefined}
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
            secondary={isInverse}
            title="Log in"
          />
        </SectionContent>
      </View>
    );
  }
}

export default LoginForm;
