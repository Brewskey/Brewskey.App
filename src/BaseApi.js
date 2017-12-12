// @flow

import type { ObservableMap } from 'mobx';

import nullthrows from 'nullthrows';
import { LoadObject } from 'brewskey.js-api';
import { observable, runInAction } from 'mobx';

type RequestOptions<TResult> = {|
  cacheKey: string,
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
  @observable __requestLoaderByKey: ObservableMap<LoadObject<any>> = new Map();

  flushCache = () => {
    this.__requestLoaderByKey.clear();
  };

  __getRequestLoader = <TResult>(
    {
      cacheKey,
      transformResponse = (result: any): TResult => result,
    }: RequestOptions,
    requestFn: (args: Array<any>) => Promise<any>,
    ...requestArgs
  ): LoadObject<TResult> => {
    if (!this.__requestLoaderByKey.has(cacheKey)) {
      this.__requestLoaderByKey.set(cacheKey, LoadObject.loading());

      requestFn(...requestArgs)
        .then(transformResponse)
        .then((result: TResult) => {
          runInAction(() => {
            this.__requestLoaderByKey.set(
              cacheKey,
              LoadObject.withValue(result),
            );
          });
        })
        .catch((error: Error) => {
          runInAction(() => {
            this.__requestLoaderByKey.set(
              cacheKey,
              LoadObject.withError(error),
            );
          });
        });
    }

    return nullthrows(this.__requestLoaderByKey.get(cacheKey));
  };

  __getCacheKey = (requestName: string, ...args: Array<any>): string =>
    requestName + JSON.stringify(args);
}

export default BaseApi;
