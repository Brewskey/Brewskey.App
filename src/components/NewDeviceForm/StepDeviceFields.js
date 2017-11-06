// @flow

import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { View } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../../common/flatNavigationParamsAndScreenProps';
import DeviceBaseFormFields from '../DeviceBaseFormFields';

type InjectedProps = {|
  navigation: Object,
  ...FormProps,
|};

@flatNavigationParamsAndScreenProps
@observer
class StepDeviceFields extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <View>
        <DeviceBaseFormFields {...this.injectedProps} />
        <FormValidationMessage>
          {this.injectedProps.formError}
        </FormValidationMessage>
        <Button
          title="Create brewskey box"
          onPress={this.injectedProps.handleSubmit}
        />
      </View>
    );
  }
}

export default StepDeviceFields;
