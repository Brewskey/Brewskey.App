// @flow

import * as React from 'react';
import DAOApi, { FRIEND_STATUSES } from 'brewskey.js-api';
import { observer } from 'mobx-react';
import FriendsList from '../components/FriendsList';
import AuthStore from '../stores/AuthStore';

@observer
class MyFriendsMainScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Friends',
  };

  render() {
    return (
      <FriendsList
        queryOptions={{
          filters: [
            DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
            DAOApi.createFilter('friendStatus').equals(
              FRIEND_STATUSES.APPROVED,
            ),
          ],
        }}
        showPhoneNumber
      />
    );
  }
}

export default MyFriendsMainScreen;
