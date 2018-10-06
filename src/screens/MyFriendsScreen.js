// @flow

import type { Navigation } from '../types';
import type { FriendAddFormValues } from '../components/FriendAddForm';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import InjectedComponent from '../common/InjectedComponent';
import { createMaterialTopTabNavigator } from 'react-navigation';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import MyFriendsMainScreen from './MyFriendsMainScreen';
import MyFriendsRequestScreen from './MyFriendsRequestScreen';
import FriendAddCustomModal from '../components/modals/FriendAddCustomModal';
import theme from '../theme';
import ToggleStore from '../stores/ToggleStore';
import SnackBarStore from '../stores/SnackBarStore';
import { FriendStore } from '../stores/DAOStores';

/* eslint-disable sorting/sort-object-props */
const MyFriendsNavigator = createMaterialTopTabNavigator(
  {
    myFriendsMain: { screen: MyFriendsMainScreen },
    myFriendsRequest: { screen: MyFriendsRequestScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
    backBehavior: 'none',
    lazy: true,
  },
);

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class MyFriendsScreen extends InjectedComponent<InjectedProps> {
  static router = MyFriendsNavigator.router;

  _friendModalToggleStore = new ToggleStore();

  _onFriendAddFormSubmit = async ({ userName }: FriendAddFormValues) => {
    await DAOApi.FriendDAO.addFriend(userName);
    this._friendModalToggleStore.toggleOff();
    FriendStore.flushQueryCaches();
    this.injectedProps.navigation.navigate('myFriendsRequest');
    SnackBarStore.showMessage({
      text: `You requested a friendship with ${userName}`,
    });
  };

  render() {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderIconButton
              name="person-add"
              onPress={this._friendModalToggleStore.toggleOn}
              type="material-icons"
            />
          }
          showBackButton
          title="Friends"
        />
        <MyFriendsNavigator navigation={this.injectedProps.navigation} />
        <FriendAddCustomModal
          isVisible={this._friendModalToggleStore.isToggled}
          onFriendAddFormSubmit={this._onFriendAddFormSubmit}
          onHideModal={this._friendModalToggleStore.toggleOff}
        />
      </Container>
    );
  }
}

export default MyFriendsScreen;
