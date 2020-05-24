// @flow

import type { ObservableMap } from 'mobx';

import nullthrows from 'nullthrows';
import { action, observable, runInAction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { LoadObject } from 'brewskey.js-api';

// Collection of all the API stores. This is used for flushing when
// logging out.
const STORES: Array<Store<any>> = [];

export const flushAPIStoreCaches = () =>
  STORES.forEach((store) => store.flushCache());

export const deepIdCast = (node: any): any => {
  Object.keys(node).forEach((key: string) => {
    if (node[key] === Object(node[key])) {
      deepIdCast(node[key]);
    }
    if (key === 'id') {
      // eslint-disable-next-line
      node[key] = node[key].toString();
    }
  });
  return node;
};

const getCacheKey = (requestArgs: Array<any>): string =>
  `_${JSON.stringify(requestArgs).toLowerCase()}`;

class Store<TResult> {
  @observable
  _requestLoaderByKey: ObservableMap<
    string,
    LoadObject<TResult>,
  > = observable.map();

  _getRequestPromise: (...args: Array<any>) => Promise<TResult>;

  constructor(getRequestPromise: (...args: Array<any>) => Promise<TResult>) {
    this._getRequestPromise = getRequestPromise;
  }

  @action
  fetch(...requestArgs: Array<any>): string {
    const cacheKey = getCacheKey(requestArgs);

    if (!this._requestLoaderByKey.has(cacheKey)) {
      this._setValue(cacheKey, LoadObject.loading());
      this._getRequestPromise(...requestArgs)
        .then((result: TResult): void =>
          this._setValue(cacheKey, LoadObject.withValue(result)),
        )
        .catch((error: Error): void =>
          this._setValue(cacheKey, LoadObject.withError(error)),
        );
    }

    return cacheKey;
  }

  @action
  flushCache() {
    this._requestLoaderByKey = observable.map();
  }

  get(...requestArgs: Array<any>): LoadObject<TResult> {
    console.log('get');
    const cacheKey = this.fetch(...requestArgs);
    return nullthrows(this._requestLoaderByKey.get(cacheKey));
  }

  @action
  getFromCache(cacheKey: string): LoadObject<TResult> {
    return this._requestLoaderByKey.get(cacheKey) || LoadObject.empty();
  }

  _setValue(cacheKey: string, value: LoadObject<TResult>) {
    runInAction(() => this._requestLoaderByKey.set(cacheKey, value));
  }
}

const makeRequestApiStore = <TResult>(
  getRequestPromise: (...args: Array<any>) => Promise<TResult>,
): Store<TResult> => {
  const store = new Store(getRequestPromise);
  STORES.push(store);

  return store;
};

export default makeRequestApiStore;
