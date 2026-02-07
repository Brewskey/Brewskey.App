import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';
import { Storage, StorageKeys } from 'utils/Storage';

import type { AchievementType, EntityID } from '@brewskey/js-api';

import type { Notification } from 'stores/NotificationTypes';

export const NOTIFICATION_QUERY_KEY = ['notifications', 'list'] as const;

declare global {
  interface Window {
    __PLAYWRIGHT_NOTIFICATIONS__?: Notification[];
  }
}

function normalizeDates(list: Notification[]): Notification[] {
  return list
    .map((n) => ({
      ...n,
      date:
        n.date instanceof Date ? n.date : new Date(n.date as unknown as string),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function loadNotificationsFromStorage(): Promise<Notification[]> {
  if (
    typeof window !== 'undefined' &&
    window.__PLAYWRIGHT_NOTIFICATIONS__ !== undefined
  ) {
    return normalizeDates(window.__PLAYWRIGHT_NOTIFICATIONS__);
  }
  const raw =
    (await Storage.getForCurrentUser<Notification[]>(
      StorageKeys.Notifications,
    )) ?? [];
  const list = Array.isArray(raw) ? raw : [];
  return normalizeDates(list);
}

export function useNotificationsList() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: loadNotificationsFromStorage,
  });
}

export function useNotificationsUnreadCount(): number {
  const { data: list } = useNotificationsList();
  if (!list) return 0;
  return list.filter((n) => !n.isRead).length;
}

function ensureNotificationShape(
  n: Record<string, unknown>,
  options: { isRead?: boolean; existingDate?: Date },
): Notification {
  const id = String(n.id ?? '');
  const date =
    options.existingDate ??
    (n.date instanceof Date
      ? n.date
      : new Date((n.date as string) ?? Date.now()));
  const isRead = options.isRead ?? Boolean(n.isRead);
  const base = {
    body: String(n.body ?? ''),
    date,
    id,
    isRead,
    title: String(n.title ?? ''),
  };
  const type = (n.type as Notification['type']) ?? 'text';
  switch (type) {
    case 'lowKegLevel':
      return {
        ...base,
        beverageId: n.beverageId as EntityID,
        beverageName: String(n.beverageName ?? ''),
        kegId: n.kegId as EntityID,
        tapId: n.tapId as EntityID,
        type: 'lowKegLevel',
      };
    case 'newAchievement':
      return {
        ...base,
        achievementType:
          (n.achievementType as AchievementType) ?? ('' as AchievementType),
        type: 'newAchievement',
      };
    case 'newFriendRequest':
      return {
        ...base,
        friendId: n.friendId as EntityID,
        friendUserName: String(n.friendUserName ?? ''),
        type: 'newFriendRequest',
      };
    default:
      return { ...base, type: 'text' };
  }
}

/**
 * Normalize expo-notifications Notification (request.content) or a raw payload
 * (e.g. from E2E __PLAYWRIGHT_SIMULATE_NOTIFICATION__) into our Notification type.
 */
export function normalizeNotificationFromPayload(
  payload: Record<string, unknown>,
  options: { isRead?: boolean; existingDate?: Date } = {},
): Notification {
  return ensureNotificationShape(payload, options);
}

/**
 * Normalize expo-notifications API Notification (from addNotificationReceivedListener
 * or response.notification) into our Notification type.
 * Expo shape: notification.request.content { title, body, data }.
 */
export function normalizeNotificationFromExpo(
  expoNotification: {
    request: {
      content: {
        title?: string | null;
        body?: string | null;
        data?: Record<string, unknown>;
      };
    };
  },
  options: { isRead?: boolean } = {},
): Notification {
  const content = expoNotification.request.content;
  const data = content.data ?? {};
  const merged: Record<string, unknown> = {
    ...data,
    body: content.body ?? (data.body as string) ?? '',
    title: content.title ?? (data.title as string) ?? '',
    id: (data.id as string) ?? String(Date.now()),
    date: data.date ? new Date(data.date as string | number) : new Date(),
    type: (data.type as Notification['type']) ?? 'text',
  };
  return ensureNotificationShape(merged, {
    isRead: options.isRead,
    existingDate: merged.date as Date,
  });
}

export function useAddNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notification: Notification) => {
      const list = await loadNotificationsFromStorage();
      const byId = new Map(list.map((n) => [n.id, n]));
      byId.set(notification.id, notification);
      const next = Array.from(byId.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      await Storage.setForCurrentUser(StorageKeys.Notifications, next);
      if (
        typeof window !== 'undefined' &&
        window.__PLAYWRIGHT_NOTIFICATIONS__ !== undefined
      ) {
        window.__PLAYWRIGHT_NOTIFICATIONS__ = next;
      }
      return next;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, data);
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await loadNotificationsFromStorage();
      const next = list.filter((n) => n.id !== id);
      await Storage.setForCurrentUser(StorageKeys.Notifications, next);
      return next;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, data);
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await Storage.setForCurrentUser(StorageKeys.Notifications, []);
      return [];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, data);
    },
  });
}

export function useSetNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const list = await loadNotificationsFromStorage();
      const next = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      await Storage.setForCurrentUser(StorageKeys.Notifications, next);
      return next;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, data);
    },
  });
}

// --- Disabled taps (per-tap notification toggle) ---

export const NOTIFICATIONS_DISABLED_TAPS_QUERY_KEY = [
  'notifications',
  'disabledTaps',
] as const;

export async function loadDisabledTapsFromStorage(): Promise<EntityID[]> {
  const raw = await Storage.getForCurrentUser<EntityID[]>(
    StorageKeys.NotificationsDisabledTaps,
  );
  return Array.isArray(raw) ? raw : [];
}

export function useNotificationsDisabledTaps() {
  return useQuery({
    queryKey: NOTIFICATIONS_DISABLED_TAPS_QUERY_KEY,
    queryFn: loadDisabledTapsFromStorage,
  });
}

export function useToggleNotificationsForTap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tapId: EntityID) => {
      const list = await loadDisabledTapsFromStorage();
      const set = new Set(list.map((id) => getStringFromEntityID(id)));
      const tapIdStr = getStringFromEntityID(tapId);
      if (set.has(tapIdStr)) {
        set.delete(tapIdStr);
      } else {
        set.add(tapIdStr);
      }
      const next = Array.from(set) as EntityID[];
      await Storage.setForCurrentUser(
        StorageKeys.NotificationsDisabledTaps,
        next,
      );
      return next;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(NOTIFICATIONS_DISABLED_TAPS_QUERY_KEY, data);
    },
  });
}
