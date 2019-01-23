// @flow

import type {
  CreditCardDetails,
  EntityID,
  QueryOptions,
} from 'brewskey.js-api';

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
  get tapsWithPaymentEnabled(): LoadObject<Array<NearbyLocation>> {
    return TapStore.getMany(this._queryOptions).map(taps =>
      taps.map(tap => tap.getValue()).filter(Boolean),
    );
  }

  @computed
  get hasCreditCardDetails(): LoadObject<CreditCardDetails> {
    return (
      PaymentsStore.get()
        .map(details => !!details)
        .getValue() || false
    );
  }
}

export default PourPaymentStore;
