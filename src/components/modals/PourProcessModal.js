// @flow

import type { Tap } from 'brewskey.js-api';

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import TouchableItem from '../../common/buttons/TouchableItem';
import { observer } from 'mobx-react/native';
import * as Progress from 'react-native-progress';
import PourProcessStore from '../../stores/PourProcessStore';
import PourPaymentStore from '../../stores/PourPaymentStore';
import LoadingIndicator from '../../common/LoadingIndicator';
import CenteredModal from './CenteredModal';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  enableNFCContainer: {
    marginBottom: 12,
  },
  enableNFCText: {
    color: COLORS.textInverse,
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: COLORS.danger2,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
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
  loadingIndicator: {
    height: 120,
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
  render() {
    return PourProcessStore.shouldShowPaymentScreen ? (
      <PourProcessPaymentModal />
    ) : (
      <PourProcessInputModal />
    );
  }
}

@observer
class PourProcessInputModal extends Component<{}> {
  _formatText = () => PourProcessStore.currentSeconds;

  render() {
    const {
      currentSeconds,
      isLoading,
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
          {isNFCSupported && !isNFCEnabled && (
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
            {isLoading ? (
              <LoadingIndicator
                activitySize="large"
                color="white"
                style={styles.loadingIndicator}
              />
            ) : (
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
            )}
          </View>
          {isNFCEnabled && (
            <Text style={styles.smallText}>or enter a code</Text>
          )}
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            clearButtonMode="always"
            editable={!PourProcessStore.isLoading}
            enablesReturnKeyAutomatically={false}
            keyboardType="numeric"
            maxLength={6}
            selectionColor={COLORS.textInverse}
            underlineColorAndroid={COLORS.secondary}
            onChangeText={PourProcessStore.setTotp}
            style={styles.input}
            value={PourProcessStore.totp}
          />
          <Text style={styles.errorText}>{PourProcessStore.errorText}</Text>
        </View>
      </CenteredModal>
    );
  }
}

@observer
class PourProcessPaymentModal extends Component<{}> {
  _store = new PourPaymentStore(PourProcessStore.deviceID);

  render() {
    const { isVisible, onHideModal } = PourProcessStore;
    const headerText = 'Brewskey Payments';

    const tapsLoader = this._store.tapsWithPaymentEnabled;
    const isLoading = tapsLoader.isLoading();
    const taps = tapsLoader.getValue() || [];

    return (
      <CenteredModal
        header={<Text style={styles.headerText}>{headerText}</Text>}
        isVisible={isVisible}
        onHideModal={onHideModal}
      >
        <View style={styles.root}>
          {isLoading ? (
            <LoadingIndicator
              activitySize="large"
              color="white"
              style={styles.loadingIndicator}
            />
          ) : (
            <>
              <Text style={styles.smallText}>
                {taps.length > 1 ? 'These taps' : 'This tap'} has payments
                enabled.
              </Text>
              {taps.map(tap => (
                <TapPayment key={tap.id} tap={tap} />
              ))}
            </>
          )}
        </View>
      </CenteredModal>
    );
  }
}

type TapPaymentProps = {|
  tap: Tap,
|};

@observer
class TapPayment extends Component<TapPaymentProps> {
  render() {
    const { currentKeg, pricePerOunce, tapNumber } = this.props.tap;
    return (
      <View>
        <Text style={styles.smallText}>
          Tap {tapNumber} - {currentKeg.beverage.name}
        </Text>
        <Text style={styles.smallText}>
          ${pricePerOunce.toFixed(2)} per ounce
        </Text>
        <Text style={styles.smallText}>
          ${(pricePerOunce * 12).toFixed(2)} for a 12 ounce cup.
        </Text>
      </View>
    );
  }
}

export default PourProcessModal;
