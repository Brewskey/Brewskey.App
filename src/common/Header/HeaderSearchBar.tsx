import * as React from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';

import ToggleStore from '../../stores/ToggleStore';
import { HeaderIconButton } from './HeaderIconButton';

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

type Props = {
  onChangeText: (value: string) => void;
  onClearPress?: () => void;
  onClosePress?: () => void;
  onExpandPress?: () => void;
  value: string;
};

export const HeaderSearchBar: React.FC<Props> = ({
  onClosePress,
  onClearPress,
  onChangeText,
  onExpandPress,
  value,
}) => {
  const [isTextbarVisible, setIsTextBarVisible] =
    React.useState<boolean>(false);

  const _onClosePress = () => {
    setIsTextBarVisible(false);
    Keyboard.dismiss();
    onChangeText('');
    onClosePress?.();
  };

  const _onClearPress = () => {
    onChangeText('');
    onClearPress?.();
  };

  const _onExpandPress = () => {
    setIsTextBarVisible(true);
    onExpandPress?.();

    // TODO - verify that this works
    // when(
    //   (): boolean => !!this._textInput,
    //   (): void => {
    //     nullthrows(this._textInput.current).focus();
    //   },
    // );
  };

  return (
    <View
      style={[styles.container, isTextbarVisible && styles.containerExpanded]}
    >
      {isTextbarVisible ? (
        <View style={styles.textInputContainer}>
          <HeaderIconButton name="arrow-back" onPress={_onClosePress} />
          <TextInput
            autoFocus={true}
            onChangeText={onChangeText}
            placeholder="Search"
            placeholderTextColor={COLORS.textInverseFaded}
            style={styles.textInput}
            underlineColorAndroid="transparent"
            value={value}
          />
          <HeaderIconButton name="close" onPress={_onClearPress} />
        </View>
      ) : (
        <HeaderIconButton name="search" onPress={_onExpandPress} />
      )}
    </View>
  );
};
