import type { Notification } from '../../stores/NotificationsStore';

import * as React from 'react';

import List from '../../common/List';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import ErrorListItem from '../../common/ErrorListItem';
import ListEmpty from '../../common/ListEmpty';
import NotificationsStore from '../../stores/NotificationsStore';
import NotificationComponentByType from './NotificationComponentByType';

const NotificationsList: React.FC = () => {
  const keyExtractor = React.useCallback((notification: Notification) => notification.id, []);

  const handleItemOpen = React.useCallback((notification: Notification) => {
    NotificationsStore.deleteByID(notification.id);
  }, []);

  const handleNotificationReadEnd = React.useCallback((notification: Notification) => {
    NotificationsStore.setRead(notification.id);
  }, []);

  const renderItem = React.useCallback(({ item }: { item: Notification }): React.ReactElement => (
    <ErrorBoundary fallbackComponent={<ErrorListItem error={new Error('Component error')} />}>
      {React.createElement(NotificationComponentByType, {
        isSwipeable: true,
        notification: item,
        onOpen: handleItemOpen,
        onPress: NotificationsStore.onNotificationPress,
        onReadEnd: handleNotificationReadEnd,
      })}
    </ErrorBoundary>
  ), [handleItemOpen, handleNotificationReadEnd]);

  return (
    <List
      data={{ pages: [NotificationsStore.notifications], pageParams: [0] } as any}
      keyExtractor={keyExtractor}
      listType="flatList"
      ListEmptyComponent={<ListEmpty message="No new notifications!" />}
      renderItem={renderItem}
    />
  );
};

export default NotificationsList;
