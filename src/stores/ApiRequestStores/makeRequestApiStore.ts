import nullthrows from 'nullthrows';

// Collection of all the API stores. This is used for flushing when
// logging out.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STORES: Array<Store<any>> = [];

export const flushAPIStoreCaches = () =>
  STORES.forEach((store) => store.flushCache());

let iter = 0;
const getCacheKey = (requestArgs: unknown[]): string =>
  `_${JSON.stringify(requestArgs).toLowerCase()}`;

class Store<TResult> {
  _requestLoaderByKey: Map<string, Promise<TResult>> = new Map();

  _iterator = 0;

  _getRequestPromise: (...args: unknown[]) => Promise<TResult>;

  _storeIndex = 0;

  constructor(getRequestPromise: (...args: unknown[]) => Promise<TResult>) {
    this._getRequestPromise = getRequestPromise;
    this._storeIndex = iter++;
  }

  fetch(...requestArgs: unknown[]): string {
    const cacheKey = getCacheKey(requestArgs) + '__' + this._storeIndex;

    if (!this._requestLoaderByKey.has(cacheKey)) {
      this._setValue(cacheKey, this._getRequestPromise(...requestArgs));
    }

    return cacheKey;
  }

  flushCache = () => {
    this._requestLoaderByKey.clear();
  };

  get = (...requestArgs: unknown[]): Promise<TResult> => {
    const cacheKey = this.fetch(...requestArgs);
    return nullthrows(this._requestLoaderByKey.get(cacheKey));
  };

  getFromCache = (cacheKey: string): Promise<TResult> => {
    return this._requestLoaderByKey.get(cacheKey) || Promise.reject();
  };

  _setValue = (cacheKey: string, value: Promise<TResult>) => {
    this._requestLoaderByKey.delete(cacheKey);
    this._requestLoaderByKey.set(cacheKey, value);
    this._iterator += 1;
  };
}

const makeRequestApiStore: <TResult>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRequestPromise: (...args: any[]) => Promise<TResult>,
) => Store<TResult> = (getRequestPromise) => {
  const store = new Store(getRequestPromise);
  STORES.push(store);

  return store;
};

export default makeRequestApiStore;
