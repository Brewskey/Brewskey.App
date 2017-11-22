// @flow

import type { DAO, EntityID, LoadObject, QueryOptions } from 'brewskey.js-api';

import { action, computed, observable, runInAction } from 'mobx';

class DAOEntityStore<TEntity: { id: EntityID }> {
  _dao: DAO<TEntity, *>;

  @observable _entityLoaders: Array<LoadObject<TEntity>> = [];
  @observable _isFetching: boolean = false;

  constructor(dao: DAO<TEntity, *>) {
    this._dao = dao;
  }

  @computed
  get allLoaders(): Array<LoadObject<TEntity>> {
    return this._entityLoaders;
  }

  @computed
  get allItems(): Array<TEntity> {
    return this._entityLoaders
      .map((entityLoader: LoadObject<TEntity>): ?TEntity =>
        entityLoader.getValue(),
      )
      .filter(Boolean);
  }

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
}

export default DAOEntityStore;
