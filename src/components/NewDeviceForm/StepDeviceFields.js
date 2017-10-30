// @flow

import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../../common/flatNavigationParamsAndScreenProps';
import DeviceBaseFormFields from '../DeviceBaseFormFields';

type Props = {|
  navigation: Object,
  ...FormProps,
|};

@flatNavigationParamsAndScreenProps
@observer
class StepDeviceFields extends React.Component<Props> {
  render(): React.Node {
    return (
      <View>
        <DeviceBaseFormFields {...this.props} />
        <FormValidationMessage>{this.props.formError}</FormValidationMessage>
        <Button title="Create brewskey box" onPress={this.props.handleSubmit} />
      </View>
    );
  }
}

export default StepDeviceFields;
