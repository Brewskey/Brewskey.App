// @flow

import type { DAO, QueryOptions } from 'brewskey.js-api';

import { action, computed, observable } from 'mobx';
import flattenArray from 'array-flatten';
import { LoadObject } from 'brewskey.js-api';
import { createRange } from '../utils';

export type Row<TEntity> = {|
  key: number,
  value: LoadObject<TEntity>,
|};

class DAOEntityListStore<TEntity> {
  _baseQueryOptions: QueryOptions = {};
  _dao: DAO<TEntity, *>;
  _pageSize: number;

  @observable _queryOptionsList: Array<QueryOptions> = [];
  @observable _remoteCount: LoadObject<number> = LoadObject.loading();

  @observable rows: Array<Row<TEntity>> = [];

  constructor(
    dao: DAO<TEntity, *>,
    queryOptions?: QueryOptions = {},
    pageSize?: number = 20,
  ) {
    this._baseQueryOptions = queryOptions;
    this._dao = dao;
    this._pageSize = pageSize;

    this._daoSubscriptionID = this._dao.subscribe(this._onDaoEvent);
    this._fetchFirstPage();
  }

  dispose = () => {
    this._dao.unsubscribe(this._onDaoEvent);
  };

  @computed
  get isInitialized(): boolean {
    return this._remoteCount.hasValue();
  }

  @computed
  get _maxRemoteItemIndex(): number {
    return this._remoteCount.getValueEnforcing() - 1;
  }

  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
    this.reset();
  };

  @action
  fetchNextPage = () => {
    if (!this.isInitialized) {
      return;
    }
    const currentQuery = this._queryOptionsList[
      this._queryOptionsList.length - 1
    ];
    const { skip = 0, take = this._pageSize } = currentQuery;

    // prevent fetch when we reached end of the list
    const queryLastItemIndex = take + skip - 1;
    if (queryLastItemIndex >= this._maxRemoteItemIndex) {
      return;
    }

    this._queryOptionsList.push({
      ...currentQuery,
      skip: skip + this._pageSize,
    });
    this._computeRows();
  };

  @action
  reset = () => {
    // todo when we use it with onRefresh in FlatList
    // it works normal but doesn't fit standard mobile refresh behavior.
    // instead of flushing all the cache we need somehow refetch only
    // the first query and shift all other cache if there are new entitites,
    // but it seems too complex.
    this._dao.flushCache();
    this._queryOptionsList = [];
    this._remoteCount = LoadObject.loading();

    this._fetchFirstPage();
  };

  @action
  _fetchFirstPage = () => {
    this._queryOptionsList.push({
      ...this._baseQueryOptions,
      skip: 0,
      take: this._pageSize,
    });

    this._computeRemoteCount();
    this._computeRows();
  };

  @action
  _computeRemoteCount = () => {
    this._remoteCount = this._dao.count();
  };

  @action
  _computeRows = () => {
    if (!this.isInitialized || this._remoteCount.getValueEnforcing() === 0) {
      return;
    }

    this.rows = flattenArray(
      this._queryOptionsList.map((queryOptions: QueryOptions) => {
        const { skip = 0, take = this._pageSize } = queryOptions;
        const queryLastItemIndex = take + skip - 1;
        const rowKeys = createRange(
          skip,
          Math.min(queryLastItemIndex, this._maxRemoteItemIndex),
        );

        const queryLoadObject = this._dao.fetchMany(queryOptions);

        return rowKeys
          .map((key: number): Row<TEntity> => ({
            key,
            value: LoadObject.loading(),
          }))
          .map(({ key }: Row<TEntity>, index: number): Row<TEntity> => ({
            key,
            value: queryLoadObject.hasValue()
              ? queryLoadObject.getValueEnforcing()[index]
              : queryLoadObject,
          }));
      }),
    );
  };

  _onDaoEvent = () => {
    this._computeRemoteCount();
    this._computeRows();
  };
}

export default DAOEntityListStore;
