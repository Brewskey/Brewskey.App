// @flow

import { LoadObject } from 'brewskey.js-api';

export const doRequest = async (...fetchArgs: Array<any>): Promise<any> => {
  // eslint-disable-next-line no-undef
  const response = await fetch(...fetchArgs);

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.error_description);
  }

  return responseJson;
};

// todo add some helpers so we won't have to call emitChanges() in everyplace
// and actully made some helper to avoid boilerplate in every api method
class BaseApi {
  __requestLoaderByKey: Map<string, LoadObject<any>> = new Map();
  _subscriptions: Set<() => void> = new Set();

  subscribe(handler: () => void) {
    this._subscriptions.add(handler);
  }

  unsubscribe(handler: () => void) {
    this._subscriptions.delete(handler);
  }

  __emitChanges() {
    this._subscriptions.forEach((handler: () => void): void => handler());
  }

  __getCacheKey = (requestName: string, ...args: Array<any>): string =>
    requestName + JSON.stringify(args);
}

export default BaseApi;
