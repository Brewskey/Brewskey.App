// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsRequestScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Requests',
  };

  render() {
    return <NotImplementedPlaceholder />;
  }
}

export default MyFriendsRequestScreen;
