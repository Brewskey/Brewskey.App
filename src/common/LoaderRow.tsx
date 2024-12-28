import type { RowItemProps } from './SwipeableRow';

import * as React from 'react';
import ErrorListItem from './ErrorListItem';
import LoadingListItem from './LoadingListItem';
import { LoaderComponent } from './LoaderComponent';
import { UseQueryResult } from '@tanstack/react-query';

// todo fix Flow in the file, it should be something else intestead *
// for TExtraProps

export type LoaderErrorRowProps<TExtraProps> = TExtraProps & {
  error: Error;
};

type Props<TEntity, TExtraProps> = TExtraProps &
  RowItemProps<TEntity> & {
    errorRow: React.ComponentType<LoaderErrorRowProps<TExtraProps>>;
    index: number;
    loadedRow: React.ComponentType<RowItemProps<TEntity>>;
    query: UseQueryResult<TEntity, Error>;
    loadingRow: React.ComponentType<
      React.ComponentProps<typeof LoadingListItem>
    >;
    separators: React.ElementType;
  };

export const LoaderRow = <TEntity, TExtraProps>({
  errorRow = ErrorListItem,
  index,
  loader,
  loadingRow = LoadingListItem,
  separators,
  ...extraProps
}: Props<TEntity, TExtraProps>): React.ReactElement => (
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

type LoadedRowComponentProps<TEntity, TExtraProps> = TExtraProps & {
  loadedRow: React.ComponentType<RowItemProps<TEntity>>;
  value: TEntity;
  index: number;
  separators: React.ElementType;
};

const LoadedRowComponent = <TEntity, TExtraProps>({
  value,
  loadedRow: LoadedRow,
  ...rest
}: LoadedRowComponentProps<TEntity, TExtraProps>) => (
  <LoadedRow item={value} {...rest} />
);
