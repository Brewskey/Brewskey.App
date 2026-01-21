import * as React from 'react';
import ErrorScreen from '../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import FriendRequestsList from '../../../../components/FriendRequestsList';

import { Badge } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../theme';
import { useGetManyFriends } from '../../../../hooks/queries/FriendQueries';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { FRIEND_STATUSES } from '@brewskey/js-api';
import { useUserID } from '../../../../stores/AuthStore';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  container: {
    left: 64,
    position: 'absolute',
    top: -1,
  },
});

const Badges: React.FC<{ tintColor: string }> = ({ tintColor }) => {
  const userID = useUserID();
  const pendingRequestsQuery = useGetManyFriends({
    filters: [
      createFilter('friendAccount').notEquals(null),
      createFilter('owningAccount/id').equals(userID),
      createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
    ],
  });

  const pendingCount = pendingRequestsQuery.data?.length ?? 0;

  if (pendingCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Badge
        badgeStyle={styles.badge}
        textStyle={{ ...styles.badgeText, color: COLORS.primary2 }}
        value={pendingCount}
      />
    </View>
  );
};

const TabBarLabel: React.FC<{ tintColor: string }> = ({ tintColor }) => (
  <View>
    <Text style={{ color: tintColor }}>Requests</Text>
    <Badges tintColor={tintColor} />
  </View>
);

const MyFriendsRequestRoute: React.FC = () => {
  return <FriendRequestsList />;
};

export default withErrorBoundary(MyFriendsRequestRoute, <ErrorScreen shouldShowBackButton />);
