// @flow

import type { CreditCardDetails, LoadObject } from 'brewskey.js-api';

//import stripe from 'tipsi-stripe';
import { action, computed, observable, runInAction } from 'mobx';
import { PaymentsStore } from './DAOStores';
import DAOApi from 'brewskey.js-api';
import SnackBarStore from './SnackBarStore';

export type PaymentFormParams = {|
  cvc: string,
  expMonth: number,
  expYear: number,
  number: string,
|};

const { PaymentsDAO } = DAOApi;

class PaymentsScreenStore {
  @observable
  _isLoading: boolean = false;

  @computed
  get isLoading(): boolean {
    return this._isLoading || this.creditCardDetailsLoader.isLoading();
  }

  @action
  async addNewCard(
    isValid: boolean,
    formParams: PaymentFormParams,
  ): Promise<void> {
    if (!isValid) {
      return;
    }

    this._isLoading = true;

    try {
      const { tokenId } = { tokenId: '' }; // await stripe.createTokenWithCard(formParams);
      PaymentsDAO.flushCache();
      PaymentsDAO.addPaymentMethod(tokenId);
      await PaymentsDAO.waitForLoadedNullable((dao) => dao.get());
      SnackBarStore.showMessage({
        style: 'success',
        text: 'You successfully added your card',
      });
    } catch (error) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: 'There was an error adding your card',
      });
    }

    runInAction(() => {
      this._isLoading = false;
    });
  }

  @action
  async removeCard(): Promise<void> {
    this._isLoading = true;

    try {
      PaymentsDAO.removePaymentMethod();
      await PaymentsDAO.waitForLoadedNullable((dao) => dao.get());
      SnackBarStore.showMessage({
        style: 'success',
        text: 'You successfully removed your card',
      });
    } catch (error) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: 'There was an error removing your card',
      });
    }

    runInAction(() => {
      this._isLoading = false;
    });
  }

  @computed
  get creditCardDetailsLoader(): LoadObject<CreditCardDetails> {
    return PaymentsStore.get();
  }
}

export default (new PaymentsScreenStore(): PaymentsScreenStore);
