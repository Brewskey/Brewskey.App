// @flow

import type { EntityID, QueryOptions, Tap } from 'brewskey.js-api';
import type { Section } from '../types';

import nullthrows from 'nullthrows';
import flattenArray from 'array-flatten';
import { action, computed, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import { TapStore } from './DAOStores';

const BASE_QUERY_OPTIONS = {
  orderBy: [
    {
      column: 'device/id',
      direction: 'desc',
    },
  ],
};

class SectionTapsListStore {
  _pageSize: number;
  @observable
  _queryOptionsList: Array<QueryOptions> = [];

  @observable
  _isInitialized: boolean = false;

  constructor(pageSize?: number = 20) {
    this._pageSize = pageSize;
  }

  @action
  initialize: () => void = (): void => {
    this._isInitialized = true;
    this._fetchFirstPage();
  };

  @computed
  get isLoading(): boolean {
    return (
      this._remoteCountLoader.isLoading() ||
      this._pageLoadObjects.some(
        (pageLoadObject: LoadObject<Array<Tap>>): boolean =>
          pageLoadObject.isLoading(),
      )
    );
  }

  @computed
  get sections(): Array<Section<Tap>> {
    // todo this recreates new section Object on every run
    // it causes ListItem rerenders every time if I pass Section prop there.
    return Array.from(
      new Set(this._taps.map((tap: Tap): EntityID => tap.device.id)).values(),
    ).map((deviceID: EntityID): Section<Tap> => {
      const deviceTaps = this._taps.filter((tap) => tap.device.id === deviceID);
      return {
        data: deviceTaps,
        title: nullthrows(deviceTaps[0]).device.name,
      };
    });
  }

  @computed
  get _pageLoadObjects(): Array<LoadObject<Array<Tap>>> {
    // wait until all items in pageLoadObject are loaded
    return this._queryOptionsList
      .map((queryOptions: QueryOptions): LoadObject<Array<LoadObject<Tap>>> =>
        TapStore.getMany(queryOptions),
      )
      .map((pageLoadObject: LoadObject<Array<LoadObject<Tap>>>): LoadObject<
        Array<Tap>,
      > =>
        pageLoadObject.map(
          (itemLoadObjects: Array<LoadObject<Tap>>): LoadObject<Array<Tap>> => {
            if (
              itemLoadObjects.some((itemLoadObject: LoadObject<Tap>): boolean =>
                itemLoadObject.isLoading(),
              )
            ) {
              return LoadObject.loading();
            }

            if (
              itemLoadObjects.find((itemLoadObject: LoadObject<Tap>): boolean =>
                itemLoadObject.hasError(),
              )
            ) {
              return LoadObject.withError(
                new Error('Error loading tap list page'),
              );
            }

            return LoadObject.withValue(
              itemLoadObjects.map((itemLoadObject: LoadObject<Tap>): Tap =>
                itemLoadObject.getValueEnforcing(),
              ),
            );
          },
        ),
      );
  }

  @computed
  get _remoteCountLoader(): LoadObject<number> {
    if (!this._isInitialized) {
      return LoadObject.loading();
    }

    return TapStore.count(BASE_QUERY_OPTIONS);
  }

  @computed
  get _taps(): Array<Tap> {
    return flattenArray(
      this._pageLoadObjects.map((pageLoadObject) =>
        pageLoadObject.hasValue() ? pageLoadObject.getValueEnforcing() : [],
      ),
    );
  }

  @action
  _fetchFirstPage = () => {
    this._queryOptionsList.push({
      ...BASE_QUERY_OPTIONS,
      skip: 0,
      take: this._pageSize,
    });
  };

  @action
  fetchNextPage: () => void = (): void => {
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
  reload: () => void = (): void => {
    this._reset();
    this._fetchFirstPage();
  };

  @action
  _reset = (): void => {
    TapStore.flushCache();
    this._queryOptionsList = [];
  };
}

export default SectionTapsListStore;
