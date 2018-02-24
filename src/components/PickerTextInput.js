// @flow

import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { View, TouchableOpacity } from 'react-native';
import { FormInput, FormLabel } from 'react-native-elements';

type Props<TEntity> = {|
  label: string,
  multiple?: boolean,
  onPress: () => void,
  placeholder?: string,
  stringValueExtractor: (item: TEntity) => string,
  value: PickerValue<TEntity>,
|};

@observer
class PickerTextInput<TEntity> extends React.Component<Props<TEntity>> {
  static defaultProps = {
    placeholder: 'Please select...',
    stringValueExtractor: (item: TEntity): string => item.name,
  };

  @computed
  get _stringValue(): string {
    const { multiple, stringValueExtractor, value } = this.props;

    if (multiple) {
      return value.map(stringValueExtractor).join(', ');
    }
    return value ? stringValueExtractor(value) : '';
  }

  render() {
    const { label, onPress, placeholder } = this.props;
    return (
      <View>
        <FormLabel>{label}</FormLabel>
        <TouchableOpacity onPress={onPress}>
          <FormInput
            editable={false}
            multiline
            placeholder={placeholder}
            value={this._stringValue}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default PickerTextInput;
