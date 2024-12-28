import * as React from 'react';
import { StyleSheet } from 'react-native';

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
  onPress?: (...args: Array<any>) => any;
  secondary?: boolean;
  style?: any;
  title: string;
  type?: 'solid' | 'clear' | 'outline';
  // react-native-elemenets button porps
};

class Button extends React.Component<Props> {
  static defaultProps: {
    backgroundColor: string;
    color: string;
  } = {
    backgroundColor: COLORS.primary2,
    color: COLORS.textInverse,
  };

  _isLoadingToggleStore: ToggleStore = new ToggleStore();

  _onPress = async (): Promise<void> => {
    const { onPress } = this.props;
    if (!onPress) {
      return;
    }

    this._isLoadingToggleStore.toggleOn();
    try {
      await onPress();
    } finally {
      this._isLoadingToggleStore.toggleOff();
    }
  };

  render(): React.ReactElement {
    const {
      backgroundColor,
      color,
      disabled,
      loading,
      secondary,
      style,
      type,
      ...rest
    } = this.props;

    return (
      <RNEButton
        buttonStyle={{
          marginHorizontal: 20,
          ...(type === 'solid' || type == null
            ? {
                backgroundColor: secondary ? COLORS.secondary : backgroundColor,
              }
            : null),
          ...style,
        }}
        disabledStyle={secondary && styles.secondaryDisabledButton}
        disabledTitleStyle={secondary && styles.secondaryDisabledText}
        {...rest}
        disabled={disabled || this._isLoadingToggleStore.isToggled}
        loading={loading || this._isLoadingToggleStore.isToggled}
        onPress={this._onPress}
        titleStyle={{
          color: secondary ? COLORS.text : color,
        }}
        type={type}
      />
    );
  }
}

export default Button;
