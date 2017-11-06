// @flow

import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../../common/flatNavigationParamsAndScreenProps';
import { FormField } from '../../common/form';
import TextField from '../TextField';

type InjectedProps = {|
  navigation: Object,
  ...FormProps,
|};

@flatNavigationParamsAndScreenProps
@observer
class StepParticleId extends InjectedComponent<InjectedProps> {
  _onContinueButtonPress = (): void =>
    this.injectedProps.navigation.navigate('stepDeviceFields');

  render() {
    const particleIdFieldError = this.injectedProps.getFieldError('particleId');
    const particleIdFieldTouched = this.injectedProps.getFieldTouched(
      'particleId',
    );

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
