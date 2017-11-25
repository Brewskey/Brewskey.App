// @flow

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react';
import * as Progress from 'react-native-progress';
import NFCStore from '../../stores/NFCStore';
import CenteredModal from './CenteredModal';
import theme from '../../theme';

const style = StyleSheet.create({
  buttonContainer: { width: '100%' },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1d5f68',
    color: 'white',
    marginVertical: 12,
    textAlign: 'center',
    width: '85%',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  root: {
    alignItems: 'center',
    width: 200,
  },
  smallText: {
    color: 'white',
    fontSize: 12,
    marginTop: 12,
  },
});

@observer
class NFCModal extends Component<{}> {
  _formatText = () => NFCStore.currentSeconds;

  render() {
    const { currentSeconds, isVisible, onHideModal } = NFCStore;
    return (
      <CenteredModal
        header={<Text style={style.headerText}>Tap phone to pour</Text>}
        onHideModal={onHideModal}
        isVisible={isVisible}
      >
        <View style={style.root}>
          <View style={style.progressContainer}>
            <Progress.Circle
              borderWidth={0}
              color="#fa0"
              formatText={this._formatText}
              progress={currentSeconds / 30}
              showsText
              size={120}
              textStyle={style.progressText}
              thickness={16}
              unfilledColor="#1d5f68"
              width={120}
            />
          </View>
          <Text style={style.smallText}>or enter a code</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            keyboardType="numeric"
            maxLength={6}
            style={style.input}
          />
          <View style={style.buttonContainer}>
            <Button {...theme.button.white} title="Start Pour" />
          </View>
        </View>
      </CenteredModal>
    );
  }
}

export default NFCModal;
