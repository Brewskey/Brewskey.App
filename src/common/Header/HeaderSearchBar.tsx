import { useState } from 'react';

import { Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { HeaderIconButton } from 'common/Header/HeaderIconButton';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { FC } from 'react';

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

interface Props {
  onChangeText: (value: string) => void;
  onClearPress?: () => void;
  onClosePress?: () => void;
  onExpandPress?: () => void;
  value: string;
}

export const HeaderSearchBar: FC<Props> = ({
  onClosePress,
  onClearPress,
  onChangeText,
  onExpandPress,
  value,
}) => {
  const [isTextbarVisible, setIsTextBarVisible] = useState<boolean>(false);

  const onClosePressHandler = () => {
    setIsTextBarVisible(false);
    Keyboard.dismiss();
    onChangeText('');
    onClosePress?.();
  };

  const onClearPressHandler = () => {
    onChangeText('');
    onClearPress?.();
  };

  const onExpandPressHandler = () => {
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
          <HeaderIconButton name="arrow-back" onPress={onClosePressHandler} />
          <TextInput
            autoFocus
            onChangeText={onChangeText}
            placeholder="Search"
            placeholderTextColor={COLORS.textInverseFaded}
            style={styles.textInput}
            underlineColorAndroid="transparent"
            value={value}
          />
          <HeaderIconButton name="close" onPress={onClearPressHandler} />
        </View>
      ) : (
        <HeaderIconButton name="search" onPress={onExpandPressHandler} />
      )}
    </View>
  );
};
