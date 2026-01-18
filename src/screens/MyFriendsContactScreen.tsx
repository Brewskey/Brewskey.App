import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import ContactsList from '../components/ContactsList';

const MyFriendsContactScreen: React.FC = () => {
  return <ContactsList />;
};

export default withErrorBoundary(MyFriendsContactScreen, <ErrorScreen showBackButton />);
