import { Vibration } from 'react-native';

import { SnackBarStore } from 'hooks/context/SnackBarContext';
import { normalizeNotificationFromExpo } from 'hooks/queries/NotificationQueries';

import type { Notification } from 'stores/NotificationTypes';

function showNotificationInSnackBar(notification: Notification): void {
  SnackBarStore.showMessage({
    duration: 3000,
    content: notification,
    position: 'top',
  });
}

export async function persistExpoNotification(
  expoNotification: {
    request: {
      content: {
        title?: string | null;
        body?: string | null;
        data?: Record<string, unknown>;
      };
    };
  },
  options: {
    isRead: boolean;
    shouldNavigate: boolean;
    addNotification: (notification: Notification) => Promise<unknown>;
    setNotificationRead: (id: string) => Promise<unknown>;
    onNavigate: (notification: Notification) => void;
    onPersisted?: (notification: Notification) => void;
  },
): Promise<Notification> {
  const notification = normalizeNotificationFromExpo(expoNotification, {
    isRead: options.isRead,
  });
  await options.addNotification(notification);
  if (options.isRead) {
    await options.setNotificationRead(notification.id);
  }
  if (options.shouldNavigate) {
    options.onNavigate(notification);
  }
  if (options.onPersisted) {
    options.onPersisted(notification);
  }
  return notification;
}

export function onForegroundNotificationPersisted(
  notification: Notification,
): void {
  Vibration.vibrate(500);
  showNotificationInSnackBar(notification);
}
