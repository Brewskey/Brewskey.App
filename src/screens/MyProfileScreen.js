// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Container from '../common/Container';
import Header from '../common/Header';
import AvatarPicker from '../components/AvatarPicker';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

class MyProfileScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header title="My profile" />
        <View style={styles.avatarContainer}>
          <AvatarPicker />
        </View>
      </Container>
    );
  }
}

export default MyProfileScreen;
