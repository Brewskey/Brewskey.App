// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Style } from '../types';
import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View } from 'react-native';
import {
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';

type Props<TEntity> = {
  error?: ?string,
  inputStyle?: Style,
  label: string,
  labelStyle?: Style,
  onPress: () => void,
  placeholder?: string,
  stringValueExtractor: (item: TEntity) => string,
  value?: PickerValue<TEntity>,
  // other react-native textInput props
};

@observer
class PickerTextInput<TEntity: { id: EntityID }> extends React.Component<
  Props<TEntity>,
> {
  static defaultProps = {
    placeholder: 'Please select...',
    stringValueExtractor: (item: Object): string => item.name,
  };

  @computed
  get _stringValue(): string {
    const { stringValueExtractor, value } = this.props;

    if (Array.isArray(value)) {
      return value.map(stringValueExtractor).join(', ');
    }
    return value ? stringValueExtractor(value) : '';
  }

  render() {
    const {
      error,
      label,
      labelStyle,
      onPress,
      placeholder,
      ...rest
    } = this.props;

    // have to wrap Input in view to be able to get touch event on Touchable
    // https://github.com/facebook/react-native/issues/14958
    return (
      <TouchableOpacity onPress={onPress}>
        <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
        <View pointerEvents="none">
          <FormInput
            {...rest}
            editable={false}
            multiline
            placeholder={placeholder}
            value={this._stringValue}
          />
        </View>
        <FormValidationMessage>{error}</FormValidationMessage>
      </TouchableOpacity>
    );
  }
}

export default PickerTextInput;
