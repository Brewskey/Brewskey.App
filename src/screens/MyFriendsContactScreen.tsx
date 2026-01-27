import * as React from 'react';

import { withErrorBoundary } from '../common/ErrorBoundary';
import { ErrorScreen } from '../common/ErrorScreen';
import { ContactsList } from '../components/ContactsList';

const MyFriendsContactScreenComponent: React.FC = () => <ContactsList />;

const MyFriendsContactScreen = withErrorBoundary(
  MyFriendsContactScreenComponent,
  <ErrorScreen shouldShowBackButton />,
);
export { MyFriendsContactScreen };
