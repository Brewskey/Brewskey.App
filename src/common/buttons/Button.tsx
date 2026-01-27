import * as React from 'react';

import { Button as RNEButton } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { COLORS } from '../../theme';

import type { ViewStyle } from 'react-native';

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
  testID?: string;
  // react-native-elemenets button porps
};

const Button: React.FC<Props> = ({
  backgroundColor = COLORS.primary2,
  color = COLORS.textInverse,
  disabled,
  loading,
  onPress,
  secondary,
  style,
  testID,
  title,
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
      disabledStyle={secondary ? styles.secondaryDisabledButton : null}
      disabledTitleStyle={secondary ? styles.secondaryDisabledText : null}
      buttonStyle={{
        marginHorizontal: 20,
        ...(type === 'solid' || type == null
          ? {
              backgroundColor: secondary ? COLORS.secondary : backgroundColor,
            }
          : null),
        ...(style || {}),
      }}
      {...rest}
      disabled={disabled || isLoading}
      loading={loading || isLoading}
      onPress={handlePress}
      testID={testID}
      title={title}
      type={type}
      titleStyle={{
        color: secondary ? COLORS.text : color,
      }}
    />
  );
};

export { Button };
