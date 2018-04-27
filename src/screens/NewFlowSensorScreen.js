// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import { FlowSensorStore, waitForLoaded } from '../stores/DAOStores';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import SnackBarStore from '../stores/SnackBarStore';

const DEFAULT_FLOW_SENSOR = {
  flowSensorType: 4,
  pulsesPerGallon: 5375,
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 30,
  },
  container: {
    paddingVertical: 30,
  },
});

type InjectedProps = {|
  navigation: Navigation,
  onTapSetupFinish?: (tapID: EntityID) => void | Promise<any>,
  returnOnFinish?: boolean,
  showBackButton?: boolean,
  tapId: EntityID,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class NewFlowSensorScreen extends InjectedComponent<InjectedProps> {
  _onDefaultButtonPress = async () => {
    const { tapId } = this.injectedProps;

    const clientID = DAOApi.FlowSensorDAO.post({
      ...DEFAULT_FLOW_SENSOR,
      tapId,
    });
    await waitForLoaded(() => FlowSensorStore.getByID(clientID));

    this._onFlowSensorCreated();
  };

  _onCustomButtonPress = () => {
    const { navigation, tapId } = this.injectedProps;
    navigation.navigate('newFlowSensorCustom', {
      onFlowSensorCreated: this._onFlowSensorCreated,
      tapId,
    });
  };

  _onFlowSensorCreated = () => {
    const {
      navigation,
      onTapSetupFinish,
      returnOnFinish,
      tapId,
    } = this.injectedProps;
    SnackBarStore.showMessage({ text: 'Flow sensor set' });

    if (returnOnFinish) {
      const resetRouteAction = NavigationActions.reset({
        actions: [
          NavigationActions.navigate({ routeName: 'taps' }),
          NavigationActions.navigate({
            params: { id: tapId },
            routeName: 'tapDetails',
          }),
        ],
        index: 1,
      });
      navigation.dispatch(resetRouteAction);
    } else {
      navigation.navigate('newKeg', { onTapSetupFinish, tapId });
    }
  };

  render() {
    return (
      <Container>
        <Header title="Setup flow sensor" />
        <View style={styles.container}>
          <Button
            containerViewStyle={styles.buttonContainer}
            onPress={this._onDefaultButtonPress}
            title="I got my sensor from Brewskey"
          />
          <Button
            onPress={this._onCustomButtonPress}
            title="I'd like to setup a different sensor"
          />
        </View>
      </Container>
    );
  }
}

export default NewFlowSensorScreen;
