// @flow

import * as React from 'react';
import { Picker, StyleSheet, View } from 'react-native';
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
  onBlur?: () => void,
  onChange: (value: any) => void,
  placeholder: ?string,
  value: any,
  // other react-native Picker props
};

class PickerField extends React.Component<Props> {
  static defaultProps = {
    placeholder: 'Please select...',
  };

  static Item = Picker.Item;

  _onPickerValueChange = (value: any) => {
    // the check handles case when we load options asynchronously
    if (value === this.props.value) {
      return;
    }

    const { onBlur, onChange } = this.props;

    onChange(value);
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const {
      children,
      error,
      label,
      onBlur,
      onChange,
      placeholder,
      value,
      ...props
    } = this.props;

    if (!children) {
      return null;
    }

    return (
      <View>
        <FormLabel>{label}</FormLabel>
        <Picker
          style={styles.picker}
          {...props}
          onValueChange={this._onPickerValueChange}
          selectedValue={value}
        >
          {[
            !placeholder ? null : (
              <Picker.Item
                key={placeholder}
                label={placeholder}
                value={undefined}
              />
            ),
            ...React.Children.toArray(children),
          ].filter(Boolean)}
        </Picker>
        <View style={styles.underline} />
        <FormValidationMessage>{error}</FormValidationMessage>
      </View>
    );
  }
}

export default PickerField;
