// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react/native';
import Container from '../common/Container';
import Section from '../common/Section';
import AuthStore from '../stores/AuthStore';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import DevicesList from '../components/DevicesList';

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class DevicesScreen extends InjectedComponent<InjectedProps> {
  _onWifiSetupButtonPress = () =>
    this.injectedProps.navigation.navigate('wifiSetup');

  render() {
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
          queryOptions={{
            filters: [
              DAOApi.createFilter('createdBy/id').equals(AuthStore.userID),
            ],
          }}
          ListHeaderComponent={
            <Section bottomPadded>
              <SectionContent paddedHorizontal paddedVertical>
                <Button
                  onPress={this._onWifiSetupButtonPress}
                  title="Setup WiFi on Brewskey box"
                />
              </SectionContent>
            </Section>
          }
        />
      </Container>
    );
  }
}

export default DevicesScreen;
