// @flow

import type { EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { LoadObject } from 'brewskey.js-api';

type IdSelector = (props: TProps) => EntityID;

const fetchDAOEntityByID = <TEntity, TEntityMutator, TProps>(
  dao: DAO<TEntity, TEntityMutator>,
  idSelector: IdSelector = (props: TProps) => props.id,
) => (
  Component: React.ComponentType<TProps>,
): React.ComponentType<{ entityLoader: LoadObject<TEntity> } & TProps> => {
  @observer
  class FetchDAOEntityByID extends React.Component<TProps> {
    _subscriptionID: string;
    @observable _entityLoader: LoadObject<TEntity> = LoadObject.loading();

    componentWillMount() {
      this._subscriptionID = dao.subscribe(this._computeEntityLoader);
      this._computeEntityLoader();
    }

    componentWillUnmount() {
      dao.unsubscribe(this._subscriptionID);
    }

    @action
    _computeEntityLoader = () => {
      this._entityLoader = dao.fetchByID(idSelector(this.props));
    };

    render() {
      return <Component {...this.props} entityLoader={this._entityLoader} />;
    }
  }

  hoistNonReactStatic(FetchDAOEntityByID, Component);
  return FetchDAOEntityByID;
};

export default fetchDAOEntityByID;
