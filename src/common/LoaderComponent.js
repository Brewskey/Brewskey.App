// @flow

import type { LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import LoadingIndicator from './LoadingIndicator';

type Props<TValue, TExtraProps = {}> = {
  ...TExtraProps,
  deletingComponent: React.ComponentType<TExtraProps>,
  emptyComponent: React.ComponentType<TExtraProps>,
  errorComponent: React.ComponentType<{ ...TExtraProps, error: Error }>,
  loadedComponent: React.ComponentType<{ ...TExtraProps, value: TValue }>,
  loader: LoadObject<TValue>,
  loadingComponent: React.ComponentType<TExtraProps>,
  updatingComponent: React.ComponentType<{ ...TExtraProps, value: TValue }>,
};

const LoaderComponent = observer(
  // todo fix when they will add forwardRef to React types
  (React: any).forwardRef(
    <TValue, TExtraProps>(
      {
        deletingComponent: DeletingComponent,
        emptyComponent: EmptyComponent,
        errorComponent: ErrorComponent,
        loadedComponent: LoadedComponent,
        loader,
        loadingComponent: LoadingComponent,
        updatingComponent: UpdatingComponent,
        ...rest
      }: Props<TValue, TExtraProps>,
      ref: React.Ref<React.ComponentType<{ ...TExtraProps, value: TValue }>>,
    ): React.Node => {
      if (loader.isLoading()) {
        return <LoadingComponent {...rest} />;
      }

      if (loader.isUpdating()) {
        return (
          <UpdatingComponent {...rest} value={loader.getValueEnforcing()} />
        );
      }

      if (loader.isDeleting()) {
        return <DeletingComponent {...rest} />;
      }

      if (loader.hasError()) {
        return <ErrorComponent {...rest} error={loader.getErrorEnforcing()} />;
      }

      if (loader.isEmpty()) {
        return <EmptyComponent {...rest} />;
      }

      return (
        <LoadedComponent
          {...rest}
          ref={ref}
          value={loader.getValueEnforcing()}
        />
      );
    },
  ),
);

LoaderComponent.defaultProps = {
  deletingComponent: () => null,
  emptyComponent: () => null,
  errorComponent: () => null,
  loadingComponent: LoadingIndicator,
  updatingComponent: () => null,
};

export default LoaderComponent;
