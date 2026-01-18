import * as React from 'react';
import nullthrows from 'nullthrows';

import { StyleSheet, Text, View } from 'react-native';

import { useUserID, useUserName } from '../stores/AuthStore';
import UserAvatar from '../common/avatars/UserAvatar';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../theme';
import TouchableItem from '../common/buttons/TouchableItem';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const userID = useUserID();
  const userName = useUserName();

  const _onPress = () => {
    if (!userID) return;
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'profile',
        params: {
          id: userID,
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  if (!userName) {
    return null;
  }

  return (
    <TouchableItem borderless onPress={_onPress}>
      <View style={styles.container}>
        <UserAvatar userName={nullthrows(userName)} />
        <View style={styles.content}>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.goToProfileText}>Go to profile</Text>
        </View>
      </View>
    </TouchableItem>
  );
};
