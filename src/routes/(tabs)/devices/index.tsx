import * as React from 'react';
import { useEffect } from 'react';

import { CloudDeviceDAO } from '@brewskey/js-api';
import { useRouter } from 'expo-router';
import { AppState, View } from 'react-native';

import Button from '../../../common/buttons/Button';
import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import Section from '../../../common/Section';
import SectionContent from '../../../common/SectionContent';
import DevicesList from '../../../components/DevicesList';
import NuxNoEntity from '../../../components/NuxNoEntity';
import { useAuthSession } from '../../../hooks/context/AuthContext';

const DevicesScreen: React.FC = () => {
  const router = useRouter();
  const { data: authResponse } = useAuthSession();

  const onAppStateChange = (appState: string) => {
    if (appState === 'active' && authResponse) {
      CloudDeviceDAO.startOnlineStatusListener();
    } else {
      CloudDeviceDAO.stopOnlineStatusListener();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    // Only start listener if authenticated
    if (authResponse) {
      CloudDeviceDAO.startOnlineStatusListener();
    }

    return () => {
      subscription.remove();
      CloudDeviceDAO.stopOnlineStatusListener();
    };
  }, [authResponse]);

  const onWifiSetupButtonPress = () => {
    router.navigate({
      pathname: '/(tabs)/devices/new',
      params: { wifiSetup: 'true' },
    });
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
        showBackButton
        testID="header-brewskey-boxes"
        title="Devices"
        rightComponent={
          <HeaderNavigationButton
            name="add"
            testID="button-add-device"
            href={{
              pathname: '/(tabs)/devices/new',
              params: { forNewDevice: 'true' },
            }}
          />
        }
      />
      <DevicesList
        ListEmptyComponent={NuxNoEntity}
        renderListHeader={renderListHeader}
      />
    </Container>
  );
};

export default withErrorBoundary(
  DevicesScreen,
  <ErrorScreen shouldShowBackButton />,
);
