// @flow

import type {
  FormChildProps,
  FormFieldChildProps,
} from '../../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react';
import FormField from '../../common/form/FormField';
import TextField from '../TextField';

type Props = {|
  navigation: Object,
  ...FormChildProps,
|};

@observer
class StepParticleId extends React.Component<Props> {
  _onContinueButtonPress = (): void =>
    this.props.navigation.navigate('stepDeviceFields');

  render(): React.Node {
    return (
      <FormField name="particleId">
        {(formFieldProps: FormFieldChildProps): React.Node => (
          <View>
            <TextField label="Particle ID" {...formFieldProps} />
            <Button
              disabled={!!formFieldProps.error || !formFieldProps.touched}
              title="Continue"
              onPress={this._onContinueButtonPress}
            />
          </View>
        )}
      </FormField>
    );
  }
}

export default StepParticleId;
