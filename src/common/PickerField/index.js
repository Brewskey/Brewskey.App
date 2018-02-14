// @flow

import * as React from 'react';
import { observer } from 'mobx-react';
import { Picker, StyleSheet, View } from 'react-native';
import LoadingPicker from './LoadingPicker';
import { FormLabel, FormValidationMessage } from 'react-native-elements';

// todo
// we cant change fontSize of react-native Picker etc from the styles
// for android, have to use native theme and code
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  picker: {
    marginHorizontal: 11,
  },
  // eslint-disable-next-line react-native/no-color-literals
  underline: {
    backgroundColor: '#757575',
    height: 1,
    marginLeft: 17,
    marginRight: 17,
  },
});

export type Props = {
  children?: React.Node,
  error?: ?string,
  isLoading?: boolean,
  label?: string,
  onBlur?: () => void,
  onChange: (value: any) => void,
  placeholder?: string,
  value: any,
  // other react-native Picker props
};

@observer
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
      isLoading,
      label,
      onBlur,
      onChange,
      placeholder,
      value,
      ...props
    } = this.props;

    return (
      <View style={styles.container}>
        <FormLabel>{label}</FormLabel>
        {isLoading ? (
          <LoadingPicker />
        ) : (
          <Picker
            style={styles.picker}
            {...props}
            onValueChange={this._onPickerValueChange}
            selectedValue={value}
          >
            {[
              !placeholder ? null : (
                <Picker.Item
                  key="placeholder"
                  label={placeholder}
                  value={undefined}
                />
              ),
              ...React.Children.toArray(children),
            ].filter(Boolean)}
          </Picker>
        )}
        <View style={styles.underline} />
        <FormValidationMessage>{error}</FormValidationMessage>
      </View>
    );
  }
}

export default PickerField;
