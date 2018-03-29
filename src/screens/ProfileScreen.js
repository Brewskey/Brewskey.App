// @flow

import type { Account, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import theme from '../theme';
import { observer } from 'mobx-react/native';
import { AccountStore } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import ProfileOverviewScreen from './ProfileOverviewScreen';
import ProfileStatsScreen from './ProfileStatsScreen';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

/* eslint-disable sorting/sort-object-props */
const ProfileNavigator = TabNavigator(
  {
    profileOverview: { screen: ProfileOverviewScreen },
    profileStats: { screen: ProfileStatsScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
  },
);

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class ProfileScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { id } = this.injectedProps;
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={AccountStore.getByID(id)}
        loadingComponent={LoadingComponent}
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

type LoadedComponentProps = {|
  value: Account,
|};

const LoadedComponent = ({ value }: LoadedComponentProps) => (
  <Container>
    <Header showBackButton title={value.userName} />
    <ProfileNavigator screenProps={{ account: value }} />
  </Container>
);

LoadedComponent.router = ProfileNavigator.router;

export default ProfileScreen;
