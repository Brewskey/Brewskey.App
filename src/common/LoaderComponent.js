// @flow

import type { LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import LoadingIndicator from './LoadingIndicator';
import { mapIsLoadingDeep } from '../stores/DAOStores';

type Props<TValue, TExtraProps = {}> = {
  ...TExtraProps,
  deletingComponent: React.ComponentType<TExtraProps>,
  errorComponent: React.ComponentType<{ ...TExtraProps, error: Error }>,
  loadedComponent: React.ComponentType<{ ...TExtraProps, value: TValue }>,
  loader: LoadObject<TValue>,
  loadingComponent: React.ComponentType<TExtraProps>,
  updatingComponent: React.ComponentType<TExtraProps>,
  waitForLoadedDeep: boolean,
};

const LoaderComponent = <TValue, TExtraProps>({
  deletingComponent: DeletingComponent,
  errorComponent: ErrorComponent,
  loadedComponent: LoadedComponent,
  loader,
  loadingComponent: LoadingComponent,
  updatingComponent: UpdatingComponent,
  waitForLoadedDeep,
  ...rest
}: Props<TValue, TExtraProps>): React.Node => {
  const resultLoader = waitForLoadedDeep ? mapIsLoadingDeep(loader) : loader;

  if (resultLoader.isLoading()) {
    return <LoadingComponent {...rest} />;
  }

  if (resultLoader.isUpdating()) {
    return <UpdatingComponent {...rest} />;
  }

  if (resultLoader.isDeleting()) {
    return <DeletingComponent {...rest} />;
  }

  if (resultLoader.hasError()) {
    return (
      <ErrorComponent {...rest} error={resultLoader.getErrorEnforcing()} />
    );
  }

  return <LoadedComponent {...rest} value={resultLoader.getValueEnforcing()} />;
};

LoaderComponent.defaultProps = {
  deletingComponent: () => null,
  errorComponent: () => null,
  loadingComponent: LoadingIndicator,
  updatingComponent: () => null,
};

export default LoaderComponent;
