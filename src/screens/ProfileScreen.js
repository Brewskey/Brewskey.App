// @flow

import type { Account, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import theme from '../theme';
import { observer } from 'mobx-react';
import { AccountStore } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import ProfileOverviewScreen from './ProfileOverviewScreen';
import ProfileStatsScreen from './ProfileStatsScreen';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

/* eslint-disable sorting/sort-object-props */
const ProfileRouter = TabNavigator(
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
|};

@flatNavigationParamsAndScreenProps
@observer
class ProfileScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { id = '68ae3ba1-7841-4273-8d4b-0fb4fa6ed3ca' } = this.injectedProps;
    return (
      <LoaderComponent
        loader={AccountStore.getByID(id)}
        loadedComponent={LoadedComponent}
        loadingComponent={LoadingComponent}
      />
    );
  }
}

const LoadingComponent = () => (
  <Container>
    <Header />
    <LoadingIndicator />
  </Container>
);

type LoadedComponentProps = {|
  value: Account,
|};

const LoadedComponent = ({ value }: LoadedComponentProps) => (
  <Container>
    <Header title={value.userName} />
    <ProfileRouter screenProps={{ account: value }} />
  </Container>
);

export default ProfileScreen;
