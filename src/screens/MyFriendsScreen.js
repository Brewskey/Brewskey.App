// @flow

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import theme from '../theme';
import Container from '../common/Container';
import Header from '../common/Header';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';

/* eslint-disable sorting/sort-object-props */
const MyFriendsRouter = TabNavigator(
  {
    myFriendsMain: { screen: MyFriendsMainScreen },
    myFriendsRequest: { screen: MyFriendsRequestScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
    lazy: true,
  },
);

class MyFriendsScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header title="Friends" />
        <MyFriendsRouter />
      </Container>
    );
  }
}

export default MyFriendsScreen;
