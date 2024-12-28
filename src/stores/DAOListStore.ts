import type { EntityID, QueryOptions } from '@brewskey/js-api';
import { createRange } from '../utils';
import nullthrows from 'nullthrows';

export type Row<TEntity> = {
  key: string;
  loader: Promise<TEntity>;
};

type BaseType<TEntity> = TEntity & {
  id: EntityID;
};

class DAOListStore<TEntity> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _daoStore: any;

  _pageSize!: number;

  _baseQueryOptions: QueryOptions = {};

  _queryOptionsList: Array<QueryOptions> = [];

  _isInitialized!: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(daoStore: any, pageSize: number = 20) {
    this._daoStore = daoStore;
    this._pageSize = pageSize;
  }

  initialize = (queryOptions: QueryOptions = {}) => {
    this.setQueryOptions(queryOptions);
    this._fetchFirstPage();
    this._isInitialized = true;
  };

  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
  };

  get isFetchingRemoteCount(): boolean {
    return true;
    //   return this._remoteCountLoader.hasOperation();
  }

  get rows(): Array<Row<BaseType<TEntity>>> {
    if (this.isFetchingRemoteCount || this._remoteCount === 0) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._queryOptionsList.map((queryOptions: QueryOptions): any => {
      const { skip = 0, take = this._pageSize } = queryOptions;
      const queryLastItemIndex = take + skip - 1;
      const rowKeys = createRange(
        skip,
        Math.min(queryLastItemIndex, this._maxRemoteItemIndex) + 1,
      );

      const queryLoadObject = this._daoStore.getMany(queryOptions);

      return rowKeys;
      // .map(
      //   (key: number): Row<BaseType<TEntity>> => ({
      //     key: key.toString(),
      //     loader: LoadObject.loading(),
      //   }),
      // )
      // .map(
      //   (
      //     { key }: Row<BaseType<TEntity>>,
      //     index: number,
      //   ): Row<BaseType<TEntity>> => {
      //     let loader: LoadObject<BaseType<TEntity>> = LoadObject.loading();

      //     if (queryLoadObject.hasValue()) {
      //       const entities = queryLoadObject.getValueEnforcing();
      //       if (entities.length) {
      //         loader = nullthrows(entities[index]);

      //         if (!(loader instanceof LoadObject)) {
      //           loader = LoadObject.withValue(loader);
      //         }
      //       }
      //     } else if (queryLoadObject.hasError()) {
      //       loader = LoadObject.withError(
      //         queryLoadObject.getErrorEnforcing(),
      //       );
      //     }

      //     return {
      //       key,
      //       loader,
      //     };
      //   },
      // );
    });
  }

  get _remoteCountLoader(): Promise<number> {
    if (!this._isInitialized) {
      return Promise.resolve(0);
    }
    // ODAta inlineCount doesn't pay attention on 'skip'
    // but instead throws error if its used with 'top' query;
    const { skip, ...rest } = this._baseQueryOptions;
    return this._daoStore.count(rest);
  }

  get _remoteCount(): number {
    const { skip = 0 } = this._baseQueryOptions;
    const value = 0; // this._remoteCountLoader - skip;
    return value > 0 ? value : 0;
  }

  get _maxRemoteItemIndex(): number {
    return this._remoteCount - 1;
  }

  fetchNextPage: () => void = () => {
    if (this.isFetchingRemoteCount) {
      return;
    }
    const currentQuery =
      this._queryOptionsList[this._queryOptionsList.length - 1];
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

  reload: () => Promise<void> = async () => {
    this._daoStore.flushQueryCaches();
    this.reset();
  };

  reset: () => void = () => {
    this._queryOptionsList = [];
    this._fetchFirstPage();
  };

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
