import * as React from 'react';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import Container from '../../../common/Container';
import Header from '../../../common/Header';
import DeleteModal from '../../../components/modals/DeleteModal';
import { HeaderIconButton } from '../../../common/Header/HeaderIconButton';

export default function NotificationsIndex() {
  const [isFocused, setIsFocused] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const onDeleteAllConfirm = () => {
    // NotificationsStore.deleteAllNotifications();
    setIsDeleteModalVisible(false);
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
      {/* {isFocused ? <NotificationsList /> : null} */}
      <DeleteModal
        title="Clear all notifications"
        isVisible={isDeleteModalVisible}
        deleteButtonTitle="clear"
        message="Are sure you want to clear all notifications?"
        onCancelButtonPress={() => setIsDeleteModalVisible(false)}
        onDeleteButtonPress={onDeleteAllConfirm}
        testID="modal-delete-all-notifications"
      />
    </Container>
  );
}
