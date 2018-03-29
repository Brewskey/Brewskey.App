// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { RowItemProps } from './SwipeableRow';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import ErrorListItem from './ErrorListItem';
import LoadingListItem from './LoadingListItem';
import LoaderComponent from './LoaderComponent';

// todo fix Flow in the file, it should be something else intestead *
// for TExtraProps
type Props<TEntity, TExtraProps = {}> = {
  ...TExtraProps,
  errorRow: React.ComponentType<{ ...TExtraProps, error: Error }>,
  index: number,
  loadedRow: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
  loader: LoadObject<TEntity>,
  loadingRow: React.ComponentType<TExtraProps>,
  separators: Object,
} & RowItemProps<TEntity, TExtraProps>;

const LoaderRow = observer(
  <TEntity>({
    errorRow = ErrorListItem,
    index,
    loader,
    loadingRow = LoadingListItem,
    separators,
    ...extraProps
  }): Props<TEntity, *> => (
    <LoaderComponent
      {...extraProps}
      errorComponent={errorRow}
      index={index}
      loadedComponent={LoadedRowComponent}
      loader={loader}
      loadingComponent={loadingRow}
      separators={separators}
    />
  ),
);

type LoadedRowComponentProps<TEntity, TExtraProps = {}> = {
  ...TExtraProps,
  loadedRow: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
  value: TEntity,
  index: number,
  separators: Object,
};

const LoadedRowComponent = <TEntity>({
  value,
  loadedRow: LoadedRow,
  ...rest
}: LoadedRowComponentProps<TEntity, *>) => <LoadedRow item={value} {...rest} />;

export default LoaderRow;
