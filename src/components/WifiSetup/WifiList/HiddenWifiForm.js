// @flow

import type { FormProps } from '../../../common/form/types';
import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import injectedComponent from '../../../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { form, FormField } from '../../../common/form';
import PickerField from '../../../common/PickerField';
import Button from '../../../common/buttons/Button';
import TextField from '../../../components/TextField';
import { WIFI_SECURITIES } from '../../../SoftApService';

export const validate = (values: WifiNetwork): { [key: string]: string } => {
  const errors = {};

  if (!values.ssid) {
    errors.ssid = 'SSID is Requried';
  }

  if (!values.security) {
    errors.security = 'Security is Requried';
  }

  return errors;
};

type Props = {|
  onSubmit: (values: WifiNetwork) => Promise<void>,
  error: ?Error,
|};

@form()
@observer
class HiddenWifiForm extends injectedComponent<FormProps, Props> {
  render() {
    const { error } = this.props;
    const {
      handleSubmit,
      invalid,
      pristine,
      submitting,
      values,
    } = this.injectedProps;

    return (
      <KeyboardAwareScrollView>
        <FormField component={TextField} label="SSID" name="ssid" />
        <FormField component={PickerField} label="Security" name="security">
          {Object.entries(WIFI_SECURITIES).map(
            ([name, value]: [any, any]): React.Node => (
              <PickerField.Item key={value} label={name} value={value} />
            ),
          )}
        </FormField>
        {values.security !== WIFI_SECURITIES.OPEN && (
          <FormField
            component={TextField}
            label="Password"
            name="password"
            secureTextEntry
          />
        )}
        {error && (
          <FormValidationMessage>{error.message}</FormValidationMessage>
        )}
        <Button
          disable={invalid || pristine || submitting}
          onPress={handleSubmit}
          title="Connect"
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default HiddenWifiForm;
