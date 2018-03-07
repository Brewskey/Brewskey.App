// @flow

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';

class NotificationsScreen extends React.Component<> {
  render() {
    return (
      <Container>
        <Header
          title="Notifications"
          rightComponent={<HeaderIconButton name="delete" />}
        />
        <NotImplementedPlaceholder />
      </Container>
    );
  }
}

export default NotificationsScreen;
