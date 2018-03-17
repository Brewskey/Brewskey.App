// @flow

import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { TouchableOpacity } from 'react-native';
import Fragment from '../common/Fragment';
import {
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';

type Props<TEntity> = {|
  error?: ?string,
  label: string,
  onPress: () => void,
  placeholder?: string,
  stringValueExtractor: (item: TEntity) => string,
  value: PickerValue<TEntity>,
|};

@observer
class PickerTextInput<TEntity> extends React.Component<Props<TEntity>> {
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
    const { error, label, onPress, placeholder } = this.props;
    return (
      <Fragment>
        <FormLabel>{label}</FormLabel>
        <TouchableOpacity onPress={onPress}>
          <FormInput
            editable={false}
            multiline
            placeholder={placeholder}
            value={this._stringValue}
          />
          <FormValidationMessage>{error}</FormValidationMessage>
        </TouchableOpacity>
      </Fragment>
    );
  }
}

export default PickerTextInput;
