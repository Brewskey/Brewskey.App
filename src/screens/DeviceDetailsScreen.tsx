import type { Device, EntityID } from '@brewskey/js-api';

import * as React from 'react';

import DAOApi from '@brewskey/js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary, withErrorBoundary } from '../common/ErrorBoundary';
import TapsList from '../components/TapsList';
import OverviewItem from '../common/OverviewItem2';
import DeviceStateOverviewItem from '../components/DeviceStateOverviewItem';
import DeviceOnlineOverviewItem from '../components/DeviceOnlineOverviewItem';
import Container from '../common/Container';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import { LoaderComponent } from '../common/LoaderComponent';
import { useGetDeviceById } from '../hooks/queries/DeviceQueries';

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const LoadingComponent: React.FC = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  value: { device: Device };
  onRefresh: () => Promise<unknown>;
};
const LoadedComponent: React.FC<LoadedComponentProps> = ({ value }) => {
  const navigation = useNavigation();

  const onAddTapPress = () => {
    navigation.navigate('newTap', { initialValues: { device: value } });
  };

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            params={{ id: value.id }}
            toRoute="loggedIn"
          />
        }
        showBackButton
        title={name}
      />
      <TapsList
        ListHeaderComponent={
          <Container>
            <Section bottomPadded>
              <OverviewItem title="Box ID" value={particleId} />
              <DeviceStateOverviewItem deviceState={deviceStatus} />
              <DeviceOnlineOverviewItem particleID={particleId} />
            </Section>
            <SectionHeader title="Taps" />
          </Container>
        }
        onAddTapPress={this._onAddTapPress}
        onRefresh={this._onRefresh}
        queryOptions={{
          filters: [DAOApi.createFilter('device/id').equals(id)],
        }}
      />
    </Container>
  );
};

export const DeviceDetailsScreen: React.FC<Props> = withErrorBoundary(
  ({
    route: {
      params: { id: deviceId },
    },
  }: Props) => {
    const deviceQuery = useGetDeviceById(deviceId);
    const queries = { device: deviceQuery };
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        queries={queries}
        loadingComponent={LoadingComponent}
        componentProps={{ onRefresh: deviceQuery.refetch }}
      />
    );
  },
  <ErrorScreen showBackButton />,
);

export default DeviceDetailsScreen;
