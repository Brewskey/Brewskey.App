// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { withNavigationFocus } from 'react-navigation';
import { observer } from 'mobx-react/native';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import DeleteModal from '../components/modals/DeleteModal';
import NotificationsList from '../components/NotificationsList';
import NotificationsStore from '../stores/NotificationsStore';
import ToggleStore from '../stores/ToggleStore';

type InjectedProps = {|
  isFocused: boolean,
  navigation: Navigation,
|};

@errorBoundary(ErrorScreen)
@withNavigationFocus
@observer
class NotificationsScreen extends InjectedComponent<InjectedProps> {
  _deleteModalToggleStore = new ToggleStore();

  _onDeleteAllConform = () => {
    NotificationsStore.deleteAllNotifications();
    this._deleteModalToggleStore.toggleOff();
  };

  render() {
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
        {this.injectedProps.isFocused ? <NotificationsList /> : null}
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

export default NotificationsScreen;
