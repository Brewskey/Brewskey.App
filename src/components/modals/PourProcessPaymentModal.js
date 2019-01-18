// @flow

import type { Tap } from 'brewskey.js-api';

import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import PourProcessStore from '../../stores/PourProcessStore';
import PourPaymentStore from '../../stores/PourPaymentStore';
import LoadingIndicator from '../../common/LoadingIndicator';
import CenteredModal from './CenteredModal';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  headerText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    height: 120,
  },
  root: {
    alignItems: 'center',
    maxHeight: '50%',
    width: 290,
  },
  scrollView: {
    flexGrow: 0,
  },
  smallText: {
    color: COLORS.textInverse,
    fontSize: 12,
    marginTop: 12,
  },
});

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
          <ScrollView style={styles.scrollView}>
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
                {taps.map(tap => (
                  <TapPayment key={tap.id} tap={tap} />
                ))}
                {taps.map(tap => (
                  <TapPayment key={tap.id} tap={tap} />
                ))}
                {taps.map(tap => (
                  <TapPayment key={tap.id} tap={tap} />
                ))}
              </>
            )}
          </ScrollView>
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

export default PourProcessPaymentModal;
