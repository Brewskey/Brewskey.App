import * as React from 'react';
import nullthrows from 'nullthrows';

import { StyleSheet, Text, View } from 'react-native';

import { useUserID, useUserName } from '../stores/AuthStore';
import UserAvatar from '../common/avatars/UserAvatar';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../theme';
import TouchableItem from '../common/buttons/TouchableItem';
import { useRouter } from 'expo-router';

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
  const router = useRouter();
  const userID = useUserID();
  const userName = useUserName();

  const _onPress = () => {
    if (!userID) return;
    router.navigate(`/(tabs)/profile/${userID}`);
  };

  if (!userName) {
    return null;
  }

  return (
    <TouchableItem shouldBeBorderless onPress={_onPress} testID="menu-user-block">
      <View style={styles.container} testID="menu-user-block-content">
        <UserAvatar userName={nullthrows(userName)} />
        <View style={styles.content}>
          <Text style={styles.nameText} testID="menu-user-block-name">{userName}</Text>
          <Text style={styles.goToProfileText} testID="menu-user-block-profile-text">Go to profile</Text>
        </View>
      </View>
    </TouchableItem>
  );
};
