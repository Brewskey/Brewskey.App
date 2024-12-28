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
class BaseAvatar extends React.PureComponent<Props> {
  static defaultProps: {
    cached: boolean;
    rounded: boolean;
    size: number;
  } = {
    cached: true,
    rounded: true,
    size: 45,
  };

  render(): React.ReactElement {
    const { containerStyle, onPress, rounded, size, uri } = this.props;

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
  }
}

export default BaseAvatar;
