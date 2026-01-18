import { Image } from 'expo-image';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.secondary2,
    marginRight: 8,
  },
});

export type BaseAvatarProps = {
  containerStyle?: StyleProp<ViewStyle>;
  mutable?: boolean;
  onPress?: () => void;
  rounded: boolean;
  size: number;
};

type Props = BaseAvatarProps & {
  uri: string;
};
const BaseAvatar: React.FC<Props> = ({
  containerStyle,
  onPress,
  rounded = true,
  size = 45,
  uri,
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
