import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { Button as RNEButton } from '@rneui/themed';
import ToggleStore from '../../stores/ToggleStore';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  secondaryDisabledButton: {
    backgroundColor: COLORS.secondaryDisabled,
  },
  secondaryDisabledText: {
    color: COLORS.textInverse,
  },
});

type Props = React.ComponentProps<typeof RNEButton> & {
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void | Promise<void>;
  secondary?: boolean;
  style?: ViewStyle;
  title: string;
  type?: 'solid' | 'clear' | 'outline';
  // react-native-elemenets button porps
};

type State = {
  isLoading: boolean;
};

const Button: React.FC<Props> = ({
  backgroundColor = COLORS.primary2,
  color = COLORS.textInverse,
  disabled,
  loading,
  onPress,
  secondary,
  style,
  type,
  ...rest
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = async (): Promise<void> => {
    if (!onPress) {
      return;
    }

    setIsLoading(true);
    try {
      await onPress();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RNEButton
      buttonStyle={{
        marginHorizontal: 20,
        ...(type === 'solid' || type == null
          ? {
              backgroundColor: secondary ? COLORS.secondary : backgroundColor,
            }
          : null),
        ...(style || {}),
      }}
      disabledStyle={secondary && styles.secondaryDisabledButton}
      disabledTitleStyle={secondary && styles.secondaryDisabledText}
      {...rest}
      disabled={disabled || isLoading}
      loading={loading || isLoading}
      onPress={handlePress}
      titleStyle={{
        color: secondary ? COLORS.text : color,
      }}
      type={type}
    />
  );
};

export default Button;
