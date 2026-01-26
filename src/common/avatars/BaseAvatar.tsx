import * as React from 'react';

import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS } from '../../theme';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.secondary2,
    marginRight: 8,
  },
});

export interface BaseAvatarProps {
  containerStyle?: StyleProp<ViewStyle>;
  mutable?: boolean;
  onPress?: () => void;
  rounded: boolean;
  size: number;
}

type Props = BaseAvatarProps & {
  uri: string;
  testID?: string;
};
const BaseAvatar: React.FC<Props> = ({
  containerStyle,
  onPress,
  rounded = true,
  size = 45,
  uri,
  testID,
}) => {
  const baseContainerStyle = {
    height: size,
    width: size,
    ...(rounded && { borderRadius: size / 2 }),
  } as const;

  const imageElement = <Image source={{ uri }} style={baseContainerStyle} />;

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      testID={testID}
      style={[
        {
          ...baseContainerStyle,
          ...styles.avatar,
          width: size,
          height: size,
        },
        containerStyle,
      ]}
    >
      {uri ? imageElement : null}
    </TouchableOpacity>
  );
};

export default React.memo(BaseAvatar);
