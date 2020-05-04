// @flow

import type { Srm } from 'brewskey.js-api';
import type { Style } from '../../types';
import type { PickerValue } from '../../stores/PickerStore';
import type { Props as PickerTextInputProps } from './PickerTextInput';

import * as React from 'react';
import { observer } from 'mobx-react';
import PickerInput from './PickerInput';
import PickerSrmInputValue from './PickerSrmInputValue';

type Props = PickerTextInputProps<Srm>;

@observer
class PickerSrmInput extends React.Component<Props> {
  static defaultProps: {| placeholder: string |} = {
    placeholder: 'Please select...',
  };

  render(): React.Node {
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
