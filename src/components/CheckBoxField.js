// @flow

import * as React from 'react';
import { CheckBox } from 'react-native-elements';
import { COLORS } from '../theme';

type Props = {|
  label: string,
  onChange: (value: boolean) => void,
  value: boolean,
  // other react-native-elements checkbox props
|};

class CheckBoxField extends React.PureComponent<Props> {
  _onCheckBoxValueChange = () => {
    this.props.onChange(!this.props.value);
  };

  render(): React.Node {
    const { label, onChange: _1, value, ...otherProps } = this.props;
    return (
      <CheckBox
        checkedColor={COLORS.primary}
        checked={value}
        onPress={this._onCheckBoxValueChange}
        title={label}
        {...otherProps}
      />
    );
  }
}

export default CheckBoxField;
