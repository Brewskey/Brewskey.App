// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import { withNavigationFocus } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import NotificationsList from '../components/NotificationsList';
import NotificationsStore from '../stores/NotificationsStore';

type InjectedProps = {|
  isFocused: boolean,
  navigation: Navigation,
|};

// todo add modal for allDelete confirmation
@withNavigationFocus
class NotificationsScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Header
          title="Notifications"
          rightComponent={
            <HeaderIconButton
              name="delete"
              onPress={NotificationsStore.deleteAllNotifications}
            />
          }
        />
        {this.injectedProps.isFocused && <NotificationsList />}
      </Container>
    );
  }
}

export default NotificationsScreen;
