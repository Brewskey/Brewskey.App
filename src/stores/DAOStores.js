// @flow

import type {
  Account,
  Achievement,
  AchievementCounter,
  Availability,
  Beverage,
  DAO,
  Device,
  EntityID,
  FlowSensor,
  Friend,
  Glass,
  Keg,
  Location,
  Organization,
  Permission,
  Pour,
  QueryOptions,
  Report,
  Schedule,
  Srm,
  Style,
  Tap,
} from 'brewskey.js-api';

import DAOApi, { LoadObject } from 'brewskey.js-api';
import { Atom, autorun } from 'mobx';

export const waitForLoaded = <TValue>(
  getLoader: () => LoadObject<TValue>,
  timeout?: number = 10000,
): Promise<TValue> =>
  new Promise((resolve: TValue => void, reject: (error: Error) => void) => {
    let timeoutId = null;
    autorun(reaction => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          reject(new Error('Response timeout!'));
          reaction.dispose();
        }, timeout);
      }

      const loader = getLoader().map((result: $FlowFixMe): $FlowFixMe => {
        if (!Array.isArray(result)) {
          return result;
        }

        if (
          result.some(
            (item: $FlowFixMe): boolean =>
              item instanceof LoadObject
                ? item.isLoading() || item.isUpdating()
                : false,
          )
        ) {
          return LoadObject.loading();
        }

        return result;
      });

      if (loader.isUpdating()) {
        return;
      }

      if (loader.hasError()) {
        reject(loader.getErrorEnforcing());
        reaction.dispose();
        clearTimeout(timeoutId);
      }

      if (loader.hasValue()) {
        resolve(loader.getValueEnforcing());
        reaction.dispose();
        clearTimeout(timeoutId);
      }
    });
  });

class DAOStore<TEntity: { id: EntityID }> {
  _atom: Atom;
  _dao: DAO<TEntity, *>;

  constructor(dao: DAO<TEntity, *>) {
    this._dao = dao;
    this._atom = new Atom(
      `DAO_ATOM/${dao.getEntityName()}`,
      this._onStartObserved,
      this._onStopObserved,
    );
  }

  flushQueryCaches = () => this._dao.flushQueryCaches();

  count(queryOptions: ?QueryOptions): LoadObject<number> {
    return this.__callDAOFunction('count', queryOptions);
  }

  getByID(id: EntityID): LoadObject<TEntity> {
    return this.__callDAOFunction('fetchByID', id);
  }

  getMany(queryOptions: ?QueryOptions): LoadObject<Array<LoadObject<TEntity>>> {
    return this.__callDAOFunction('fetchMany', queryOptions);
  }

  __callDAOFunction = (functionName: string, ...args: Array<any>) => {
    if (this._atom.reportObserved()) {
      return (this._dao: any)[functionName](...args);
    }

    throw new Error(`Observable computation is called out of observer context`);
  };

  _onStartObserved = () => {
    this._dao.subscribe(this._onNewDAOEvent);
  };

  _onStopObserved = () => {
    this._dao.unsubscribe(this._onNewDAOEvent);
  };

  _onNewDAOEvent = () => {
    (this._atom: $FlowFixMe).reportChanged();
  };
}

class $AchievementStore extends DAOStore<Achievement> {
  getAchievementCounters(
    userID: EntityID,
  ): LoadObject<Array<AchievementCounter>> {
    return this.__callDAOFunction('fetchAchievementCounters', userID);
  }
}

class $TapStore extends DAOStore<Tap> {
  countLeaderboard(
    tapID: EntityID,
    duration: string,
    queryOptions?: QueryOptions = {},
  ) {
    return this.__callDAOFunction(
      'countLeaderboard',
      tapID,
      duration,
      queryOptions,
    );
  }

  getLeaderboard(
    tapID: EntityID,
    duration: string,
    queryOptions?: QueryOptions = {},
  ) {
    return this.__callDAOFunction(
      'fetchLeaderboard',
      tapID,
      duration,
      queryOptions,
    );
  }
}

export const AccountStore: DAOStore<Account> = new DAOStore(DAOApi.AccountDAO);
export const AchievementStore: $AchievementStore = new $AchievementStore(
  DAOApi.AchievementDAO,
);
export const AvailabilityStore: DAOStore<Availability> = new DAOStore(
  DAOApi.AvailabilityDAO,
);
export const BeverageStore: DAOStore<Beverage> = new DAOStore(
  DAOApi.BeverageDAO,
);
export const DeviceStore: DAOStore<Device> = new DAOStore(DAOApi.DeviceDAO);
export const GlassStore: DAOStore<Glass> = new DAOStore(DAOApi.GlassDAO);
export const FlowSensorStore: DAOStore<FlowSensor> = new DAOStore(
  DAOApi.FlowSensorDAO,
);
export const FriendStore: DAOStore<Friend> = new DAOStore(DAOApi.FriendDAO);
export const KegStore: DAOStore<Keg> = new DAOStore(DAOApi.KegDAO);
export const LocationStore: DAOStore<Location> = new DAOStore(
  DAOApi.LocationDAO,
);
export const OrganizationStore: DAOStore<Organization> = new DAOStore(
  DAOApi.OrganizationDAO,
);
export const PermissionStore: DAOStore<Permission> = new DAOStore(
  DAOApi.PermissionDAO,
);
export const PourStore: DAOStore<Pour> = new DAOStore(DAOApi.PourDAO);
export const ReportStore: DAOStore<Report> = new DAOStore(DAOApi.ReportDAO);
export const ScheduleStore: DAOStore<Schedule> = new DAOStore(
  DAOApi.ScheduleDAO,
);
export const SrmStore: DAOStore<Srm> = new DAOStore(DAOApi.SrmDAO);
export const StyleStore: DAOStore<Style> = new DAOStore(DAOApi.StyleDAO);
export const TapStore: $TapStore = new $TapStore(DAOApi.TapDAO);

export default DAOStore;
