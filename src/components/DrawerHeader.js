// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import styled from 'styled-components/native';
import { inject, observer } from 'mobx-react';
import UserAvatar from '../common/avatars/UserAvatar';

const Container = styled.View`
  background-color: gray;
  padding-horizontal: 13;
  padding-vertical: 13;
`;

const UserNameText = styled.Text`
  color: white;
  font-size: 20;
  font-weight: bold;
  padding-top: 10;
`;

type InjectedProps = {|
  authStore: AuthStore,
|};

@inject('authStore')
@observer
class DrawerHeader extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <UserAvatar
          size={100}
          userName={this.injectedProps.authStore.userName || ''}
        />
        <UserNameText>{this.injectedProps.authStore.userName}</UserNameText>
      </Container>
    );
  }
}

export default DrawerHeader;
