// @flow

import * as React from 'react';
import { CheckBox } from 'react-native-elements';
import { COLORS } from '../theme';

type Props = {
  description?: string,
  label: string,
  onBlur: () => void,
  onChange: (value: boolean) => void,
  value: boolean,
  // other react-native-elements checkbox props
};

class CheckBoxField extends React.PureComponent<Props> {
  _onCheckBoxValueChange = () => {
    this.props.onChange(!this.props.value);
    this.props.onBlur();
  };

  render() {
    const { label, value } = this.props;
    return (
      <CheckBox
        checkedColor={COLORS.primary}
        checked={value}
        onPress={this._onCheckBoxValueChange}
        title={label}
        {...this.props}
      />
    );
  }
}

// const styles = StyleSheet.create({
//   description: {
//     ...TYPOGRAPHY.paragraph,
//     color: COLORS.textFaded,
//   },
// });

export default CheckBoxField;
