// @flow

import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { COLORS } from '../../theme';

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

type Props<TValue> = {|
  onClearPress: () => void,
  onSelectPress: () => void,
  value: TValue,
|};

@observer
class PickerControl<TValue> extends React.Component<Props<TValue>> {
  render(): React.Node {
    const { onClearPress, onSelectPress, value } = this.props;
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
          titleStyle={styles.selectButtonText}
          title={selectButtonTitle}
          type="clear"
        />
      </View>
    );
  }
}

export default PickerControl;
