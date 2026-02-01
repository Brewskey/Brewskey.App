import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet, Text, View } from 'react-native';

import { LoadingIndicator } from 'common/LoadingIndicator';
import { COLORS } from 'theme';
import { useMultipleQueryResults } from 'utils/useMultipleQueryResults';

import type { UseQueryResult } from '@tanstack/react-query';

import type { UseMultipleQueryResultsData } from 'utils/useMultipleQueryResults';

interface Props<
  TQueries extends Record<string, UseQueryResult>,
  TComponentProps extends {
    value: UseMultipleQueryResultsData<TQueries>;
  },
> {
  componentProps?: Omit<TComponentProps, 'value'>;
  // deletingComponent?: React.ComponentType<TExtraProps>;
  emptyComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<
    Omit<TComponentProps, 'value'> & { error: Error }
  >;
  loadedComponent: React.ComponentType<TComponentProps>;
  queries: TQueries;
  loadingComponent?: React.ComponentType;
  // updatingComponent?: React.ComponentType<
  //   TExtraProps & {
  //     value: UseMultipleQueryResultsData<TQueries>;
  //   }
  // >;
}

const STYLES = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
  },
});

const Loading = () => <LoadingIndicator style={STYLES.container} />;
const Empty = () => (
  <View style={STYLES.container}>
    <Text>Not found</Text>
  </View>
);
const Error = () => (
  <View style={STYLES.container}>
    <Icon
      reverse
      color={COLORS.secondary2}
      name="priority_high"
      reverseColor={COLORS.accent}
      size={20}
    />
  </View>
);

export const LoaderComponent = <
  TQueries extends Record<string, UseQueryResult>,
  TComponentProps extends {
    value: UseMultipleQueryResultsData<TQueries>;
  },
>({
  // deletingComponent: DeletingComponent,
  emptyComponent: EmptyComponent = Empty,
  errorComponent: ErrorComponent = Error,
  loadedComponent: LoadedComponent,
  queries,
  loadingComponent: LoadingComponent = Loading,
  // updatingComponent: UpdatingComponent,
  componentProps = {} as Omit<TComponentProps, 'value'>,
}: Props<TQueries, TComponentProps>): React.ReactElement => {
  const results = useMultipleQueryResults(queries);
  if (results.isLoading) {
    return <LoadingComponent {...componentProps} />;
  }

  // if (loader.isUpdating() && UpdatingComponent) {
  //   return <UpdatingComponent {...rest} value={loader.getValue()} />;
  // }

  // if (loader.isDeleting()) {
  //   const Component = DeletingComponent || LoadingComponent;
  //   return <Component {...rest} />;
  // }

  if (results.isError) {
    return <ErrorComponent error={results.error} {...componentProps} />;
  }

  if (results.status === 'success') {
    return (
      <LoadedComponent {...(componentProps as any)} value={results.data} />
    );
  }

  return <EmptyComponent {...componentProps} />;
};
