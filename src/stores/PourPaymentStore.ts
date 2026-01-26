import DAOApi, { TapDAO } from '@brewskey/js-api';

import type {
  CreditCardDetails,
  EntityID,
  QueryOptions,
  Tap,
} from '@brewskey/js-api';

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

  get tapsWithPaymentEnabled(): Promise<Tap[]> {
    return TapDAO.fetchMany(this._queryOptions);
  }

  get hasCreditCardDetails(): boolean {
    return false;
    // return (
    //   PaymentsStore.get()
    //     .map((details) => !!details)
    //     .getValue() || false
    // );
  }
}

export default PourPaymentStore;
