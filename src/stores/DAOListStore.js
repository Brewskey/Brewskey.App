// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';
import type DAOStore from '../stores/DAOStores';

import { action, computed, observable } from 'mobx';
import flattenArray from 'array-flatten';
import { LoadObject } from 'brewskey.js-api';
import { createRange } from '../utils';

export type Row<TEntity> = {|
  key: number,
  loader: LoadObject<TEntity>,
|};

class DAOListStore<TEntity: { id: EntityID }> {
  _baseQueryOptions: QueryOptions = {};
  _daoStore: DAOStore<TEntity>;
  _pageSize: number;

  @observable _queryOptionsList: Array<QueryOptions> = [];

  constructor(daoStore: DAOStore<TEntity>, pageSize?: number = 20) {
    this._daoStore = daoStore;
    this._pageSize = pageSize;
  }

  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
  };

  @computed
  get isFetchingRemoteCount(): boolean {
    return this._remoteCountLoader.hasValue();
  }

  @computed
  get rows(): Array<Row<TEntity>> {
    if (
      !this.isFetchingRemoteCount ||
      this._remoteCountLoader.getValueEnforcing() === 0
    ) {
      return [];
    }

    return flattenArray(
      this._queryOptionsList.map((queryOptions: QueryOptions) => {
        const { skip = 0, take = this._pageSize } = queryOptions;
        const queryLastItemIndex = take + skip - 1;
        const rowKeys = createRange(
          skip,
          Math.min(queryLastItemIndex, this._maxRemoteItemIndex),
        );

        const queryLoadObject = this._daoStore.getMany(queryOptions);

        return rowKeys
          .map((key: number): Row<TEntity> => ({
            key,
            loader: LoadObject.loading(),
          }))
          .map(({ key }: Row<TEntity>, index: number): Row<TEntity> => {
            let loader = LoadObject.loading();

            if (queryLoadObject.hasValue()) {
              loader = queryLoadObject.map(
                (entries: Array<LoadObject<TEntity>>): LoadObject<TEntity> =>
                  entries[index],
              );
            } else if (queryLoadObject.hasError()) {
              loader = LoadObject.withError(
                queryLoadObject.getErrorEnforcing(),
              );
            }

            return {
              key,
              loader,
            };
          });
      }),
    );
  }

  @computed
  get _remoteCountLoader(): LoadObject<number> {
    return this._daoStore.count(this._baseQueryOptions);
  }

  @computed
  get _maxRemoteItemIndex(): number {
    return this._remoteCountLoader.getValueEnforcing() - 1;
  }

  @action
  fetchNextPage = () => {
    if (!this.isFetchingRemoteCount) {
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
  };

  @action
  reload = () => {
    this._reset();
    this.fetchFirstPage();
  };

  @action
  fetchFirstPage = () => {
    this._queryOptionsList.push({
      ...this._baseQueryOptions,
      skip: 0,
      take: this._pageSize,
    });
  };

  @action
  _reset = () => {
    this._daoStore.flushQueryCaches();
    this._queryOptionsList = [];
  };
}

export default DAOListStore;
