import * as React from 'react';

import { View } from 'react-native';

import { ErrorBoundary } from 'common/ErrorBoundary';
import { ErrorListItem } from 'common/ErrorListItem';
import { List } from 'common/List';
import { ListEmpty } from 'common/ListEmpty';
import { NotificationListItem } from 'components/NotificationsList/NotificationListItem';
import {
  useDeleteNotification,
  useNotificationsList,
  useSetNotificationRead,
} from 'hooks/queries/NotificationQueries';
import { useNotificationPress } from 'hooks/useNotificationHandlers';

import type { Notification } from 'stores/NotificationTypes';

const NotificationsList: React.FC = () => {
  const { data: notifications = [] } = useNotificationsList();
  const deleteNotification = useDeleteNotification();
  const setRead = useSetNotificationRead();
  const onNotificationPress = useNotificationPress();

  const keyExtractor = React.useCallback(
    (notification: Notification) => notification.id,
    [],
  );

  const handleItemOpen = React.useCallback(
    (notification: Notification) => {
      deleteNotification.mutate(notification.id);
    },
    [deleteNotification],
  );

  const handleReadEnd = React.useCallback(
    (notification: Notification) => {
      setRead.mutate(notification.id);
    },
    [setRead],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Notification }): React.ReactElement => (
      <ErrorBoundary
        fallbackComponent={
          <ErrorListItem error={new Error('Component error')} />
        }
      >
        <NotificationListItem
          isSwipeable
          notification={item}
          onOpen={handleItemOpen}
          onPress={onNotificationPress}
          onReadEnd={handleReadEnd}
          testID={`notification-item-${item.type}-${item.id}`}
        />
      </ErrorBoundary>
    ),
    [handleItemOpen, handleReadEnd, onNotificationPress],
  );

  return (
    <List
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        <View testID="notifications-list-empty">
          <ListEmpty message="No new notifications!" />
        </View>
      }
      listType="flatList"
      renderItem={renderItem}
      data={{ pages: [notifications], pageParams: [0] }}
      testID="notifications-list"
    />
  );
};

export { NotificationsList };
