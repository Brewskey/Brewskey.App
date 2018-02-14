// @flow

import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TextBlock from '../common/TextBlock';
import Button from '../common/buttons/Button';
import TextField from './TextField';
import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    textAlign: 'center',
  },
  expandText: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

type Props = {|
  onContinuePress: (particleID: string) => void,
|};

@observer
class ParticleIDInput extends React.Component<Props> {
  @observable _isExpanded: boolean = false;
  @observable _particleID: string = '';

  @action
  _setParticleID = (particleID: string) => {
    this._particleID = particleID;
  };

  @action
  _expand = () => {
    this._isExpanded = true;
  };

  _onContinuePress = () => this.props.onContinuePress(this._particleID);

  render() {
    return (
      <View>
        {!this._isExpanded ? (
          <TouchableOpacity onPress={this._expand}>
            <Text style={styles.expandText}>
              I know my internal Brewskey box ID
            </Text>
          </TouchableOpacity>
        ) : (
          [
            <TextBlock
              key="descriptionText"
              textStyle={styles.descriptionText}
              paddedBottom
            >
              Enter the hardware ID of your Brewskey box. We'll skip the WiFi
              setup for now but you'll still be able to setup your taps.
            </TextBlock>,
            <TextField
              key="particleIDInput"
              label="Internal ID"
              onChange={this._setParticleID}
              onSubmitEditing={this._onContinuePress}
              value={this._particleID}
            />,
            <Button
              key="continueButton"
              onPress={this._onContinuePress}
              title="Continue"
            />,
          ]
        )}
      </View>
    );
  }
}

export default ParticleIDInput;
