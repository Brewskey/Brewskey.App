// @flow

import type { FormProps } from '../common/form/types';

import { observer } from 'mobx-react/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InjectedComponent from '../common/InjectedComponent';
import SectionContent from '../common/SectionContent';
import Button from '../common/buttons/Button';
import { FormField, form } from '../common/form';
import { COLORS } from '../theme';
import TextField from './TextField';

const styles = StyleSheet.create({
  input: {
    color: COLORS.textInverse,
  },
  label: {
    color: COLORS.textInverse,
    textAlign: 'center',
  },
  validationText: {
    color: COLORS.danger2,
  },
});

export type FriendAddFormValues = {
  userName: string,
};

const validate = (values: FriendAddFormValues): { [key: string]: string } => {
  const errors = {};
  if (!values.userName) {
    errors.userName = 'User name or email is required';
  }

  return errors;
};

type InjectedProps = FormProps;

@form({ validate })
@observer
class FriendAddForm extends InjectedComponent<InjectedProps> {
  render() {
    const { formError, handleSubmit, invalid, submitting } = this.injectedProps;

    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          clearButtonMode="always"
          component={TextField}
          editable={!submitting}
          enablesReturnKeyAutomatically={false}
          inputStyle={styles.input}
          label="Enter user name or email"
          labelStyle={styles.label}
          name="userName"
          onSubmitEditing={handleSubmit}
          selectionColor={COLORS.textInverse}
          style={styles.input}
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
            onPress={handleSubmit}
            secondary
            title="Add Friend"
          />
        </SectionContent>
      </KeyboardAwareScrollView>
    );
  }
}

export default FriendAddForm;
