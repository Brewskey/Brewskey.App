import * as React from 'react';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { Badge } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';

import { FriendRequestsList } from 'components/FriendRequestsList';
import { useUserID } from 'hooks/context/AuthContext';
import { useGetManyFriends } from 'hooks/queries/FriendQueries';
import { COLORS } from 'theme';

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

const Badges: React.FC<{ tintColor: string }> = ({ tintColor: _tintColor }) => {
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

const _TabBarLabel: React.FC<{ tintColor: string }> = ({ tintColor }) => (
  <View>
    <Text style={{ color: tintColor }}>Requests</Text>
    <Badges tintColor={tintColor} />
  </View>
);

const MyFriendsRequestRoute: React.FC = () => <FriendRequestsList />;

export default MyFriendsRequestRoute;
