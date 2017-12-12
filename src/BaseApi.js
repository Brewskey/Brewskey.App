// @flow

import type { ObservableMap } from 'mobx';

import nullthrows from 'nullthrows';
import { LoadObject } from 'brewskey.js-api';
import { Atom, observable, runInAction } from 'mobx';

type RequestOptions<TResult> = {|
  cacheKey?: string,
  transformResponse?: (response: Any) => TResult,
|};

export const fetchJSON = async (...fetchArgs: Array<any>): Promise<any> => {
  // eslint-disable-next-line no-undef
  const response = await fetch(...fetchArgs);

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.error_description);
  }

  return responseJson;
};

class BaseApi {
  static _nonCachableRequestID = 0;
  __requestLoaderByKey: ObservableMap<LoadObject<any>> = new Map();
  @observable _atomByKey: ObservableMap<Atom> = new Map();

  flushCache = () => {
    this.__requestLoaderByKey.clear();
  };

  __getRequestLoader = <TResult>(
    {
      cacheKey: providedCacheKey,
      transformResponse = (result: any): TResult => result,
    }: RequestOptions,
    requestFn: (args: Array<any>) => Promise<any>,
    ...requestArgs
  ): LoadObject<TResult> => {
    const isRequestCachable = !!providedCacheKey;
    const cacheKey = isRequestCachable
      ? providedCacheKey
      : this._getNextNonCachableKey();

    if (!this.__requestLoaderByKey.has(cacheKey)) {
      const atom = new Atom(
        cacheKey,
        () => {},
        !isRequestCachable
          ? () => {
              this.__requestLoaderByKey.delete(cacheKey);
              this._atomByKey.delete(cacheKey);
            }
          : () => {},
      );

      this._atomByKey.set(cacheKey, atom);
      this.__requestLoaderByKey.set(cacheKey, LoadObject.loading());
      atom.reportChanged();

      requestFn(...requestArgs)
        .then(transformResponse)
        .then((result: TResult) => {
          runInAction(() => {
            this.__requestLoaderByKey.set(
              cacheKey,
              LoadObject.withValue(result),
            );
            atom.reportChanged();
          });
        })
        .catch((error: Error) => {
          runInAction(() => {
            this.__requestLoaderByKey.set(
              cacheKey,
              LoadObject.withError(error),
            );
            atom.reportChanged();
          });
        });
    }

    if (nullthrows(this._atomByKey.get(cacheKey)).reportObserved()) {
      return nullthrows(this.__requestLoaderByKey.get(cacheKey));
    }

    throw new Error(`Observable computation is called out of observer context`);
  };

  __getCacheKey = (requestName: string, ...args: Array<any>): string =>
    requestName + JSON.stringify(args);

  _getNextNonCachableKey = (): string => {
    this._nonCachableRequestID += 1;
    return `NON_CACHABLE_KEY_${this._nonCachableRequestID.toString()}`;
  };
}

export default BaseApi;
