import * as React from 'react';

import NotificationComponentByType from './NotificationComponentByType';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import ErrorListItem from '../../common/ErrorListItem';
import List from '../../common/List';
import ListEmpty from '../../common/ListEmpty';
import NotificationsStore from '../../stores/NotificationsStore';

import type { Notification } from '../../stores/NotificationTypes';

const NotificationsList: React.FC = () => {
  const keyExtractor = React.useCallback(
    (notification: Notification) => notification.id,
    [],
  );

  const handleItemOpen = React.useCallback((notification: Notification) => {
    NotificationsStore.deleteByID(notification.id);
  }, []);

  const handleNotificationReadEnd = React.useCallback(
    (notification: Notification) => {
      NotificationsStore.setRead(notification.id);
    },
    [],
  );

  const renderItem = React.useCallback(
    ({ item }: { item: Notification }): React.ReactElement => (
      <ErrorBoundary
        fallbackComponent={
          <ErrorListItem error={new Error('Component error')} />
        }
      >
        {React.createElement(NotificationComponentByType, {
          isSwipeable: true,
          notification: item,
          onOpen: handleItemOpen,
          onPress: NotificationsStore.onNotificationPress,
          onReadEnd: handleNotificationReadEnd,
        })}
      </ErrorBoundary>
    ),
    [handleItemOpen, handleNotificationReadEnd],
  );

  return (
    <List
      keyExtractor={keyExtractor}
      ListEmptyComponent={<ListEmpty message="No new notifications!" />}
      listType="flatList"
      renderItem={renderItem}
      data={
        { pages: [NotificationsStore.notifications], pageParams: [0] } as any
      }
    />
  );
};

export default NotificationsList;
