// @flow

import React from 'react';
import ContactsList from '../components/ContactsList';

class MyFriendsContactScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: 'Contacts',
  };

  render() {
    return <ContactsList />;
  }
}

export default MyFriendsContactScreen;
