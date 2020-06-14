// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';
import type DAOStore from '../stores/DAOStores';

import { action, computed, observable } from 'mobx';
import { flatten } from 'array-flatten';
import { LoadObject } from 'brewskey.js-api';
import { createRange } from '../utils';
import nullthrows from 'nullthrows';

export type Row<TEntity> = {|
  key: string,
  loader: LoadObject<TEntity>,
|};

type BaseType<TEntity> = {| ...TEntity, id: EntityID |};

class DAOListStore<TEntity> {
  _daoStore: DAOStore<BaseType<TEntity>>;
  _pageSize: number;

  @observable
  _baseQueryOptions: QueryOptions = {};
  @observable
  _queryOptionsList: Array<QueryOptions> = [];
  @observable
  _isInitialized;

  constructor(daoStore: DAOStore<BaseType<TEntity>>, pageSize?: number = 20) {
    this._daoStore = daoStore;
    this._pageSize = pageSize;
  }

  @action
  initialize = (queryOptions?: QueryOptions = {}) => {
    this.setQueryOptions(queryOptions);
    this._fetchFirstPage();
    this._isInitialized = true;
  };

  @action
  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
  };

  @computed
  get isFetchingRemoteCount(): boolean {
    return this._remoteCountLoader.hasOperation();
  }

  @computed
  get rows(): Array<Row<BaseType<TEntity>>> {
    if (this.isFetchingRemoteCount || this._remoteCount === 0) {
      return [];
    }

    return flatten(
      this._queryOptionsList.map((queryOptions: QueryOptions) => {
        const { skip = 0, take = this._pageSize } = queryOptions;
        const queryLastItemIndex = take + skip - 1;
        const rowKeys = createRange(
          skip,
          Math.min(queryLastItemIndex, this._maxRemoteItemIndex) + 1,
        );

        const queryLoadObject = this._daoStore.getMany(queryOptions);

        return rowKeys
          .map((key: number): Row<BaseType<TEntity>> => ({
            key: key.toString(),
            loader: LoadObject.loading(),
          }))
          .map(({ key }: Row<BaseType<TEntity>>, index: number): Row<
            BaseType<TEntity>,
          > => {
            let loader: LoadObject<BaseType<TEntity>> = LoadObject.loading();

            if (queryLoadObject.hasValue()) {
              const entities = queryLoadObject.getValueEnforcing();
              if (entities.length) {
                loader = nullthrows(entities[index]);

                if (!(loader instanceof LoadObject)) {
                  loader = LoadObject.withValue(loader);
                }
              }
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
    if (!this._isInitialized) {
      return LoadObject.loading();
    }
    // ODAta inlineCount doesn't pay attention on 'skip'
    // but instead throws error if its used with 'top' query;
    const { skip, ...rest } = this._baseQueryOptions;
    return this._daoStore.count((rest: any));
  }

  @computed
  get _remoteCount(): number {
    const { skip = 0 } = this._baseQueryOptions;
    const value = this._remoteCountLoader.getValueEnforcing() - skip;
    return value > 0 ? value : 0;
  }

  @computed
  get _maxRemoteItemIndex(): number {
    return this._remoteCount - 1;
  }

  @action
  fetchNextPage: () => void = () => {
    if (this.isFetchingRemoteCount) {
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
  reload: () => Promise<void> = async () => {
    this._daoStore.flushQueryCaches();
    this.reset();
  };

  @action
  reset: () => void = () => {
    this._queryOptionsList = [];
    this._fetchFirstPage();
  };

  @action
  _fetchFirstPage: () => void = () => {
    const { skip = 0, ...rest } = this._baseQueryOptions;
    this._queryOptionsList.push({
      ...rest,
      skip,
      take: this._pageSize,
    });
  };
}

export default DAOListStore;
