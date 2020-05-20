// @flow

import type { EntityID, LeaderboardItem, QueryOptions } from 'brewskey.js-api';

import { flatten } from 'array-flatten';
import { action, computed, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import { TapStore } from './DAOStores';

class LeaderboardListStore {
  _pageSize: number;

  @observable _isInitialized: boolean = false;
  @observable _duration: string;
  @observable _tapID: EntityID;
  @observable _queryOptionsList: Array<QueryOptions> = [];

  constructor(pageSize?: number = 20) {
    this._pageSize = pageSize;
  }

  @action
  initialize: ({|
    duration: string,
    tapID: EntityID,
  |}) => void = ({ duration, tapID }) => {
    this.setDuration(duration);
    this.setTapID(tapID);
    this._isInitialized = true;
    this._fetchFirstPage();
  };

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

    return flatten(
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
    if (!this._isInitialized) {
      return LoadObject.loading();
    }
    return TapStore.countLeaderboard(this._tapID, this._duration);
  }

  @action
  fetchNextPage: () => void = () => {
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

  @action
  setDuration: (string) => void = (duration: string) => {
    this._duration = duration;
  };

  @action
  setTapID: (EntityID) => void = (tapID) => {
    this._tapID = tapID;
  };

  @action
  reload: () => void = () => {
    this._reset();
    this._fetchFirstPage();
  };

  @action
  _fetchFirstPage: () => void = () => {
    this._queryOptionsList.push({
      skip: 0,
      take: this._pageSize,
    });
  };

  @action
  _reset: () => void = () => {
    TapStore.flushQueryCaches();
    this._queryOptionsList = [];
  };
}

export default LeaderboardListStore;
