// @flow

import type { Srm } from 'brewskey.js-api';

import * as React from 'react';
import ColorIcon from '../../common/ColorIcon';

type Props = {
  srm: Srm,
};

const PickerSrmInputValue = ({ srm }: Props) => (
  <ColorIcon color={`#${srm.hex}`} size={25} />
);

export default PickerSrmInputValue;
