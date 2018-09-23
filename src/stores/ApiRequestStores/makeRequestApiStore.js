// @flow

import type { ObservableMap } from 'mobx';

import nullthrows from 'nullthrows';
import { action, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';

// Collection of all the API stores. This is used for flushing when
// logging out.
const STORES: Array<{ flushCache: () => void }> = [];

export const flushAPIStoreCaches = () =>
  STORES.forEach(store => store.flushCache());

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

type RequestApiStore<TResult> = {|
  fetch: (...requestArgs: Array<any>) => string,
  flushCache: () => void,
  get: (...requestArgs: Array<any>) => LoadObject<TResult>,
  getFromCache: (cacheKey: string) => LoadObject<TResult>,
|};

const getCacheKey = (requestArgs: Array<any>): string =>
  `_${JSON.stringify(requestArgs).toLowerCase()}`;

const makeRequestApiStore = <TResult>(
  getRequestPromise: (...args: Array<any>) => Promise<TResult>,
): RequestApiStore<TResult> => {
  const requestLoaderByKey: ObservableMap<
    string,
    ?LoadObject<TResult>,
  > = observable.map();

  const fetch = (...requestArgs: Array<any>): string => {
    const cacheKey = getCacheKey(requestArgs);

    const setLoaderValue = action((value: LoadObject<TResult>) =>
      requestLoaderByKey.set(cacheKey, value),
    );

    if (!requestLoaderByKey.has(cacheKey)) {
      setLoaderValue(LoadObject.loading());
      getRequestPromise(...requestArgs)
        .then(
          (result: TResult): void =>
            setLoaderValue(LoadObject.withValue(result)),
        )
        .catch(
          (error: Error): void => setLoaderValue(LoadObject.withError(error)),
        );
    }

    return cacheKey;
  };

  const get = (...requestArgs: Array<any>): LoadObject<TResult> => {
    const cacheKey = getCacheKey(requestArgs);
    fetch(...requestArgs);
    return nullthrows(requestLoaderByKey.get(cacheKey));
  };

  const getFromCache = (cacheKey: string): LoadObject<TResult> =>
    requestLoaderByKey.get(cacheKey) || LoadObject.empty();

  const flushCache = () => requestLoaderByKey.clear();

  const store = { fetch, flushCache, get, getFromCache };

  STORES.push(store);

  return store;
};

export default makeRequestApiStore;
