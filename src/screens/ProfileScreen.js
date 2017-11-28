// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import AvatarPicker from '../components/AvatarPicker';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

class ProfileScreen extends React.Component<{}> {
  static navigationOptions = {
    title: 'My profile',
  };

  render() {
    return (
      <View>
        <View style={styles.avatarContainer}>
          <AvatarPicker />
        </View>
      </View>
    );
  }
}

export default ProfileScreen;
