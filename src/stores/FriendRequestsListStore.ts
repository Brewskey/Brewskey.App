import type { Friend } from '@brewskey/js-api';
import type { Row } from './DAOListStore';

import DAOApi, { FRIEND_STATUSES } from '@brewskey/js-api';
import AuthStore from './AuthStore';

class FriendRequestsListStore {
  // get _pendingRequestsLoader(): LoadObject<Array<LoadObject<Friend>>> {
  //   return FriendStore.getMany({
  //     filters: [
  //       DAOApi.createFilter('friendAccount').notEquals(null),
  //       DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
  //       DAOApi.createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
  //     ],
  //     orderBy: [
  //       {
  //         column: 'id',
  //         direction: 'desc',
  //       },
  //     ],
  //   });
  // }
  // get _myRequestsLoader(): LoadObject<Array<LoadObject<Friend>>> {
  //   return FriendStore.getMany({
  //     filters: [
  //       DAOApi.createFilter('friendAccount').notEquals(null),
  //       DAOApi.createFilter('friendStatus').equals(
  //         FRIEND_STATUSES.AWAITING_APPROVAL,
  //       ),
  //       DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
  //     ],
  //     orderBy: [
  //       {
  //         column: 'id',
  //         direction: 'desc',
  //       },
  //     ],
  //   });
  // }
  // get pendingRequestsLoaderRows(): Array<Row<Friend>> {
  //   return this._pendingRequestsLoader.hasValue()
  //     ? this._pendingRequestsLoader.getValueEnforcing().map(
  //         (loader: LoadObject<Friend>, index: number): Row<Friend> => ({
  //           key: index.toString(),
  //           loader,
  //         }),
  //       )
  //     : [];
  // }
  // get pendingRequestsCount(): number {
  //   return (
  //     FriendStore.count({
  //       filters: [
  //         DAOApi.createFilter('friendAccount').notEquals(null),
  //         DAOApi.createFilter('owningAccount/id').equals(AuthStore.userID),
  //         DAOApi.createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
  //       ],
  //     }).getValue() || 0
  //   );
  // }
  // get myRequestsLoaderRows(): Array<Row<Friend>> {
  //   return this._myRequestsLoader.hasValue()
  //     ? this._myRequestsLoader.getValueEnforcing().map(
  //         (loader: LoadObject<Friend>, index: number): Row<Friend> => ({
  //           key: index.toString(),
  //           loader,
  //         }),
  //       )
  //     : [];
  // }
  // get isLoading(): boolean {
  //   return (
  //     this._myRequestsLoader.isLoading() ||
  //     this._pendingRequestsLoader.isLoading()
  //   );
  // }
  // reload = async (): Promise<void> => {
  //   FriendStore.flushCache();
  // };
}

export default new FriendRequestsListStore() as FriendRequestsListStore;
