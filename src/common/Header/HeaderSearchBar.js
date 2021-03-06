// @flow

import * as React from 'react';
import nullthrows from 'nullthrows';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import HeaderIconButton from '../../common/Header/HeaderIconButton';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { observer } from 'mobx-react';
import { action, observable, when } from 'mobx';
import ToggleStore from '../../stores/ToggleStore';

// todo expand styles works only when there is only one element in
// header rightComponent
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  containerExpanded: {
    overflow: 'visible',
    position: 'absolute',
    width: '100%',
  },
  textInput: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textInverse,
    flex: 1,
  },
  textInputContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
});

type Props = {|
  onChangeText: (value: string) => void,
  onClearPress?: () => void,
  onClosePress?: () => void,
  onExpandPress?: () => void,
  value: string,
|};

@observer
class HeaderSearchBar extends React.Component<Props> {
  @observable _textInput = React.createRef<typeof TextInput>();
  _isExpandToggleStore: ToggleStore = new ToggleStore();

  _onClosePress = () => {
    const { onClosePress, onChangeText } = this.props;
    Keyboard.dismiss();
    this._isExpandToggleStore.toggleOff();
    onChangeText('');
    onClosePress && onClosePress();
  };

  _onClearPress = () => {
    const { onClearPress, onChangeText } = this.props;
    onChangeText('');
    onClearPress && onClearPress();
  };

  _onExpandPress = () => {
    const { onExpandPress } = this.props;
    this._isExpandToggleStore.toggleOn();
    onExpandPress && onExpandPress();

    // TODO - verify that this works
    // when(
    //   (): boolean => !!this._textInput,
    //   (): void => {
    //     nullthrows(this._textInput.current).focus();
    //   },
    // );
  };

  render(): React.Node {
    const { value, onChangeText } = this.props;

    return (
      <View
        style={[
          styles.container,
          this._isExpandToggleStore.isToggled && styles.containerExpanded,
        ]}
      >
        {this._isExpandToggleStore.isToggled ? (
          <View style={styles.textInputContainer}>
            <HeaderIconButton name="arrow-back" onPress={this._onClosePress} />
            <TextInput
              autoFocus={true}
              onChangeText={onChangeText}
              placeholder="Search"
              placeholderTextColor={COLORS.textInverseFaded}
              ref={this._textInput}
              style={styles.textInput}
              underlineColorAndroid="transparent"
              value={value}
            />
            <HeaderIconButton name="close" onPress={this._onClearPress} />
          </View>
        ) : (
          <HeaderIconButton name="search" onPress={this._onExpandPress} />
        )}
      </View>
    );
  }
}

export default HeaderSearchBar;
