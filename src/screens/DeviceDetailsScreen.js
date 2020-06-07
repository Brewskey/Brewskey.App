// @flow

import type { Device, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import TapsList from '../components/TapsList';
import OverviewItem from '../common/OverviewItem2';
import DeviceStateOverviewItem from '../components/DeviceStateOverviewItem';
import DeviceOnlineOverviewItem from '../components/DeviceOnlineOverviewItem';
import { DeviceStore } from '../stores/DAOStores';
import Container from '../common/Container';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class DeviceDetailsScreen extends InjectedComponent<InjectedProps> {
  @computed
  get _deviceLoader(): LoadObject<Device> {
    return DeviceStore.getByID(this.injectedProps.id);
  }

  render(): React.Node {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._deviceLoader}
        loadingComponent={LoadingComponent}
        navigation={this.injectedProps.navigation}
        updatingComponent={LoadingComponent}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  navigation: Navigation,
  value: Device,
};

@observer
class LoadedComponent extends React.Component<LoadedComponentProps> {
  _onAddTapPress = () => {
    const { navigation, value } = this.props;
    navigation.navigate('newTap', { initialValues: { device: value } });
  };

  _onRefresh = () => {
    DeviceStore.flushCacheForEntity(this.props.value.id);
  };

  render(): React.Node {
    const {
      value: { deviceStatus, id, name, particleId },
    } = this.props;
    console.log(id);
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton
              name="edit"
              params={{ id }}
              toRoute="editDevice"
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
  }
}

export default DeviceDetailsScreen;
