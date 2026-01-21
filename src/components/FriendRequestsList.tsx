import type { Friend } from '@brewskey/js-api';
import type { Section } from '../types';

import * as React from 'react';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { FRIEND_STATUSES } from '@brewskey/js-api';

import LoadingListFooter from '../common/LoadingListFooter';
import List from '../common/List';
import ListSectionHeader from '../common/ListSectionHeader';
import FriendPendingRequestListItem from './FriendPendingRequestListItem';
import FriendMyRequestListItem from './FriendMyRequestListItem';
import ListEmpty from '../common/ListEmpty';
import { useUserID } from '../stores/AuthStore';
import { useGetManyFriends, useUpdateFriend, useDeleteFriend } from '../hooks/queries/FriendQueries';
import { useQueryClient } from '@tanstack/react-query';

const FriendRequestsList: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userID = useUserID();

  // Query for pending requests (requests sent to me)
  const pendingRequestsQuery = useGetManyFriends({
    filters: [
      createFilter('friendAccount').notEquals(null),
      createFilter('owningAccount/id').equals(userID),
      createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
    ],
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
  });

  // Query for my requests (requests I sent)
  const myRequestsQuery = useGetManyFriends({
    filters: [
      createFilter('friendAccount').notEquals(null),
      createFilter('friendStatus').equals(FRIEND_STATUSES.AWAITING_APPROVAL),
      createFilter('owningAccount/id').equals(userID),
    ],
    orderBy: [
      {
        column: 'id',
        direction: 'desc',
      },
    ],
  });

  const updateFriendMutation = useUpdateFriend();
  const deleteFriendMutation = useDeleteFriend();

  const isLoading = pendingRequestsQuery.isLoading || myRequestsQuery.isLoading;

  const onPendingRequestRowPress = (friend: Friend) => {
    router.navigate(`/(tabs)/profile/${friend.owningAccount.id}`);
  };

  const onMyRequestRowPress = (friend: Friend) => {
    router.navigate(`/(tabs)/profile/${friend.friendAccount.id}`);
  };

  const onFriendAcceptPress = async (friend: Friend) => {
    await updateFriendMutation.mutateAsync({
      ...friend,
      id: friend.id,
      friendStatus: FRIEND_STATUSES.APPROVED,
    });
    pendingRequestsQuery.refetch();
    myRequestsQuery.refetch();
  };

  const onFriendDeclinePress = async ({ id }: Friend) => {
    await deleteFriendMutation.mutateAsync(typeof id === 'string' ? parseInt(id, 10) : id);
    pendingRequestsQuery.refetch();
    myRequestsQuery.refetch();
  };

  const onFriendCancelMyRequestPress = async ({ id }: Friend) => {
    await deleteFriendMutation.mutateAsync(typeof id === 'string' ? parseInt(id, 10) : id);
    pendingRequestsQuery.refetch();
    myRequestsQuery.refetch();
  };

  const onRefresh = () => {
    pendingRequestsQuery.refetch();
    myRequestsQuery.refetch();
  };

  const sections = useMemo((): Section<Friend>[] => {
    if (isLoading) {
      return [];
    }

    const pendingRequests = pendingRequestsQuery.data || [];
    const myRequests = myRequestsQuery.data || [];

    return [
      {
        data: pendingRequests,
        renderItem: ({ item: friend }): React.ReactElement => (
          <FriendPendingRequestListItem
            item={friend}
            onFriendAcceptPress={onFriendAcceptPress}
            onFriendDeclinePress={onFriendDeclinePress}
            onPress={onPendingRequestRowPress}
          />
        ),
        title: 'Pending requests',
      },
      {
        data: myRequests,
        renderItem: ({ item: friend }): React.ReactElement => (
          <FriendMyRequestListItem
            item={friend}
            onFriendCancelMyRequestPress={onFriendCancelMyRequestPress}
            onPress={onMyRequestRowPress}
          />
        ),
        title: 'My requests',
      },
    ];
  }, [pendingRequestsQuery.data, myRequestsQuery.data, isLoading]);

  const keyExtractor = (friend: Friend): string => friend.id.toString();

  const renderSectionHeader = ({ section }: { section: Section<Friend> }): React.ReactElement => (
    <ListSectionHeader title={section.title} />
  );

  const renderSectionFooter = ({ section: { data } }: { section: Section<Friend> }): React.ReactElement | null =>
    !data.length ? <ListEmpty message="No requests" /> : null;

  return (
    <List
      keyExtractor={keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
      listType="sectionList"
      onRefresh={onRefresh}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      sections={sections}
      testID="friend-requests-list"
    />
  );
};

export default FriendRequestsList;
