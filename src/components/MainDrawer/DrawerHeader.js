// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { COLORS, TYPOGRAPHY } from '../../theme';
import AuthStore from '../../stores/AuthStore';
import UserAvatar from '../../common/avatars/UserAvatar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    elevation: 2,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  userNameText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
  },
});

@observer
class DrawerHeader extends React.Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <UserAvatar size={100} userName={AuthStore.userName || ''} />
        <Text style={styles.userNameText}>{AuthStore.userName}</Text>
      </View>
    );
  }
}

export default DrawerHeader;
