import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';
import { Button } from '@rneui/themed';

const styles = StyleSheet.create({
  clearButtonDisabled: {
    backgroundColor: 'transparent',
  },
  clearButtonDisabledText: {
    color: COLORS.textFaded,
  },
  clearButtonText: {
    color: COLORS.danger,
  },
  container: {
    alignItems: 'center',
    borderColor: COLORS.secondary3,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 49,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  selectButtonText: {
    color: COLORS.primary2,
  },
});

type Props<TValue> = {
  onClearPress: () => void;
  onSelectPress: () => void;
  value: TValue;
};

const PickerControl = <TValue,>({
  onClearPress,
  onSelectPress,
  value,
}: Props<TValue>): React.ReactElement => {
  const selectButtonTitle =
    Array.isArray(value) && value.length
      ? `Select(${value.length})`
      : 'Select';

  return (
    <View style={styles.container}>
      <Button
        disabled={Array.isArray(value) ? !value.length : !value}
        disabledStyle={styles.clearButtonDisabled}
        disabledTitleStyle={styles.clearButtonDisabledText}
        onPress={onClearPress}
        titleStyle={styles.clearButtonText}
        title="Clear"
        type="clear"
      />
      <Button
        onPress={onSelectPress}
        testID="picker-control-select-button"
        titleStyle={styles.selectButtonText}
        title={selectButtonTitle}
        type="clear"
      />
    </View>
  );
};

export default PickerControl;
