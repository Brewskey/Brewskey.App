import * as React from 'react';
import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';

import FriendsList from '../components/FriendsList';
import { useUserID } from '../stores/AuthStore';

const MyFriendsMainScreen: React.FC = () => {
  const userID = useUserID();

  return (
    <FriendsList
      queryOptions={{
        filters: [
          createFilter('owningAccount/id').equals(userID),
          createFilter('friendStatus').equals(
            FRIEND_STATUSES.APPROVED,
          ),
        ],
      }}
    />
  );
};

// Note: navigationOptions (tabBarLabel: 'Friends') should be set in the navigator configuration

export default withErrorBoundary(MyFriendsMainScreen, <ErrorScreen shouldShowBackButton />);
