// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { RowItemProps } from './SwipeableRow';

import * as React from 'react';
import { observer } from 'mobx-react';
import ErrorListItem from './ErrorListItem';
import LoadingListItem from './LoadingListItem';
import LoaderComponent from './LoaderComponent';

// todo fix Flow in the file, it should be something else intestead *
// for TExtraProps

export type LoaderErrorRowProps<TExtraProps> = {|
  ...TExtraProps,
  error: Error,
|};

type Props<TEntity, TExtraProps> = {|
  ...TExtraProps,
  ...RowItemProps<TEntity, TExtraProps>,
  errorRow: React.ComponentType<LoaderErrorRowProps<TExtraProps>>,
  index: number,
  loadedRow: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
  loader: LoadObject<TEntity>,
  loadingRow: React.ComponentType<TExtraProps>,
  separators: Object,
|};

const LoaderRow = <TEntity, TExtraProps>({
  errorRow = ErrorListItem,
  index,
  loader,
  loadingRow = LoadingListItem,
  separators,
  ...extraProps
}: Props<TEntity, TExtraProps>): React.Node => (
  <LoaderComponent
    {...extraProps}
    errorComponent={errorRow}
    index={index}
    loadedComponent={LoadedRowComponent}
    loader={loader}
    loadingComponent={loadingRow}
    separators={separators}
  />
);

type LoadedRowComponentProps<TEntity, TExtraProps> = {|
  ...TExtraProps,
  loadedRow: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
  value: TEntity,
  index: number,
  separators: Object,
|};

const LoadedRowComponent = <TEntity, TExtraProps>({
  value,
  loadedRow: LoadedRow,
  ...rest
}: LoadedRowComponentProps<TEntity, TExtraProps>) => (
  <LoadedRow item={value} {...rest} />
);

export default (observer(LoaderRow): typeof LoaderRow);
