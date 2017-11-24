// @flow

import type { DAO, EntityID } from 'brewskey.js-api';

import { computed, observable, runInAction } from 'mobx';
import { LoadObject } from 'brewskey.js-api';

class DAOEntityStore<TEntity: { id: EntityID }> {
  _dao: DAO<TEntity, *>;

  @observable _entityLoaders: Array<LoadObject<TEntity>> = [];
  @observable _isFetching: boolean = false;

  constructor(dao: DAO<TEntity, *>) {
    this._dao = dao;

    this._dao.subscribe(this._reload);
    this._reload();
  }

  dispose = (): void => this._dao.unsubscribe(this._reload);

  @computed
  get allItemsLoader(): LoadObject<Array<TEntity>> {
    if (this._entityLoaders.some(loader => loader.isLoading())) {
      return LoadObject.loading();
    }

    return LoadObject.withValue(
      this._entityLoaders.map(loader => loader.getValueEnforcing()),
    );
  }

  @computed
  get allItems(): Array<TEntity> {
    return this._entityLoaders
      .map((entityLoader: LoadObject<TEntity>): ?TEntity =>
        entityLoader.getValue(),
      )
      .filter(Boolean);
  }

  _reload = () => {
    const entityLoaders = this._dao.fetchMany();
    if (entityLoaders.isLoading()) {
      return;
    }
    runInAction(() => {
      this._entityLoaders = entityLoaders.getValue() || [];
    });
  };
}

export default DAOEntityStore;
