// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import AvatarPicker from '../components/AvatarPicker';
import Container from '../common/Container';
import Header from '../common/Header';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

@observer
class MyProfileScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header showBackButton title="My profile" />
        <View style={styles.avatarContainer}>
          <AvatarPicker />
        </View>
      </Container>
    );
  }
}

export default MyProfileScreen;
