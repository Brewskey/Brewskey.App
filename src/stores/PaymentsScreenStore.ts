import type { CreditCardDetails } from '@brewskey/js-api';

export interface PaymentFormParams {
  cvc: string;
  expMonth: number;
  expYear: number;
  number: string;
}

class PaymentsScreenStore {
  _isLoading = false;

  get isLoading(): boolean {
    return false;
  }

  async addNewCard(
    isValid: boolean,
    _formParams: PaymentFormParams,
  ): Promise<void> {
    if (!isValid) {
      return;
    }

    this._isLoading = true;

    // try {
    //   const { tokenId } = { tokenId: '' } as const; // await stripe.createTokenWithCard(formParams);
    //   PaymentsDAO.flushCache();
    //   PaymentsDAO.addPaymentMethod(tokenId);
    //   await PaymentsDAO.waitForLoadedNullable((dao) => dao.get());
    //   SnackBarStore.showMessage({
    //     style: 'success',
    //     text: 'You successfully added your card',
    //   });
    // } catch (error: any) {
    //   SnackBarStore.showMessage({
    //     style: 'danger',
    //     text: 'There was an error adding your card',
    //   });
    // }

    // runInAction(() => {
    //   this._isLoading = false;
    // });
  }

  async removeCard(): Promise<void> {
    this._isLoading = true;

    // try {
    //   PaymentsDAO.removePaymentMethod();
    //   await PaymentsDAO.waitForLoadedNullable((dao) => dao.get());
    //   SnackBarStore.showMessage({
    //     style: 'success',
    //     content: 'You successfully removed your card',
    //   });
    // } catch (error) {
    //   SnackBarStore.showMessage({
    //     style: 'danger',
    //     content: 'There was an error removing your card',
    //   });
    // }

    // runInAction(() => {
    //   this._isLoading = false;
    // });
  }

  get creditCardDetailsLoader(): Promise<CreditCardDetails> {
    return Promise.reject();
    // return PaymentsStore.get();
  }
}

export default new PaymentsScreenStore();
