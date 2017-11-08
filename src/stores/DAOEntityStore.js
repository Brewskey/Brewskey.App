// @flow

import type { DAO, QueryOptions } from 'brewskey.js-api';
import type { ObservableMap } from 'mobx';
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
class DAOEntityStore<TEntity: { id: string }, TEntityMutator: {}> {
  _dao: DAO<TEntity, TEntityMutator>;
  _rootStore: RootStore;

  @observable entityItemsByID: ObservableMap<TEntity> = new Map();

  constructor(rootStore: RootStore, dao: DAO<TEntity, TEntityMutator>) {
    this._dao = dao;
    this._rootStore = rootStore;
  }

  @action
  async deleteByID(id: string): Promise<void> {
    await this._doDAORequest('deleteByID', id);
    runInAction(() => {
      this.entityItemsByID.delete(id);
    });
  }

  @action
  async fetchByID(id: string, queryOptions?: QueryOptions): Promise<?TEntity> {
    const entity = await this._doDAORequest('fetchByID', id, queryOptions);
    // todo add babel plugin to autobind async stuff to runInAction
    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  }

  @action
  async fetchByIDs(
    ids: Array<string>,
    queryOptions?: QueryOptions,
  ): Promise<Array<TEntity>> {
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
  }

  @action
  async fetchMany(queryOptions?: QueryOptions): Promise<Array<TEntity>> {
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
  }

  @action
  async patch(id: string, mutator: TEntityMutator): Promise<TEntity> {
    const entity = await this._doDAORequest('patch', id, mutator);
    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  }

  @action
  async post(mutator: TEntityMutator): Promise<TEntity> {
    const entity = await this._doDAORequest('post', mutator);

    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  }

  @action
  async put(id: string, mutator: TEntityMutator): Promise<TEntity> {
    const entity = await this._doDAORequest('put', id, mutator);

    runInAction(() => {
      this.entityItemsByID.set(entity.id, entity);
    });

    return entity;
  }

  @computed
  get all(): Array<TEntity> {
    return this.entityItemsByID.values();
  }

  getByID = createTransformer((id: string): ?TEntity =>
    this.entityItemsByID.get(id),
  );

  getByQueryOptions = createTransformer((queryOptions: QueryOptions): Array<
    TEntity,
  > => {
    const { filters, orderBy } = queryOptions;
    let entities = this.all;

    if (filters) {
      entities = entities.filter((entityItem: TEntity): boolean =>
        DAOApi.doesSatisfyToQueryFilters(entityItem, filters),
      );
    }

    if (orderBy) {
      // todo this is absolutely hardcoded for now
      // it makes assumption that we use exactly id prop for ordering
      // and id is exactly `kind of number` so we can parse it.
      const { column, direction } = orderBy[0];

      entities.sort(
        (item: TEntity, nextItem: TEntity): number =>
          parseInt(item[column], 10) - parseInt(nextItem[column], 10),
      );

      if (direction === 'desc') {
        entities.reverse();
      }
    }

    return entities;
  });

  _doDAORequest = async (
    methodName: string,
    ...args: Array<any>
  ): Promise<*> => {
    const result = await ((this._dao: any)[methodName]: Function)(...args);
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
