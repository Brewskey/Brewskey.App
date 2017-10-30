// @flow

import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../../common/flatNavigationParamsAndScreenProps';
import { FormField } from '../../common/form';
import TextField from '../TextField';

type Props = {|
  navigation: Object,
  ...FormProps,
|};

@flatNavigationParamsAndScreenProps
@observer
class StepParticleId extends React.Component<Props> {
  _onContinueButtonPress = (): void =>
    this.props.navigation.navigate('stepDeviceFields');

  render(): React.Node {
    const particleIdFieldError = this.props.getFieldError('particleId');
    const particleIdFieldTouched = this.props.getFieldTouched('particleId');

    return (
      <View>
        <FormField
          component={TextField}
          name="particleId"
          label="Particle ID"
        />
        <Button
          disabled={!particleIdFieldTouched || !!particleIdFieldError}
          title="Continue"
          onPress={this._onContinueButtonPress}
        />
      </View>
    );
  }
}

export default StepParticleId;
