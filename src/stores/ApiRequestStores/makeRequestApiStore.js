// @flow

import type { ObservableMap } from 'mobx';

import nullthrows from 'nullthrows';
import { action, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';

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

export const fetchJSON = async (...fetchArgs: Array<any>): Promise<any> => {
  // eslint-disable-next-line no-undef
  const response = await fetch(...fetchArgs);

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.error_description);
  }

  return responseJson;
};

type RequestApiStore<TResult> = {|
  flushCache: () => void,
  get: (...requestArgs: Array<any>) => LoadObject<TResult>,
|};

const makeRequestApiStore = <TResult>(
  getRequestPromise: (...args: Array<any>) => Promise<TResult>,
): RequestApiStore<TResult> => {
  const requestLoaderByKey: ObservableMap<LoadObject<TResult>> = observable(
    new Map(),
  );

  const get = (...requestArgs: Array<any>): LoadObject<TResult> => {
    const cacheKey = JSON.stringify(requestArgs).toLowerCase();
    const setLoaderValue = action((value: LoadObject<TResult>) =>
      requestLoaderByKey.set(cacheKey, value),
    );

    if (!requestLoaderByKey.has(cacheKey)) {
      setLoaderValue(LoadObject.loading());
      getRequestPromise(...requestArgs)
        .then((result: TResult): void =>
          setLoaderValue(LoadObject.withValue(result)),
        )
        .catch((error: Error): void =>
          setLoaderValue(LoadObject.withError(error)),
        );
    }

    return nullthrows(requestLoaderByKey.get(cacheKey));
  };

  const flushCache = () => requestLoaderByKey.clear();

  return { flushCache, get };
};

export default makeRequestApiStore;