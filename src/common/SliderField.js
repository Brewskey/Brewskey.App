// @flow

import * as React from 'react';
import { Slider } from 'react-native';

export type Props = {
  onChange: (value: number) => void,
  value: number,
  // RN slider props
};

const SliderField = ({ value, onChange, ...rest }: Props) => (
  <Slider {...rest} value={value} onValueChange={onChange} />
);

export default SliderField;
