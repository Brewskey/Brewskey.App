// @flow

import type { Beverage, LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import LoaderComponent from '../../common/LoaderComponent';
import LoadedBeverageDetails from './LoadedBeverageDetails';

type Props = {|
  loader: LoadObject<Beverage>,
|};

// todo implement loading beverage Details component
const BeverageDetailsLoader = observer(({ loader }: Props) => (
  <LoaderComponent loadedComponent={LoadedBeverageDetails} loader={loader} />
));

export default BeverageDetailsLoader;
