// @flow

import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import LoaderComponent from '../../common/LoaderComponent';
import LoadedBeverageDetails from './LoadedBeverageDetails';
import EmptyBeverageDetails from './EmptyBeverageDetails';

type Props = {|
  tapId: EntityID,
  loader: LoadObject<Beverage>,
|};

// todo implement loading beverage Details component
const BeverageDetailsLoader = observer(({ loader, tapId }: Props) => (
  <LoaderComponent
    emptyComponent={EmptyBeverageDetails}
    loadedComponent={LoadedBeverageDetails}
    loader={loader}
    tapId={tapId}
  />
));

export default BeverageDetailsLoader;
