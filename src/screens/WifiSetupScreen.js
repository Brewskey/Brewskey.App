// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { StackNavigator } from 'react-navigation';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import WifiSetupStore from '../stores/WifiSetupStore';
import Container from '../common/Container';
import Header from '../common/Header';
import WifiSetupStep1Screen from './WifiSetupStep1Screen';
import WifiSetupStep2Screen from './WifiSetupStep2Screen';
import WifiSetupStep3Screen from './WifiSetupStep3Screen';
import WifiSetupStep4Screen from './WifiSetupStep4Screen';

const WifiSetupNavigator = StackNavigator(
  {
    wifiSetupStep1: { screen: WifiSetupStep1Screen },
    wifiSetupStep2: { screen: WifiSetupStep2Screen },
    wifiSetupStep3: { screen: WifiSetupStep3Screen },
    wifiSetupStep4: { screen: WifiSetupStep4Screen },
  },
  { headerMode: 'none' },
);

type InjectedProps = {|
  forNewDevice?: boolean,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
class WifiSetupScreen extends InjectedComponent<InjectedProps> {
  static router = WifiSetupNavigator.router;

  _wifiSetupStore: WifiSetupStore;

  componentWillMount() {
    this._wifiSetupStore = new WifiSetupStore(this.injectedProps.navigation);
  }

  _onSetupFinish = () => {
    const { forNewDevice, navigation } = this.injectedProps;
    if (forNewDevice) {
      navigation.navigate('newDevice', {
        particleID: this._wifiSetupStore.particleID,
      });
    } else {
      navigation.goBack();
    }
  };

  render() {
    const { forNewDevice, navigation } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="WiFi Setup" />
        <WifiSetupNavigator
          navigation={navigation}
          screenProps={{
            forNewDevice,
            onSetupFinish: this._onSetupFinish,
            wifiSetupStore: this._wifiSetupStore,
          }}
        />
      </Container>
    );
  }
}

export default WifiSetupScreen;
