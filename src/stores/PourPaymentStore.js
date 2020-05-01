// @flow

import type {
  CreditCardDetails,
  EntityID,
  LoadObject,
  QueryOptions,
  Tap,
} from 'brewskey.js-api';
import type { NearbyLocation } from '../types';

import DAOApi from 'brewskey.js-api';
import { computed } from 'mobx';
import { PaymentsStore, TapStore } from './DAOStores';

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
  get tapsWithPaymentEnabled(): LoadObject<Array<Tap>> {
    return TapStore.getMany(this._queryOptions).map((taps) =>
      taps.map((tap) => tap.getValue()).filter(Boolean),
    );
  }

  @computed
  get hasCreditCardDetails(): boolean {
    return (
      PaymentsStore.get()
        .map((details) => !!details)
        .getValue() || false
    );
  }
}

export default PourPaymentStore;
