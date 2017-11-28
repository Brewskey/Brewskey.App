// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { COLORS, TYPOGRAPHY } from '../theme';
import UserAvatar from '../common/avatars/UserAvatar';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    elevation: 2,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  userNameText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textInverse,
  },
});

type InjectedProps = {|
  authStore: AuthStore,
|};

@inject('authStore')
@observer
class DrawerHeader extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <View style={styles.container}>
        <UserAvatar
          size={100}
          userName={this.injectedProps.authStore.userName || ''}
        />
        <Text style={styles.userNameText}>
          {this.injectedProps.authStore.userName}
        </Text>
      </View>
    );
  }
}

export default DrawerHeader;
