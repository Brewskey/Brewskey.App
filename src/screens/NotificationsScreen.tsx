import * as React from 'react';

import Container from '../common/Container';
import Header from '../common/Header';
import DeleteModal from '../components/modals/DeleteModal';
// import NotificationsList from '../components/NotificationsList';
// import NotificationsStore from '../stores/NotificationsStore';
import ToggleStore from '../stores/ToggleStore';
import { HeaderIconButton } from '../common/Header/HeaderIconButton';

type Props = {
  isFocused: boolean;
};

export class NotificationsScreen extends React.Component<Props> {
  _deleteModalToggleStore = new ToggleStore();

  _onDeleteAllConform = () => {
    // NotificationsStore.deleteAllNotifications();
    this._deleteModalToggleStore.toggleOff();
  };

  render(): React.ReactElement {
    return (
      <Container>
        <Header
          title="Notifications"
          rightComponent={
            <HeaderIconButton
              name="delete"
              onPress={this._deleteModalToggleStore.toggleOn}
            />
          }
        />
        {/* {this.props.isFocused ? <NotificationsList /> : null} */}
        <DeleteModal
          title="Clear all notifications"
          isVisible={this._deleteModalToggleStore.isToggled}
          deleteButtonTitle="clear"
          message="Are sure you want to clear all notifications?"
          onCancelButtonPress={this._deleteModalToggleStore.toggleOff}
          onDeleteButtonPress={this._onDeleteAllConform}
        />
      </Container>
    );
  }
}
