import type { EmitterSubscription } from 'react-native';

import * as React from 'react';
import { AppState } from 'react-native';

import ErrorScreen from '../common/ErrorScreen';
import DAOApi from '@brewskey/js-api';
import { errorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';

import Container from '../common/Container';
import Section from '../common/Section';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import NuxNoEntity from '../components/NuxNoEntity';
import DevicesList from '../components/DevicesList';

type InjectedProps = {
  navigation: Navigation;
};

@errorBoundary(<ErrorScreen showBackButton />)
class DevicesScreen extends InjectedComponent<InjectedProps> {
  _subscription: EmitterSubscription | null | undefined = null;
  componentDidMount() {
    this._subscription = AppState.addEventListener(
      'change',
      this._onAppStateChange,
    );
    DAOApi.CloudDeviceDAO.flushCache();
    DAOApi.CloudDeviceDAO.startOnlineStatusListener();
  }

  componentWillUnmount() {
    this._subscription.remove();
    DAOApi.CloudDeviceDAO.stopOnlineStatusListener();
  }

  _onAppStateChange = (appState) => {
    if (appState === 'active') {
      DAOApi.CloudDeviceDAO.startOnlineStatusListener();
    } else {
      DAOApi.CloudDeviceDAO.stopOnlineStatusListener();
    }
  };

  _onWifiSetupButtonPress = () =>
    this.injectedProps.navigation.navigate('wifiSetup');

  _renderListHeader = ({
    isEmpty,
    isLoading,
  }: {
    isEmpty: boolean;
    isLoading: boolean;
  }): React.ReactElement =>
    isEmpty || isLoading ? null : (
      <Section bottomPadded>
        <SectionContent paddedHorizontal paddedVertical>
          <Button
            onPress={this._onWifiSetupButtonPress}
            title="Setup WiFi on Brewskey box"
          />
        </SectionContent>
      </Section>
    );

  render(): React.ReactElement {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton
              name="add"
              params={{ forNewDevice: true }}
              toRoute="wifiSetup"
            />
          }
          showBackButton
          title="Devices"
        />
        <DevicesList
          ListEmptyComponent={NuxNoEntity}
          renderListHeader={this._renderListHeader}
        />
      </Container>
    );
  }
}

export default DevicesScreen;
