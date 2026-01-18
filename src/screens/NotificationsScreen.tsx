import * as React from 'react';
import { useState } from 'react';

import Container from '../common/Container';
import Header from '../common/Header';
import DeleteModal from '../components/modals/DeleteModal';
// import NotificationsList from '../components/NotificationsList';
// import NotificationsStore from '../stores/NotificationsStore';
import { HeaderIconButton } from '../common/Header/HeaderIconButton';

type Props = {
  isFocused: boolean;
};

export const NotificationsScreen: React.FC<Props> = ({ isFocused }) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onDeleteAllConfirm = () => {
    // NotificationsStore.deleteAllNotifications();
    setIsDeleteModalVisible(false);
  };

  return (
    <Container>
      <Header
        title="Notifications"
        rightComponent={
          <HeaderIconButton
            name="delete"
            onPress={() => setIsDeleteModalVisible(true)}
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
      />
    </Container>
  );
};
