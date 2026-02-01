import * as React from 'react';

import { useRouter } from 'expo-router';
import nullthrows from 'nullthrows';
import { StyleSheet, Text, View } from 'react-native';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { TouchableItem } from 'common/buttons/TouchableItem';
import { useAuthSession } from 'hooks/context/AuthContext';
import { COLORS, getElevationStyle, TYPOGRAPHY } from 'theme';

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
  const { data: authResponse } = useAuthSession();

  const _onPress = () => {
    if (!authResponse?.id) return;
    router.navigate({
      pathname: '/profile/[id]',
      params: { id: String(authResponse.id) },
    });
  };

  if (authResponse == null) {
    return null;
  }

  return (
    <TouchableItem
      shouldBeBorderless
      onPress={_onPress}
      testID="menu-user-block"
    >
      <View style={styles.container} testID="menu-user-block-content">
        <UserAvatar userName={nullthrows(authResponse.userName)} />
        <View style={styles.content}>
          <Text style={styles.nameText} testID="menu-user-block-name">
            {authResponse.userName}
          </Text>
          <Text
            style={styles.goToProfileText}
            testID="menu-user-block-profile-text"
          >
            Go to profile
          </Text>
        </View>
      </View>
    </TouchableItem>
  );
};
