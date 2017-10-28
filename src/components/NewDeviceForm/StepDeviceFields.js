// @flow

import type { FormChildProps } from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../../common/flatNavigationParamsAndScreenProps';
import DeviceBaseFormFields from '../DeviceBaseFormFields';

type Props = {|
  navigation: Object,
  ...FormChildProps,
|};

@flatNavigationParamsAndScreenProps
@observer
class StepDeviceFields extends React.Component<Props> {
  _onCreateButtonPress = (): Promise<void> =>
    this.props.handleSubmit(this.props.onSubmit);

  render(): React.Node {
    return (
      <View>
        <DeviceBaseFormFields {...this.props} />
        <FormValidationMessage>{this.props.formError}</FormValidationMessage>
        <Button
          title="Create brewskey box"
          onPress={this._onCreateButtonPress}
        />
      </View>
    );
  }
}

export default StepDeviceFields;
