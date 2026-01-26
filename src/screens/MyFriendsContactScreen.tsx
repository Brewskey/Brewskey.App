import * as React from 'react';

import { withErrorBoundary } from '../common/ErrorBoundary';
import ErrorScreen from '../common/ErrorScreen';
import ContactsList from '../components/ContactsList';

const MyFriendsContactScreen: React.FC = () => <ContactsList />;

export default withErrorBoundary(
  MyFriendsContactScreen,
  <ErrorScreen shouldShowBackButton />,
);
