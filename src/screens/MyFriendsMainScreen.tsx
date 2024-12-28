import * as React from 'react';
import DAOApi, { FRIEND_STATUSES } from '@brewskey/js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';

import FriendsList from '../components/FriendsList';
import AuthStore from '../stores/AuthStore';

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsMainScreen extends React.Component<Record<any, any>> {
  static navigationOptions = {
    tabBarLabel: 'Friends',
  };

  render(): React.ReactElement {
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
      />
    );
  }
}

export default MyFriendsMainScreen;
