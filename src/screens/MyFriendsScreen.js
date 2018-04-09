// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { TabNavigator } from 'react-navigation';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';
import MyFriendsContactScreen from './MyFriendsContactScreen';
import theme from '../theme';

/* eslint-disable sorting/sort-object-props */
const MyFriendsNavigator = TabNavigator(
  {
    myFriendsMain: { screen: MyFriendsMainScreen },
    myFriendsRequest: { screen: MyFriendsRequestScreen },
    myFriendsContact: { screen: MyFriendsContactScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
  },
);

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsScreen extends InjectedComponent<InjectedProps> {
  static router = MyFriendsNavigator.router;

  render() {
    return (
      <Container>
        <Header showBackButton title="Friends" />
        <MyFriendsNavigator navigation={this.injectedProps.navigation} />
      </Container>
    );
  }
}

export default MyFriendsScreen;
