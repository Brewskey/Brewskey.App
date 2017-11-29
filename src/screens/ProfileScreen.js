// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Header from '../common/Header';
import AvatarPicker from '../components/AvatarPicker';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

class ProfileScreen extends React.Component<{}> {
  render() {
    return (
      <View>
        <Header title="My profile" />
        <View style={styles.avatarContainer}>
          <AvatarPicker />
        </View>
      </View>
    );
  }
}

export default ProfileScreen;
