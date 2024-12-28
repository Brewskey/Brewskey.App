import type { QueryOptions, Keg, Pour } from '@brewskey/js-api';

// todo this many in common with logic in SectionTapsListStore
// may be move common things to another place if we'll ever have 3rd list like this
class SectionPoursListStore {
  _pageSize: number;

  _baseQueryOptions: QueryOptions = {};

  _queryOptionsList: Array<QueryOptions> = [];

  _isInitialized: boolean = false;

  constructor(pageSize: number = 20) {
    this._pageSize = pageSize;
  }

  setQueryOptions = (queryOptions: QueryOptions) => {
    this._baseQueryOptions = queryOptions;
  };

  initialize = (queryOptions: QueryOptions = {}) => {
    this.setQueryOptions(queryOptions);
    this._isInitialized = true;
    this._fetchFirstPage();
  };

  get isLoading(): boolean {
    return false;
    // return (
    //   this._remoteCountLoader.isLoading() ||
    //   this._pageLoaders.some(
    //     (pageLoadObject: LoadObject<Array<Pour>>): boolean =>
    //       pageLoadObject.isLoading(),
    //   )
    // );
  }

  get sections(): Array<KegSection> {
    return [];
    // return Array.from(
    //   new Set(
    //     this._extendedPours.map((pour: Pour): EntityID => pour.keg.id),
    //   ).values(),
    // )
    //   .map((kegID: EntityID): any => {
    //     const keg = KegStore.getByID(kegID).getValue();
    //     if (!keg) {
    //       return null;
    //     }

    //     const kegPours = this._extendedPours.filter(
    //       (pour: Pour): boolean => pour.keg.id === kegID,
    //     );

    //     return {
    //       ...keg,
    //       data: kegPours,
    //     };
    //   })
    //   .filter(Boolean);
  }

  // get _pageLoaders(): Array<LoadObject<Array<Pour>>> {
  //   // wait until all items in pageLoadObject are loaded
  //   return this._queryOptionsList
  //     .map(
  //       (queryOptions: QueryOptions): LoadObject<Array<LoadObject<Pour>>> =>
  //         PourStore.getMany(queryOptions),
  //     )
  //     .map(
  //       (
  //         pageLoader: LoadObject<Array<LoadObject<Pour>>>,
  //       ): LoadObject<Array<Pour>> =>
  //         pageLoader.map(
  //           (pourLoaders: Array<LoadObject<Pour>>): LoadObject<Array<Pour>> => {
  //             if (
  //               pourLoaders.some((pourLoader: LoadObject<Pour>): boolean =>
  //                 pourLoader
  //                   .map((pour) => KegStore.getByID(pour.keg.id))
  //                   .isLoading(),
  //               )
  //             ) {
  //               return LoadObject.loading();
  //             }

  //             if (
  //               pourLoaders.find((pourLoader: LoadObject<Pour>): boolean =>
  //                 pourLoader.hasError(),
  //               )
  //             ) {
  //               return LoadObject.withError(
  //                 new Error('Error loading pour list page'),
  //               );
  //             }

  //             return LoadObject.withValue(
  //               pourLoaders.map(
  //                 (pourLoader: LoadObject<Pour>): Pour =>
  //                   pourLoader.getValueEnforcing(),
  //               ),
  //             );
  //           },
  //         ),
  //     );
  //}

  // get _remoteCountLoader(): LoadObject<number> {
  //   if (!this._isInitialized) {
  //     return LoadObject.loading();
  //   }

  //   // ODAta inlineCount doesn't pay attention on 'skip'
  //   // but instead throws error if its used with 'top' query;
  //   const { skip, ...rest } = this._baseQueryOptions;
  //   return PourStore.count(rest as any);
  // }

  // get _extendedPours(): Array<Pour> {
  //   return this._pageLoaders.flatMap((pageLoadObject) =>
  //     pageLoadObject.hasValue() ? pageLoadObject.getValueEnforcing() : [],
  //   );
  // }

  _fetchFirstPage = () => {
    const { skip = 0, ...rest } = this._baseQueryOptions;
    this._queryOptionsList.push({
      ...rest,
      skip,
      take: this._pageSize,
    });
  };

  fetchNextPage = () => {
    if (this.isLoading) {
      return;
    }

    const currentQuery =
      this._queryOptionsList[this._queryOptionsList.length - 1];
    const { skip = 0, take = this._pageSize } = currentQuery;

    // prevent fetch when we reached end of the list
    const queryLastItemIndex = take + skip - 1;
    const maxRemoteCountItem = 0; //this._remoteCountLoader.getValueEnforcing() - 1;
    if (queryLastItemIndex >= maxRemoteCountItem) {
      return;
    }

    this._queryOptionsList.push({
      ...currentQuery,
      skip: skip + this._pageSize,
    });
  };

  reload = () => {
    this._reset();
    this._fetchFirstPage();
  };

  _reset = () => {
    this._queryOptionsList = [];
  };
}

export default SectionPoursListStore;
