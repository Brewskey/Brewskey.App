import {
  TapDAO,
  type EntityID,
  type LeaderboardItem,
  type QueryOptions,
} from '@brewskey/js-api';

class LeaderboardListStore {
  _pageSize: number;

  _isInitialized: boolean = false;

  _duration!: string;

  _tapID!: EntityID;

  _queryOptionsList: Array<QueryOptions> = [];

  constructor(pageSize: number = 20) {
    this._pageSize = pageSize;
  }

  initialize: (arg1: { duration: string; tapID: EntityID }) => void = ({
    duration,
    tapID,
  }) => {
    this.setDuration(duration);
    this.setTapID(tapID);
    this._isInitialized = true;
    this._fetchFirstPage();
  };

  get isLoading(): boolean {
    return false;
    // return (
    //   this._remoteCountLoader.isLoading() ||
    //   this._pageLoadObjects.some(
    //     (pageLoadObject: LoadObject<Array<LeaderboardItem>>): boolean =>
    //       pageLoadObject.isLoading(),
    //   )
    // );
  }

  get rows(): Array<LeaderboardItem> {
    // if (
    //   !this._remoteCountLoader.hasValue() ||
    //   this._remoteCountLoader.getValueEnforcing() === 0
    // ) {
    //   return [];
    // }

    return [];
    // return this._pageLoadObjects.flatMap(
    //   (
    //     pageLoadObject: LoadObject<Array<LeaderboardItem>>,
    //   ): Array<LeaderboardItem> =>
    //     pageLoadObject.hasValue() ? pageLoadObject.getValueEnforcing() : [],
    // );
  }

  get _pageLoadObjects(): LeaderboardItem[][] {
    return [];
    // return this._queryOptionsList.map(
    //   (queryOptions: QueryOptions): LoadObject<Array<LeaderboardItem>> =>
    //     TapStore.getLeaderboard(this._tapID, this._duration, queryOptions),
    // );
  }

  get _remoteCountLoader(): Promise<number> {
    return TapDAO.countLeaderboard(this._tapID, this._duration);
  }

  fetchNextPage = async (): Promise<void> => {
    if (this.isLoading) {
      return;
    }

    const currentQuery =
      this._queryOptionsList[this._queryOptionsList.length - 1];
    const { skip = 0, take = this._pageSize } = currentQuery;

    // prevent fetch when we reached end of the list
    const queryLastItemIndex = take + skip - 1;
    const maxRemoteCountItem = (await this._remoteCountLoader) - 1;
    if (queryLastItemIndex >= maxRemoteCountItem) {
      return;
    }

    this._queryOptionsList.push({
      ...currentQuery,
      skip: skip + this._pageSize,
    });
  };

  setDuration: (arg1: string) => void = (duration: string) => {
    this._duration = duration;
  };

  setTapID: (arg1: EntityID) => void = (tapID) => {
    this._tapID = tapID;
  };

  reload: () => void = () => {
    this._reset();
    this._fetchFirstPage();
  };

  _fetchFirstPage: () => void = () => {
    this._queryOptionsList.push({
      skip: 0,
      take: this._pageSize,
    });
  };

  _reset: () => void = () => {
    // TapStore.flushQueryCaches();
    this._queryOptionsList = [];
  };
}

export default LeaderboardListStore;
