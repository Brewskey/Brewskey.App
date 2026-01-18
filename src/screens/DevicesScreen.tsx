import * as React from 'react';
import { useEffect } from 'react';
import { AppState, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import ErrorScreen from '../common/ErrorScreen';
import { CloudDeviceDAO } from '@brewskey/js-api';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import SectionContent from '../common/SectionContent';

import Container from '../common/Container';
import Section from '../common/Section';
import Header from '../common/Header';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import NuxNoEntity from '../components/NuxNoEntity';
import DevicesList from '../components/DevicesList';

const DevicesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const onAppStateChange = (appState: string) => {
    if (appState === 'active') {
      CloudDeviceDAO.startOnlineStatusListener();
    } else {
      CloudDeviceDAO.stopOnlineStatusListener();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    CloudDeviceDAO.startOnlineStatusListener();

    return () => {
      subscription.remove();
      CloudDeviceDAO.stopOnlineStatusListener();
    };
  }, []);

  const onWifiSetupButtonPress = () => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'devices',
        params: {
          screen: 'wifiSetup',
          params: {},
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  const renderListHeader = ({
    isEmpty,
    isLoading,
  }: {
    isEmpty: boolean;
    isLoading: boolean;
  }): React.ReactElement => {
    if (isEmpty || isLoading) {
      return <View />;
    }
    return (
      <Section bottomPadded>
        <SectionContent paddedHorizontal paddedVertical>
          <Button
            onPress={onWifiSetupButtonPress}
            title="Setup WiFi on Brewskey box"
          />
        </SectionContent>
      </Section>
    );
  };

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="add"
            screen="LoggedInStack"
            params={{
              screen: 'menu',
              params: {
                screen: 'devices',
                params: {
                  screen: 'wifiSetup',
                  params: { forNewDevice: true },
                },
              },
            }}
          />
        }
        showBackButton
        title="Devices"
      />
      <DevicesList
        ListEmptyComponent={NuxNoEntity}
        renderListHeader={renderListHeader}
      />
    </Container>
  );
};

export default withErrorBoundary(DevicesScreen, <ErrorScreen showBackButton />);
