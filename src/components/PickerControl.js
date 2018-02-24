// @flow

import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { COLORS } from '../theme';

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
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  selectButtonText: {
    color: COLORS.primary2,
  },
});

type Props = {|
  multiple: boolean,
  onClearPress: () => void,
  onSelectPress: () => void,
  value: PickerValue<*>,
|};

@observer
class PickerControl extends React.Component<Props> {
  render() {
    const { multiple, onClearPress, onSelectPress, value } = this.props;
    const selectButtonTitle =
      multiple && value && value.length ? `Select(${value.length})` : 'Select';

    return (
      <View style={styles.container}>
        <Button
          disabled={multiple ? !value.length : !value}
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
