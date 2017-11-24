// @flow

import type { DAO, EntityID, QueryOptions } from 'brewskey.js-api';

import { action, computed, observable, runInAction } from 'mobx';
import { LoadObject } from 'brewskey.js-api';

class DAOEntityStore<TEntity: { id: EntityID }> {
  _dao: DAO<TEntity, *>;

  @observable _entityLoaders: Array<LoadObject<TEntity>> = [];
  @observable _isFetching: boolean = false;

  constructor(dao: DAO<TEntity, *>) {
    this._dao = dao;

    this._dao.subscribe(() => this._reload());
    this._reload();
  }

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

  // TODO - this is a bad pattern and should be removed. We don't want to use
  // this to fetch items. We need to simply use load objects in components.
  @action
  fetchMany = async (queryOptions?: QueryOptions): Promise<void> => {
    this._isFetching = true;
    const entityLoaders = await this._dao.waitForLoaded(() =>
      this._dao.fetchMany(queryOptions),
    );
    runInAction(() => {
      this._entityLoaders = entityLoaders;
      this._isFetching = false;
    });
  };

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
