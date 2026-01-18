import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import TapsList from '../components/TapsList';
import OverviewItem from '../common/OverviewItem2';
import DeviceStateOverviewItem from '../components/DeviceStateOverviewItem';
import DeviceOnlineOverviewItem from '../components/DeviceOnlineOverviewItem';
import Container from '../common/Container';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import { StaticScreenProps, useNavigation, NavigationProp } from '@react-navigation/native';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import { useGetDeviceById } from '../hooks/queries/DeviceQueries';

type Props = StaticScreenProps<{
  id: EntityID;
}>;

export const DeviceDetailsScreen: React.FC<Props> = withErrorBoundary(
  ({
    route: {
      params: { id: deviceId },
    },
  }: Props) => {
    const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
    const { data: device, isLoading, refetch } = useGetDeviceById(deviceId);

    const onAddTapPress = () => {
      if (device) {
        navigation.navigate('LoggedInStack', {
          screen: 'home',
          params: {
            screen: 'newTap',
            params: {
              initialValues: { device },
            },
          },
        });
      }
    };

    if (isLoading || !device) {
      return (
        <Container>
          <Header showBackButton />
          <LoadingIndicator />
        </Container>
      );
    }

    return (
      <Container>
        <Header
          rightComponent={
          <HeaderNavigationButton
            name="edit"
            screen="LoggedInStack"
            params={{
              screen: 'menu',
              params: {
                screen: 'devices',
                params: {
                  screen: 'editDevice',
                  params: { id: device.id },
                },
              },
            }}
          />
          }
          showBackButton
          title={device.name}
        />
        <TapsList
          ListHeaderComponent={
            <Container>
              <Section bottomPadded>
                <OverviewItem title="Box ID" value={device.particleId} />
                <DeviceStateOverviewItem deviceState={device.deviceStatus} />
                <DeviceOnlineOverviewItem particleID={device.particleId} />
              </Section>
              <SectionHeader title="Taps" />
            </Container>
          }
          onAddTapPress={onAddTapPress}
          onRefresh={refetch}
          queryOptions={{
            filters: [createFilter('device/id').equals(deviceId)],
          }}
        />
      </Container>
    );
  },
  <ErrorScreen showBackButton />,
);

export default DeviceDetailsScreen;
