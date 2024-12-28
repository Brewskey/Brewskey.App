import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import ContactsList from '../components/ContactsList';

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsContactScreen extends React.Component<Record<any, any>> {
  static navigationOptions = {
    tabBarLabel: 'Contacts',
  };

  render(): React.ReactElement {
    return <ContactsList />;
  }
}

export default MyFriendsContactScreen;
