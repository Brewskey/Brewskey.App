import * as React from 'react';
import { useCallback, useState } from 'react';

import { useFocusEffect } from 'expo-router';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderIconButton } from 'common/Header/HeaderIconButton';
import { DeleteModal } from 'components/modals/DeleteModal';
import { NotificationsList } from 'components/NotificationsList';
import { useDeleteAllNotifications } from 'hooks/queries/NotificationQueries';
import { useRequestNotificationPermission } from 'hooks/useNotificationHandlers';

export default function NotificationsIndex() {
  const [isFocused, setIsFocused] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const deleteAll = useDeleteAllNotifications();
  const requestPermissionAndRegister = useRequestNotificationPermission();

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      requestPermissionAndRegister?.();
      return () => setIsFocused(false);
    }, [requestPermissionAndRegister]),
  );

  const onDeleteAllConfirm = () => {
    deleteAll.mutate(undefined, {
      onSettled: () => setIsDeleteModalVisible(false),
    });
  };

  return (
    <Container>
      <Header
        testID="header-notifications"
        title="Notifications"
        rightComponent={
          <HeaderIconButton
            name="delete"
            onPress={() => setIsDeleteModalVisible(true)}
            testID="button-delete-all-notifications"
          />
        }
      />
      {isFocused ? <NotificationsList /> : null}
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
