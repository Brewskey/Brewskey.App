// @flow

import type AuthStore from '../stores/AuthStore';
import type AvatarStore from '../stores/AvatarStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import styled from 'styled-components/native';
import { inject, observer } from 'mobx-react';
import { Avatar } from 'react-native-elements';

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
  avatarStore: AvatarStore,
|};

@inject('authStore')
@inject('avatarStore')
@observer
class DrawerHeader extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <Avatar
          large
          rounded
          source={{
            uri: this.injectedProps.avatarStore.sourceUri,
          }}
        />
        <UserNameText>{this.injectedProps.authStore.userName}</UserNameText>
      </Container>
    );
  }
}

export default DrawerHeader;
