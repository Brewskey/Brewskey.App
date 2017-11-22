// @flow

import type { DAO, EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { LoadObject } from 'brewskey.js-api';

type IdSelector<TProps> = (props: TProps) => EntityID;

const loadDAOEntity = <TEntity: { id: EntityID }, TEntityMutator, TProps: {}>(
  dao: DAO<TEntity, TEntityMutator>,
  idSelector: IdSelector<TProps> = ({ id }: Object): EntityID => id,
) => (
  Component: React.ComponentType<
    { entityLoader: LoadObject<TEntity> } & TProps,
  >,
): Class<React.Component<TProps>> => {
  @observer
  class LoadDAOEntity extends React.Component<TProps> {
    @observable _entityLoader: LoadObject<TEntity> = LoadObject.loading();

    componentWillMount() {
      dao.subscribe(this._computeEntityLoader);
      this._computeEntityLoader();
    }

    componentWillUnmount() {
      dao.unsubscribe(this._computeEntityLoader);
    }

    @action
    _computeEntityLoader = () => {
      this._entityLoader = dao.fetchByID(idSelector(this.props));
    };

    render() {
      return <Component {...this.props} entityLoader={this._entityLoader} />;
    }
  }

  hoistNonReactStatic(LoadDAOEntity, Component);
  return LoadDAOEntity;
};

export default loadDAOEntity;
