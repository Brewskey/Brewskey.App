// @flow

import type { FormProps } from '../../../common/form/types';
import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { View } from 'react-native';
import { FormValidationMessage } from 'react-native-elements';
import injectedComponent from '../../../common/InjectedComponent';
import { observer } from 'mobx-react/native';
import { form, FormField } from '../../../common/form';
import SimplePicker from '../../../components/pickers/SimplePicker';
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
      <View>
        <FormField component={TextField} label="SSID" name="ssid" />
        <FormField
          component={SimplePicker}
          label="Security"
          name="security"
          headerTitle="Select Wifi Security"
          pickerValues={Object.entries(WIFI_SECURITIES).map(
            ([name, value]: [any, any]) => ({ label: name, value }),
          )}
        />
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
      </View>
    );
  }
}

export default HiddenWifiForm;
