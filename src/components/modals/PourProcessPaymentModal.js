// @flow

import type { Tap } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import Button from '../../common/buttons/Button';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import { ListItem as RNEListItem } from 'react-native-elements';
import NavigationService from '../../NavigationService';
import PourProcessStore from '../../stores/PourProcessStore';
import PourPaymentStore from '../../stores/PourPaymentStore';
import LoadingIndicator from '../../common/LoadingIndicator';
import CenteredModal from './CenteredModal';
import { COLORS } from '../../theme';
import nullthrows from 'nullthrows';

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
    flexDirection: 'column',
    maxHeight: 400,
  },
  copy: {
    color: COLORS.textInverse,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    width: '100%',
  },
  headerText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    height: 120,
  },
  scrollView: {
    flexGrow: 1,
    width: '100%',
  },
});

@observer
class PourProcessPaymentModal extends React.Component<{||}> {
  _store = new PourPaymentStore(nullthrows(PourProcessStore.deviceID));

  _onContinuePress = () => {
    if (this._store.hasCreditCardDetails) {
      // continue normal payment
      PourProcessStore.startPaymentPour();
    } else {
      PourProcessStore.onHideModal();
      NavigationService.navigate('payments');
    }
  };

  render(): React.Node {
    const { isVisible, onHideModal } = PourProcessStore;

    const tapsLoader = this._store.tapsWithPaymentEnabled;
    const isLoading = tapsLoader.isLoading();
    const taps = tapsLoader.getValue() || [];

    const { hasCreditCardDetails } = this._store;
    const buttonText = hasCreditCardDetails ? 'Continue' : 'Add Payment Info';

    return (
      <CenteredModal
        contentContainerStyle={{ padding: 0 }}
        header={<Text style={styles.headerText}>Brewskey Payments</Text>}
        isVisible={isVisible}
        onHideModal={onHideModal}
        width="90%"
      >
        {isLoading ? (
          <LoadingIndicator
            activitySize="large"
            color="white"
            style={styles.loadingIndicator}
          />
        ) : (
          <View style={styles.content}>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.copy}>
                {taps.length > 1 ? 'These taps have' : 'This tap has'} payments
                enabled.
              </Text>
              {!hasCreditCardDetails ? null : (
                <Text style={styles.copy}>
                  Click Continue to start pouring.
                </Text>
              )}
            </View>
            <ScrollView
              contentContainerStyle={{ padding: 8 }}
              style={styles.scrollView}
            >
              <View style={{ flex: 1 }}>
                {taps.map((tap) => (
                  <TapPayment key={tap.id} tap={tap} />
                ))}
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Button
                containerStyle={{ marginLeft: 0, width: '100%' }}
                onPress={this._onContinuePress}
                raised
                secondary
                title={buttonText}
              />
            </View>
          </View>
        )}
      </CenteredModal>
    );
  }
}

type TapPaymentProps = {|
  tap: Tap,
|};

const tapStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
  },
  subtitle: { color: COLORS.textFaded },
  title: { color: COLORS.text },
});

@observer
class TapPayment extends React.Component<TapPaymentProps> {
  render(): React.Node {
    const pricePerOunce = 0;
    const { currentKeg, id, tapNumber } = this.props.tap;
    const { beverage } = currentKeg;
    return (
      <RNEListItem
        leftAvatar={<BeverageAvatar beverageId={beverage.id} />}
        containerStyle={tapStyles.container}
        chevron={false}
        key={id}
        title={`Tap ${tapNumber} - ${beverage.name}`}
        titleStyle={tapStyles.title}
        subtitle={`$${(pricePerOunce * 12).toFixed(
          2,
        )} for 12 ounces — $${pricePerOunce.toFixed(2)} per ounce`}
        subtitleStyle={tapStyles.subtitle}
      />
      // <View>
      //   <Text style={styles.smallText}>
      //     Tap {tapNumber} - {currentKeg.beverage.name}
      //   </Text>
      //   <Text style={styles.smallText}>
      //     ${pricePerOunce.toFixed(2)} per ounce
      //   </Text>
      //   <Text style={styles.smallText}>
      //     ${(pricePerOunce * 12).toFixed(2)} for a 12 ounce cup.
      //   </Text>
      // </View>
    );
  }
}

export default PourProcessPaymentModal;
