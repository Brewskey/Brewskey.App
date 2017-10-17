// @flow

import * as React from 'react';
import { Picker as RNPicker, StyleSheet, View } from 'react-native';
import { FormLabel, FormValidationMessage } from 'react-native-elements';

// todo
// we cant change fontSize of react-native Picker etc from the styles
// for android, have to use native theme and code
// placeholder is also just a stub for now
const styles = StyleSheet.create({
  picker: {
    marginLeft: 11,
    marginRight: 11,
  },
  // eslint-disable-next-line react-native/no-color-literals
  underline: {
    backgroundColor: '#757575',
    height: 1,
    marginLeft: 17,
    marginRight: 17,
  },
});

type Props = {
  children?: React.Node,
  error?: ?string,
  label?: string,
  onBlur: () => void,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
  // other react-native Picker props
};

class Picker extends React.Component<Props> {
  _onPickerValueChange = (value: any) => {
    this.props.onChange(value);
    this.props.onBlur();
  };

  render(): React.Element<*> {
    const {
      children,
      error,
      label,
      onBlur,
      onChange,
      placeholder = 'Please select...',
      value,
      ...props
    } = this.props;

    return (
      <View>
        <FormLabel>{label}</FormLabel>
        <RNPicker
          style={styles.picker}
          {...props}
          onValueChange={this._onPickerValueChange}
          selectedValue={value}
        >
          <RNPicker.Item label={placeholder} value={null} />
          {children}
        </RNPicker>
        <View style={styles.underline} />
        <FormValidationMessage>{error}</FormValidationMessage>
      </View>
    );
  }
}

Picker.Item = RNPicker.Item;

export default Picker;
