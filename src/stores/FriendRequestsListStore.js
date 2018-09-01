// @flow

import type { Friend, LoadObject } from 'brewskey.js-api';
import type { Row } from './DAOListStore';

import DAOApi, { FRIEND_STATUSES } from 'brewskey.js-api';
import { action, computed } from 'mobx';
import { FriendStore } from './DAOStores';
import AuthStore from './AuthStore';

class FriendRequestsListStore {
  @computed
  get _pendingRequestsLoader(): LoadObject<Array<LoadObject<Friend>>> {
    return FriendStore.getMany({
      filters: [
        DAOApi.createFilter('friendAccount/id').equals(AuthStore.userID),
        DAOApi.createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
      ],
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
    });
  }

  @computed
  get _myRequestsLoader(): LoadObject<Array<LoadObject<Friend>>> {
    return FriendStore.getMany({
      filters: [
        DAOApi.createFilter('friendAccount').notEquals(null),
        DAOApi.createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
        DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
      ],
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
    });
  }

  @computed
  get pendingRequestsLoaderRows(): Array<Row<Friend>> {
    return this._pendingRequestsLoader.hasValue()
      ? this._pendingRequestsLoader
          .getValueEnforcing()
          .map((loader: LoadObject<Friend>, index: number): Row<Friend> => ({
            key: index.toString(),
            loader,
          }))
      : [];
  }

  @computed
  get myRequestsLoaderRows(): Array<Row<Friend>> {
    return this._myRequestsLoader.hasValue()
      ? this._myRequestsLoader
          .getValueEnforcing()
          .map((loader: LoadObject<Friend>, index: number): Row<Friend> => ({
            key: index.toString(),
            loader,
          }))
      : [];
  }

  @computed
  get isLoading(): boolean {
    return (
      this._myRequestsLoader.isLoading() ||
      this._pendingRequestsLoader.isLoading()
    );
  }

  @action
  reload = () => {
    FriendStore.flushCache();
  };
}

export default new FriendRequestsListStore();
