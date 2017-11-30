// @flow

import type { IComponentStore } from '../stores/types';
import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const withComponentStores = <
  TProps: {},
  TStoresByName: { [string]: IComponentStore },
>(
  storesByName: TStoresByName,
) => (
  Component: React.ComponentType<TStoresByName & TProps>,
): Class<React.Component<TProps>> => {
  class WithComponentStores extends React.Component<TProps> {
    componentWillMount() {
      Object.values(storesByName).forEach((store: mixed) => {
        const castedStore = ((store: any): IComponentStore);
        castedStore.initialize();
      });
    }

    componentWillUnmount() {
      Object.values(storesByName).forEach((store: mixed) => {
        const castedStore = ((store: any): IComponentStore);
        castedStore.dispose();
      });
    }

    render() {
      return <Component {...this.props} {...storesByName} />;
    }
  }

  hoistNonReactStatic(WithComponentStores, Component);
  return WithComponentStores;
};

export default withComponentStores;
