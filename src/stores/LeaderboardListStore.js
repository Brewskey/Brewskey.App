// @flow

import type {
  EntityID,
  LeaderboardItem,
  LoadObject,
  QueryOptions,
} from 'brewskey.js-api';

import flattenArray from 'array-flatten';
import { action, computed, observable } from 'mobx';
import { TapStore } from './DAOStores';

class LeaderboardListStore {
  _duration: string;
  _tapID: EntityID;
  _pageSize: number;

  @observable _queryOptionsList: Array<QueryOptions> = [];

  constructor(pageSize?: number = 20) {
    this._pageSize = pageSize;
  }

  @computed
  get isLoading(): boolean {
    return (
      this._remoteCountLoader.isLoading() ||
      this._pageLoadObjects.some(
        (pageLoadObject: LoadObject<Array<LeaderboardItem>>): boolean =>
          pageLoadObject.isLoading(),
      )
    );
  }

  @computed
  get rows(): Array<LeaderboardItem> {
    if (
      !this._remoteCountLoader.hasValue() ||
      this._remoteCountLoader.getValueEnforcing() === 0
    ) {
      return [];
    }

    return flattenArray(
      this._pageLoadObjects.map(
        (
          pageLoadObject: LoadObject<Array<LeaderboardItem>>,
        ): Array<LeaderboardItem> =>
          pageLoadObject.hasValue() ? pageLoadObject.getValueEnforcing() : [],
      ),
    );
  }

  @computed
  get _pageLoadObjects(): Array<LoadObject<Array<LeaderboardItem>>> {
    return this._queryOptionsList.map((queryOptions: QueryOptions): LoadObject<
      Array<LeaderboardItem>,
    > => TapStore.getLeaderboard(this._tapID, this._duration, queryOptions));
  }

  @computed
  get _remoteCountLoader(): LoadObject<number> {
    return TapStore.countLeaderboard(this._tapID, this._duration);
  }

  @action
  fetchNextPage = () => {
    if (this.isLoading) {
      return;
    }

    const currentQuery = this._queryOptionsList[
      this._queryOptionsList.length - 1
    ];
    const { skip = 0, take = this._pageSize } = currentQuery;

    // prevent fetch when we reached end of the list
    const queryLastItemIndex = take + skip - 1;
    const maxRemoteCountItem = this._remoteCountLoader.getValueEnforcing() - 1;
    if (queryLastItemIndex >= maxRemoteCountItem) {
      return;
    }

    this._queryOptionsList.push({
      ...currentQuery,
      skip: skip + this._pageSize,
    });
  };

  setDuration = (duration: string) => {
    this._duration = duration;
  };

  setTapID = (tapID: EntityID) => {
    this._tapID = tapID;
  };

  @action
  reload = () => {
    this._reset();
    this.fetchFirstPage();
  };

  @action
  fetchFirstPage = () => {
    this._queryOptionsList.push({
      skip: 0,
      take: this._pageSize,
    });
  };

  @action
  _reset = () => {
    TapStore.flushQueryCaches();
    this._queryOptionsList = [];
  };
}

export default LeaderboardListStore;
