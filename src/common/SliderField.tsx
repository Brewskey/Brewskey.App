import * as React from 'react';
import Slider from '@react-native-community/slider';

export type Props<TRest> = // RN slider props
(TRest) & {
  onChange: (value: number) => void,
  value: number
};

const SliderField = <TRest extends unknown>(
  {
    value,
    onChange,
    ...rest
  }: Props<TRest>,
): React.ReactElement => <Slider {...rest} value={value} onValueChange={onChange} />;

export default SliderField;
