// @flow

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../common/buttons/Button';
import TouchableItem from '../../common/buttons/TouchableItem';
import { observer } from 'mobx-react/native';
import * as Progress from 'react-native-progress';
import PourProcessStore from '../../stores/PourProcessStore';
import CenteredModal from './CenteredModal';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  buttonContainer: { width: '100%' },
  enableNFCContainer: {
    marginBottom: 12,
  },
  enableNFCText: {
    color: COLORS.textInverse,
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  headerText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    color: COLORS.textInverse,
    marginVertical: 12,
    textAlign: 'center',
    width: '85%',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: { color: COLORS.textInverse, fontSize: 30, fontWeight: 'bold' },
  root: {
    alignItems: 'center',
    width: 200,
  },
  smallText: {
    color: COLORS.textInverse,
    fontSize: 12,
    marginTop: 12,
  },
});

@observer
class PourProcessModal extends Component<{}> {
  _formatText = () => PourProcessStore.currentSeconds;

  render() {
    const {
      currentSeconds,
      isNFCEnabled,
      isNFCSupported,
      isVisible,
      onHideModal,
    } = PourProcessStore;
    const headerText = isNFCEnabled
      ? 'Tap phone to pour'
      : 'Enter code to pour';

    return (
      <CenteredModal
        header={<Text style={styles.headerText}>{headerText}</Text>}
        onHideModal={onHideModal}
        isVisible={isVisible}
      >
        <View style={styles.root}>
          {isNFCSupported &&
            !isNFCEnabled && (
              <TouchableItem
                onPress={PourProcessStore.onEnableNFCPress}
                style={styles.enableNFCContainer}
              >
                <Text style={styles.enableNFCText}>
                  or press here to enable NFC on your device
                </Text>
              </TouchableItem>
            )}
          <View style={styles.progressContainer}>
            <Progress.Circle
              borderWidth={0}
              color="#fa0"
              formatText={this._formatText}
              progress={currentSeconds / 30}
              showsText
              size={120}
              textStyle={styles.progressText}
              thickness={16}
              unfilledColor="#1d5f68"
              width={120}
            />
          </View>
          {isNFCEnabled && (
            <Text style={styles.smallText}>or enter a code</Text>
          )}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            keyboardType="numeric"
            maxLength={6}
            selectionColor={COLORS.textInverse}
            underlineColorAndroid={COLORS.secondary}
            onChangeText={PourProcessStore.setTotp}
            onSubmitEditing={PourProcessStore.onPourPress}
            style={styles.input}
            value={PourProcessStore.totp}
          />
          <View style={styles.buttonContainer}>
            <Button
              onPress={PourProcessStore.onPourPress}
              secondary
              title="Start Pour"
            />
          </View>
        </View>
      </CenteredModal>
    );
  }
}

export default PourProcessModal;
