import * as React from 'react';
import nullthrows from 'nullthrows';

import { StyleSheet, Text, View } from 'react-native';

import AuthStore from '../stores/AuthStore';
import UserAvatar from '../common/avatars/UserAvatar';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../theme';
import TouchableItem from '../common/buttons/TouchableItem';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    ...getElevationStyle(1),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary2,
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

export const MenuUserBlock: React.FC = () => {
  const navigation = useNavigation();
  const _onPress = () =>
    navigation.navigate('profile', {
      id: AuthStore.userID,
    });

  return (
    <TouchableItem borderless onPress={_onPress}>
      <View style={styles.container}>
        <UserAvatar userName={nullthrows(AuthStore.userName)} />
        <View style={styles.content}>
          <Text style={styles.nameText}>{AuthStore.userName}</Text>
          <Text style={styles.goToProfileText}>Go to profile</Text>
        </View>
      </View>
    </TouchableItem>
  );
};
