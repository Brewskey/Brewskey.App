// @flow

import type { Beverage } from 'brewskey.js-api';

import * as React from 'react';
import { View } from 'react-native';
import SectionHeader from '../../common/SectionHeader';
import SectionContent from '../../common/SectionContent';
import BeverageDetailsContent from './BeverageDetailsContent';

type Props = {|
  value: Beverage,
|};

const LoadedBeverageDetails = ({ value: beverage }: Props) => (
  <View>
    <SectionHeader title={beverage.name} />
    <SectionContent>
      <BeverageDetailsContent beverage={beverage} />
    </SectionContent>
  </View>
);

export default LoadedBeverageDetails;
