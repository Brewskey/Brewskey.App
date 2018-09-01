// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import FriendRequestsList from '../components/FriendRequestsList';

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsRequestScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Requests',
  };

  render() {
    return <FriendRequestsList />;
  }
}

export default MyFriendsRequestScreen;
