import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from 'expo-router';
import { AppState, Linking, Platform, StyleSheet, Text } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderIconButton } from 'common/Header/HeaderIconButton';
import { DeleteModal } from 'components/modals/DeleteModal';
import { NotificationsList } from 'components/NotificationsList';
import { useDeleteAllNotifications } from 'hooks/queries/NotificationQueries';
import { useRequestNotificationPermission } from 'hooks/useNotificationHandlers';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { NotificationPermissionsStatus } from 'expo-notifications';

const NOTIFICATION_PERMISSION_QUERY_KEY = [
  'notifications',
  'permission',
] as const;

const isWeb = Platform.OS === 'web';

/** Shown before the OS notification prompt (`extra.notificationsPermissionExplainer` in app.json). */
const FALLBACK_NOTIFICATION_PERMISSION_EXPLAINER =
  'Turn on notifications to hear about friend requests, achievements, low kegs, and other updates from your taps.';

/** Matches `useNotificationHandlers` so granted state aligns with push registration. */
function isNotificationPermissionGranted(
  settings: NotificationPermissionsStatus,
): boolean {
  const grantedFlag = (settings as { granted?: boolean }).granted === true;
  const ios = settings.ios?.status;
  const iosAllowed =
    ios === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    ios === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return grantedFlag || iosAllowed;
}

const styles = StyleSheet.create({
  permissionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default function NotificationsIndex() {
  const notificationPermissionExplainer =
    typeof Constants.expoConfig?.extra?.notificationsPermissionExplainer ===
      'string' &&
    Constants.expoConfig.extra.notificationsPermissionExplainer.length > 0
      ? Constants.expoConfig.extra.notificationsPermissionExplainer
      : FALLBACK_NOTIFICATION_PERMISSION_EXPLAINER;

  const [isFocused, setIsFocused] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [didAttemptPermissionRequest, setDidAttemptPermissionRequest] =
    useState(false);
  const [isContinueBusy, setIsContinueBusy] = useState(false);

  const deleteAll = useDeleteAllNotifications();
  const requestPermissionAndRegister = useRequestNotificationPermission();

  const permissionQuery = useQuery({
    queryKey: NOTIFICATION_PERMISSION_QUERY_KEY,
    queryFn: async () => Notifications.getPermissionsAsync(),
    enabled: !isWeb,
  });

  const refetchNotificationPermission = permissionQuery.refetch;

  const permission = permissionQuery.data;
  const permissionGranted =
    isWeb ||
    (permission != null && isNotificationPermissionGranted(permission));

  const openSettingsOnContinue =
    !isWeb &&
    (permission as { canAskAgain?: boolean } | undefined)?.canAskAgain ===
      false &&
    didAttemptPermissionRequest;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        return;
      }
      void refetchNotificationPermission();
    });
    return () => {
      subscription.remove();
    };
  }, [refetchNotificationPermission]);

  useEffect(() => {
    if (permissionGranted) {
      setDidAttemptPermissionRequest(false);
    }
  }, [permissionGranted]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      if (!isWeb) {
        void refetchNotificationPermission();
      }
      return () => setIsFocused(false);
    }, [refetchNotificationPermission]),
  );

  const onDeleteAllConfirm = () => {
    deleteAll.mutate(undefined, {
      onSettled: () => setIsDeleteModalVisible(false),
    });
  };

  if (!isWeb && permissionQuery.isLoading) {
    return null;
  }

  return (
    <Container>
      <Header
        testID="header-notifications"
        title="Notifications"
        rightComponent={
          permissionGranted ? (
            <HeaderIconButton
              name="delete"
              onPress={() => setIsDeleteModalVisible(true)}
              testID="button-delete-all-notifications"
            />
          ) : null
        }
      />
      {isFocused && permissionGranted ? <NotificationsList /> : null}
      {!permissionGranted ? (
        <Container centered testID="notifications-permission-request">
          <Text
            style={styles.permissionText}
            testID="notifications-permission-text"
          >
            {notificationPermissionExplainer}
          </Text>
          <Button
            testID={
              openSettingsOnContinue
                ? 'button-open-notification-settings'
                : 'button-continue-notification-permissions'
            }
            title="Continue"
            onPress={async () => {
              if (openSettingsOnContinue) {
                await Linking.openSettings();
                void refetchNotificationPermission();
                return;
              }

              if (isContinueBusy || !requestPermissionAndRegister) {
                return;
              }

              setIsContinueBusy(true);
              try {
                await requestPermissionAndRegister();
              } finally {
                setDidAttemptPermissionRequest(true);
                setIsContinueBusy(false);
                void refetchNotificationPermission();
              }
            }}
          />
        </Container>
      ) : null}
      <DeleteModal
        deleteButtonTitle="clear"
        isVisible={isDeleteModalVisible}
        message="Are sure you want to clear all notifications?"
        onCancelButtonPress={() => setIsDeleteModalVisible(false)}
        onDeleteButtonPress={onDeleteAllConfirm}
        testID="modal-delete-all-notifications"
        title="Clear all notifications"
      />
    </Container>
  );
}
