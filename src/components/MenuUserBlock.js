// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import AuthStore from '../stores/AuthStore';
import UserAvatar from '../common/avatars/UserAvatar';
import { COLORS, TYPOGRAPHY } from '../theme';
import TouchableItem from '../common/buttons/TouchableItem';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary2,
    elevation: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  content: {
    paddingLeft: 10,
  },
  goToProfileText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textFaded,
  },
  nameText: {
    ...TYPOGRAPHY.secondary,
  },
});

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
class MenuUserBlock extends InjectedComponent<InjectedProps> {
  _onPress = () => this.injectedProps.navigation.navigate('myProfile');

  render() {
    return (
      <TouchableItem borderless onPress={this._onPress}>
        <View style={styles.container}>
          <UserAvatar userName={nullthrows(AuthStore.userName)} />
          <View style={styles.content}>
            <Text style={styles.nameText}>{AuthStore.userName}</Text>
            <Text style={styles.goToProfileText}>Go to profile</Text>
          </View>
        </View>
      </TouchableItem>
    );
  }
}

export default MenuUserBlock;
