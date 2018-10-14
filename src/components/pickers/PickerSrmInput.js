// @flow

import type { Srm } from 'brewskey.js-api';
import type { Style } from '../../types';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import PickerInput from './PickerInput';
import PickerSrmInputValue from './PickerSrmInputValue';

type Props = {
  error?: ?string,
  inputStyle?: Style,
  label: string,
  labelStyle?: Style,
  onPress: () => void,
  placeholder?: string,
  value?: PickerValue<Srm, false>,
  // other react-native textInput props
};

@observer
class PickerSrmInput extends React.Component<Props> {
  static defaultProps = {
    placeholder: 'Please select...',
  };

  render() {
    const {
      error,
      label,
      labelStyle,
      onPress,
      placeholder,
      value,
    } = this.props;

    return (
      <PickerInput
        labelStyle={labelStyle}
        error={error}
        label={label}
        onPress={onPress}
        placeholder={placeholder}
        value={value}
      >
        {value && !Array.isArray(value) ? (
          <PickerSrmInputValue srm={value} />
        ) : null}
      </PickerInput>
    );
  }
}

export default PickerSrmInput;
