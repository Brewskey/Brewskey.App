// @flow

import React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import ContactsList from '../components/ContactsList';

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsContactScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Contacts',
  };

  render() {
    return <ContactsList />;
  }
}

export default MyFriendsContactScreen;
