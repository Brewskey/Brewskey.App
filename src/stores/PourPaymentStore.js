// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';

import DAOApi from 'brewskey.js-api';
import { computed } from 'mobx';
import { TapStore } from './DAOStores';

class PourPaymentStore {
  _queryOptions: QueryOptions;

  constructor(deviceID: EntityID) {
    this._queryOptions = {
      filters: [
        DAOApi.createFilter('device/id').equals(deviceID),
        DAOApi.createFilter('isPaymentEnabled').equals(true),
      ],
    };
  }

  @computed
  get tapsWithPaymentEnabled(): LoadObject<Array<NearbyLocation>> {
    return TapStore.getMany(this._queryOptions).map(taps =>
      taps.map(tap => tap.getValue()).filter(Boolean),
    );
  }
}

export default PourPaymentStore;
