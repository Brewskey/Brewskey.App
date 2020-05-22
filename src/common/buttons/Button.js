// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
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

type Props = {|
  ...React.ElementProps<typeof RNEButton>,
  backgroundColor?: string,
  color?: string,
  disabled?: boolean,
  loading?: boolean,
  onPress?: (...args: Array<any>) => any,
  secondary?: boolean,
  style?: Object,
  title: string,
  type?: 'solid' | 'clear' | 'outline',
  // react-native-elemenets button porps
|};

@observer
class Button extends React.Component<Props> {
  static defaultProps: {| backgroundColor: string, color: string |} = {
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

  render(): React.Node {
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
          marginHorizontal: 12,
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
