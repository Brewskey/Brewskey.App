// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import AvatarPicker from '../components/AvatarPicker';

const AvatarContainer = styled.View`
  align-items: center;
  padding-vertical: 15;
`;

class ProfileScreen extends React.Component<{}> {
  static navigationOptions = {
    title: 'My profile',
  };

  render() {
    return (
      <View>
        <AvatarContainer>
          <AvatarPicker />
        </AvatarContainer>
      </View>
    );
  }
}

export default ProfileScreen;
