// @flow

import * as React from 'react';
import { Slider } from 'react-native';

export type Props<TRest> = {|
  // RN slider props
  ...TRest,
  onChange: (value: number) => void,
  value: number,
|};

const SliderField = <TRest>({ value, onChange, ...rest }: Props<TRest>) => (
  <Slider {...rest} value={value} onValueChange={onChange} />
);

export default SliderField;
