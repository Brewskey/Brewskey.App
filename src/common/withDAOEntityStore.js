// @flow

import type { DAO, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import DAOEntityStore from '../stores/DAOEntityStore';

const withDAOEntityStore = <
  TEntity: { id: EntityID },
  TProps: {},
  TStoreName: string,
>(
  storeName: TStoreName,
  dao: DAO<TEntity, *>,
) => (
  Component: React.ComponentType<
    { [TStoreName]: DAOEntityStore<TEntity, *> } & TProps,
  >,
): Class<React.Component<TProps>> => {
  @observer
  class WithDAOEntityStore extends React.Component<TProps> {
    _daoEntityStore: DAOEntityStore<TEntity, *> = new DAOEntityStore(dao);

    componentWillUnmount() {
      this._daoEntityStore.dispose();
    }

    render() {
      const injectedStore = { [storeName]: this._daoEntityStore };
      return <Component {...this.props} {...injectedStore} />;
    }
  }

  hoistNonReactStatic(WithDAOEntityStore, Component);
  return WithDAOEntityStore;
};

export default withDAOEntityStore;
