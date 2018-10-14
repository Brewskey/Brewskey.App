// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react/native';
import { Button as RNEButton } from 'react-native-elements';
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

type Props = {
  backgroundColor?: string,
  color?: string,
  disabled?: boolean,
  loading?: boolean,
  onPress?: (...args: Array<any>) => any,
  secondary?: boolean,
  style?: Object,
  // react-native-elemenets button porps
};

@observer
class Button extends React.Component<Props> {
  static defaultProps = {
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
    await onPress();
    this._isLoadingToggleStore.toggleOff();
  };

  render() {
    const {
      backgroundColor,
      color,
      disabled,
      loading,
      secondary,
      style,
      ...rest
    } = this.props;

    return (
      <RNEButton
        backgroundColor={secondary ? COLORS.secondary : backgroundColor}
        buttonStyle={style}
        color={secondary ? COLORS.text : color}
        disabledStyle={secondary && styles.secondaryDisabledButton}
        disabledTextStyle={secondary && styles.secondaryDisabledText}
        {...rest}
        disabled={disabled || this._isLoadingToggleStore.isToggled}
        loading={loading || this._isLoadingToggleStore.isToggled}
        onPress={this._onPress}
      />
    );
  }
}

export default Button;
