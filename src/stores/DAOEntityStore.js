// @flow

import type { DAO, QueryFilter, QueryOptions } from 'brewskey.js-api';
import type RootStore from './RootStore';

import {
  action,
  computed,
  createTransformer,
  observable,
  runInAction,
} from 'mobx';
import DAOApi from 'brewskey.js-api';

// todo implement optimistic updates for put/delete
// todo think how to remove some code duplication in actions
class DAOEntityStore<TEntity: { id: string }, TEntityMutator> {
  _dao: DAO<TEntity, TEntityMutator>;
  _rootStore: RootStore;

  @observable entityItemsByID: Map<string, TEntity> = new Map();

  constructor(rootStore: RootStore, dao: DAO<TEntity, TEntityMutator>) {
    this._dao = dao;
    this._rootStore = rootStore;
  }

  @action
  deleteByID = async (id: string): Promise<void> => {
    await this._doDAORequest('deleteByID', id);
    runInAction(() => {
      this.entityItemsByID.delete(id);
    });
  };

  @action
  fetchByID = async (
    id: string,
    queryOptions?: QueryOptions,
  ): Promise<?TEntity> => {
    const entity = await this._doDAORequest('fetchByID', id, queryOptions);
    // todo add babel plugin to autobind async stuff to runInAction
    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  };

  @action
  fetchByIDs = async (
    ids: Array<string>,
    queryOptions?: QueryOptions,
  ): Promise<Array<TEntity>> => {
    const entities = await this._doDAORequest('fetchByIDs', ids, queryOptions);

    runInAction(() => {
      this.entityItemsByID.merge([
        ...entities.map((entity: TEntity): [string, TEntity] => [
          entity.id,
          entity,
        ]),
      ]);
    });

    return entities;
  };

  @action
  fetchMany = async (queryOptions?: QueryOptions): Promise<Array<TEntity>> => {
    const entities = await this._doDAORequest('fetchMany', queryOptions);

    runInAction(() => {
      this.entityItemsByID.merge([
        ...entities.map((entity: TEntity): [string, TEntity] => [
          entity.id,
          entity,
        ]),
      ]);
    });

    return entities;
  };

  @action
  patch = async (id: string, mutator: TEntityMutator): Promise<TEntity> => {
    const entity = await this._doDAORequest('patch', id, mutator);
    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  };

  @action
  post = async (mutator: TEntityMutator): Promise<TEntity> => {
    const entity = await this._doDAORequest('post', mutator);

    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  };

  @action
  put = async (id: string, mutator: TEntityMutator): Promise<TEntity> => {
    const entity = await this._doDAORequest('put', id, mutator);

    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  };

  @computed
  get all(): Array<TEntity> {
    return this.entityItemsByID.values();
  }

  getByID = createTransformer((id: string): ?TEntity =>
    this.entityItemsByID.get(id),
  );

  getByQueryFilters = createTransformer(
    (queryFilters: Array<QueryFilter>): Array<TEntity> =>
      this.entityItemsByID
        .values()
        .filter((entityItem: TEntity): boolean =>
          DAOApi.doesSatisfyToQueryFilters(entityItem, queryFilters),
        ),
  );

  _doDAORequest = async (
    methodName: string,
    ...args: Array<any>
  ): Promise<*> => {
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
