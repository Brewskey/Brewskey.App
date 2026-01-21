import * as React from 'react';
import { useEffect } from 'react';
import { AppState, View } from 'react-native';
import { useRouter } from 'expo-router';

import ErrorScreen from '../../../common/ErrorScreen';
import { CloudDeviceDAO } from '@brewskey/js-api';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Button from '../../../common/buttons/Button';
import SectionContent from '../../../common/SectionContent';
import { useAuthSession } from '../../../hooks/context/AuthContext';

import Container from '../../../common/Container';
import Section from '../../../common/Section';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import NuxNoEntity from '../../../components/NuxNoEntity';
import DevicesList from '../../../components/DevicesList';

const DevicesScreen: React.FC = () => {
  const router = useRouter();
  const { authResponse } = useAuthSession();

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
    router.navigate('/(tabs)/devices/new?wifiSetup=true');
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
            href="/(tabs)/devices/new?forNewDevice=true"
            testID="button-add-device"
          />
        }
        showBackButton
        title="Devices"
        testID="header-brewskey-boxes"
      />
      <DevicesList
        ListEmptyComponent={NuxNoEntity}
        renderListHeader={renderListHeader}
      />
    </Container>
  );
};

export default withErrorBoundary(DevicesScreen, <ErrorScreen shouldShowBackButton />);
