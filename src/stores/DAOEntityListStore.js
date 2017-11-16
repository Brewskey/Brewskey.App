// @flow

import type { DAO, QueryOptions } from 'brewskey.js-api';

import { action, observable } from 'mobx';
import flattenArray from 'array-flatten';
import DAOApi, { LoadObject } from 'brewskey.js-api';
import { createRange } from '../utils';

export type Row<TEntity> = {|
  key: number,
  value: LoadObject<TEntity>,
|};

class DAOEntityListStore<TEntity> {
  _baseQueryOptions: QueryOptions = {};
  _dao: DAO<TEntity, *>;
  _daoSubscriptionID: string;
  _pageSize: number;

  @observable _queryOptionsList: Array<QueryOptions> = [];

  @observable rows: Array<Row<TEntity>> = [];

  constructor(
    dao: DAO<TEntity, *>,
    queryOptions?: QueryOptions = {},
    pageSize?: number = 20,
  ) {
    this._baseQueryOptions = queryOptions;
    this._dao = dao;
    this._pageSize = pageSize;

    this._daoSubscriptionID = this._dao.subscribe(this._computeRows);
    this.reset();
  }

  dispose = () => {
    this._dao.unsubscribe(this._daoSubscriptionID);
  };

  @action
  fetchNextPage = () => {
    const currentQuery = this._queryOptionsList[
      this._queryOptionsList.length - 1
    ];

    // prevent fetch when we reached end of the list
    const currentQueryLoadObject = this._dao.fetchMany(currentQuery);
    if (
      currentQueryLoadObject.hasValue() &&
      currentQueryLoadObject.getValueEnforcing().length < this._pageSize
    ) {
      return;
    }

    this._queryOptionsList.push({
      ...currentQuery,
      skip: currentQuery.skip + this._pageSize,
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
    this._queryOptionsList.push({
      ...this._baseQueryOptions,
      skip: 0,
      take: this._pageSize,
    });
    this._computeRows();
  };

  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
    this.reset();
  };

  @action
  _computeRows = () => {
    this.rows = flattenArray(
      this._queryOptionsList.map((queryOptions: QueryOptions) => {
        const rowKeys = createRange(
          queryOptions.skip || 0,
          queryOptions.take + queryOptions.skip - 1,
        );

        const queryLoadObject = DAOApi.LocationDAO.fetchMany(queryOptions);

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
          }))
          .filter((row: Row<TEntity>): boolean => !!row.value);
      }),
    );
  };
}

export default DAOEntityListStore;
