// @flow

import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import { computed } from 'mobx';
import { BeverageStore } from '../stores/DAOStores';
import { observer } from 'mobx-react';
import LoaderComponent from '../common/LoaderComponent';
import BeverageDetailsContent from './BeverageDetailsContent';

type Props = {|
  beverageID: EntityID,
  loader: LoadObject<Beverage>,
  tapId: EntityID,
|};

@observer
class BeverageDetailsLoader extends React.Component<Props> {
  @computed
  get _beverageLoader() {
    return BeverageStore.getByID(this.props.beverageID);
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedBeverageDetails}
        loader={this._beverageLoader}
      />
    );
  }
}

const LoadedBeverageDetails = ({ value: beverage }: Props) => (
  <BeverageDetailsContent beverage={beverage} />
);

export default BeverageDetailsLoader;
