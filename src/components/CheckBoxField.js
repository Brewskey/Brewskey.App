// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import { CheckBox, Text } from 'react-native';

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 17;
  margin-right: 11;
`;

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
      <Container>
        <Text>{this.props.label}</Text>
        <CheckBox {...this.props} onValueChange={this._onCheckBoxValueChange} />
      </Container>
    );
  }
}

export default CheckBoxField;
