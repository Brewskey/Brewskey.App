// @flow

import type RootStore from './RootStore';

import {
  action,
  computed,
  createTransformer,
  observable,
  runInAction,
} from 'mobx';

class DAOEntityStore<TEntity, TEntityMutator> {
  _dao: DAO<TEntity, TEntityMutator>;
  _rootStore: RootStore;

  @observable entityItemsByID: Array<TEntity> = new Map();

  constructor(rootStore: RootStore, dao: DAO<TEntity, TEntityMutator>) {
    this._dao = dao;
    this._rootStore = rootStore;
  }

  //todo map another actions
  @action
  fetchByID = async (
    id: string,
    queryOptions?: QueryOptions,
  ): Promise<?TEntity> => {
    const location = await this._doDAORequest('fetchByID', id, queryOptions);
    // todo add babel plugin to autobind async stuff to runInAction
    runInAction(() => {
      this.entityItemsByID.set(location.id, location);
    });

    return location;
  };

  @computed
  get all(): Array<TEntity> {
    return this.entityItemsByID.values();
  }

  getByID = createTransformer((id: string): ?TEntity =>
    this.entityItemsByID.get(id),
  );

  getByQueryFilters = createTransformer((queryFitlers: QueryFilters): Array<
    TEntity,
  > =>
    this.entityItemsByID
      .values()
      .filter((entityItem: TEntity): boolean =>
        DAOApi.doesSatisfyToQueryFilters(item, queryFilters),
      ),
  );

  _doDAORequest = async (methodName, ...args): Promise<*> => {
    const result = await this._dao[methodName](...args);
    const error = result.getError();
    if (error) {
      if (error.status === 401) {
        this._rootStore.authStore.clearAuthState();
      }
      throw error;
    }

    return result.getData();
  };
}

export default DAOEntityStore;
