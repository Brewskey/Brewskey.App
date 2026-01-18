import type { RowItemProps } from './SwipeableRow';

import * as React from 'react';
import ErrorListItem from './ErrorListItem';
import LoadingListItem from './LoadingListItem';
import { LoaderComponent } from './LoaderComponent';
import { UseQueryResult } from '@tanstack/react-query';

export type LoaderErrorRowProps<TExtraProps> = TExtraProps & {
  error: Error;
};

type LoadedRowComponentProps<TEntity, TExtraProps> = TExtraProps & {
  loadedRow: React.ComponentType<RowItemProps<TEntity>>;
  value: { entity: TEntity };
  index: number;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: unknown) => void;
  };
};

const LoadedRowComponent = <TEntity, TExtraProps>({
  value,
  loadedRow: LoadedRow,
  index,
  separators,
  ...rest
}: LoadedRowComponentProps<TEntity, TExtraProps>) => (
  <LoadedRow item={value.entity} index={index} separators={separators} {...rest} />
);

type Props<TEntity, TExtraProps> = TExtraProps &
  RowItemProps<TEntity> & {
    errorRow?: React.ComponentType<LoaderErrorRowProps<TExtraProps>>;
    index: number;
    loadedRow: React.ComponentType<RowItemProps<TEntity>>;
    query: UseQueryResult<TEntity, Error>;
    loadingRow?: React.ComponentType<
      React.ComponentProps<typeof LoadingListItem>
    >;
    separators: {
      highlight: () => void;
      unhighlight: () => void;
      updateProps: (select: 'leading' | 'trailing', newProps: unknown) => void;
    };
  };

export const LoaderRow = <TEntity, TExtraProps>({
  errorRow,
  index,
  loadingRow = LoadingListItem,
  query,
  loadedRow,
  separators,
  ...extraProps
}: Props<TEntity, TExtraProps>): React.ReactElement => {
  const ErrorRowComponent = errorRow || ErrorListItem;
  const queries = React.useMemo(
    () => ({ entity: query }),
    [query],
  ) as Record<string, UseQueryResult<TEntity, Error>>;

  return (
    <LoaderComponent
      componentProps={{
        ...extraProps,
        index,
        separators,
        loadedRow,
      }}
       
      errorComponent={ErrorRowComponent as React.ComponentType<any>}
       
      loadedComponent={LoadedRowComponent as React.ComponentType<any>}
       
      loadingComponent={loadingRow as React.ComponentType<any>}
      queries={queries}
    />
  );
};
