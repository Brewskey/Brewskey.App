// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { TabNavigator } from 'react-navigation';
import theme from '../theme';
import Container from '../common/Container';
import Header from '../common/Header';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';
import MyFriendsContactScreen from './MyFriendsContactScreen';

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

class MyFriendsScreen extends InjectedComponent<InjectedProps> {
  static router = MyFriendsNavigator.router;

  render() {
    return (
      <Container>
        <Header title="Friends" />
        <MyFriendsNavigator navigation={this.injectedProps.navigation} />
      </Container>
    );
  }
}

export default MyFriendsScreen;
