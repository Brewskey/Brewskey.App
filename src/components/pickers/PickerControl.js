// @flow

import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react/native';
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

type Props<TEntity, TMultiple: boolean> = {|
  multiple: TMultiple,
  onClearPress: () => void,
  onSelectPress: () => void,
  value: PickerValue<TEntity, TMultiple>,
|};

@observer
class PickerControl<TEntity, TMultiple: boolean> extends React.Component<
  Props<TEntity, TMultiple>,
> {
  static defaultProps = {
    multiple: false,
  };

  render() {
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
          disabledTextStyle={styles.clearButtonDisabledText}
          onPress={onClearPress}
          textStyle={styles.clearButtonText}
          title="Clear"
          transparent
        />
        <Button
          onPress={onSelectPress}
          textStyle={styles.selectButtonText}
          title={selectButtonTitle}
          transparent
        />
      </View>
    );
  }
}

export default PickerControl;
