// @flow

import * as React from 'react';
import { CheckBox, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 17,
    marginRight: 11,
  },
});

type Props = {
  label: string,
  onBlur: () => void,
  onChange: (value: boolean) => void,
  value: boolean,
  // other react-native checkbox props
};

class CheckBoxField extends React.Component<Props> {
  _onCheckBoxValueChange = (value: boolean) => {
    this.props.onChange(value);
    this.props.onBlur();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.label}</Text>
        <CheckBox {...this.props} onValueChange={this._onCheckBoxValueChange} />
      </View>
    );
  }
}

export default CheckBoxField;
