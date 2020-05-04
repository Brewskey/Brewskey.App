// @flow
import type { Style } from '../../types';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import PickerInput from './PickerInput';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  valueText: {
    color: COLORS.textInput,
    fontSize: 17,
  },
});

export type Props<TValue> = {|
  description?: React.Node,
  error?: ?string,
  inputStyle?: Style,
  label: string,
  labelStyle?: Style,
  onPress: () => void,
  placeholder?: string,
  stringValueExtractor: (item: TValue) => string,
  value: ?TValue | Array<TValue>,
  // other react-native textInput props
|};

@observer
class PickerTextInput<TValue> extends React.Component<Props<TValue>> {
  static defaultProps = {
    placeholder: 'Please select...',
  };

  @computed
  get _stringValue(): string {
    const { stringValueExtractor, value } = this.props;

    if (Array.isArray(value)) {
      return value.map(stringValueExtractor).join(', ');
    }
    return value ? stringValueExtractor(value) : '';
  }

  render(): React.Node {
    const {
      description,
      error,
      inputStyle,
      label,
      labelStyle,
      onPress,
      placeholder,
      value,
    } = this.props;

    return (
      <PickerInput
        description={description}
        labelStyle={labelStyle}
        error={error}
        label={label}
        onPress={onPress}
        placeholder={placeholder}
        value={value}
      >
        <Text style={[styles.valueText, inputStyle]}>{this._stringValue}</Text>
      </PickerInput>
    );
  }
}

export default PickerTextInput;
