// @flow

import type { EntityID, FlowSensor, Permission, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { Dimensions } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import {
  FlowSensorStore,
  PermissionStore,
  TapStore,
} from '../stores/DAOStores';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import WarningNotification from '../common/WarningNotification';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapDetailsKegScreen from './TapDetailsKegScreen';
import TapDetailsStatsScreen from './TapDetailsStatsScreen';
import TapDetailsLeaderboardScreen from './TapDetailsLeaderboardScreen';
import theme from '../theme';
import { checkCanEdit } from '../permissionHelpers';
import createTopTabNavigator from '../components/hoc/createTopTabNavigator';

/* eslint-disable sorting/sort-object-props */
const tabScreens = {
  tapDetailsKeg: { screen: TapDetailsKegScreen },
  tapDetailsStats: {
    getShouldShowTab: ({ tap }) => !tap.hideStats,
    screen: TapDetailsStatsScreen,
  },
  tapDetailsLeaderboard: {
    getShouldShowTab: ({ tap }) => !tap.hideLeaderboard,
    screen: TapDetailsLeaderboardScreen,
  },
};
/* eslint-enable */

const TapDetailsNavigator = createTopTabNavigator(tabScreens, {
  ...theme.tabBar,
  initialLayout: {
    height: 0,
    width: Dimensions.get('window').width,
  },
  lazy: true,
  swipeEnabled: false,
});

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  static router = TapDetailsNavigator.router;

  @computed
  get _tapDataLoader(): LoadObject<[Tap, ?Permission, FlowSensor]> {
    const { id } = this.injectedProps;
    return LoadObject.merge([
      TapStore.getByID(id),
      PermissionStore.getForEntityByID('tap', id),
      FlowSensorStore.getSingle({
        filters: [DAOApi.createFilter('tap/id').equals(id)],
      }),
    ]);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._tapDataLoader}
        loadingComponent={LoadingComponent}
        navigation={this.injectedProps.navigation}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header showBackButton title="Tap" />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {
  navigation: Navigation,
  value: [Tap, ?Permission, ?FlowSensor],
};

@observer
class LoadedComponent extends React.Component<LoadedComponentProps> {
  _onNoFlowSensorWarningPress = () => {
    const { navigation, value } = this.props;
    const [tap] = value;

    navigation.navigate('newFlowSensor', {
      returnOnFinish: true,
      showBackButton: true,
      tapId: tap.id,
    });
  };

  render() {
    const { navigation, value } = this.props;
    const [tap, tapPermission, flowSensor] = value;
    const { id } = tap;

    const noFlowSensorWarning =
      !flowSensor && checkCanEdit(tapPermission) ? (
        <WarningNotification
          message="You haven't setup flow sensor on the tap. Click to setup."
          onPress={this._onNoFlowSensorWarningPress}
        />
      ) : null;

    return (
      <Container>
        <Header
          rightComponent={
            !checkCanEdit(tapPermission) ? null : (
              <HeaderNavigationButton
                name="edit"
                params={{ id }}
                toRoute="editTap"
              />
            )
          }
          showBackButton
          title="Tap"
        />
        <TapDetailsNavigator
          navigation={navigation}
          screenProps={{
            noFlowSensorWarning,
            tap,
            tapPermission,
          }}
        />
      </Container>
    );
  }
}

export default TapDetailsScreen;
