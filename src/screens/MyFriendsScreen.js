// @flow

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import theme from '../theme';
import Container from '../common/Container';
import Header from '../common/Header';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';
import MyFriendsContactScreen from './MyFriendsContactScreen';

/* eslint-disable sorting/sort-object-props */
const MyFriendsRouter = TabNavigator(
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
