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
  ParticleAttributes,
  Permission,
  Pour,
  QueryOptions,
  Report,
  Schedule,
  Srm,
  Style,
  Tap,
} from 'brewskey.js-api';
import type { IAtom } from 'mobx';

import DAOApi, { LoadObject } from 'brewskey.js-api';
import { autorun, createAtom } from 'mobx';

export type PermissionEntityType =
  | 'device'
  | 'location'
  | 'organization'
  | 'tap';

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

      const loader = getLoader().map(
        (result: $FlowFixMe): $FlowFixMe => {
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
        },
      );

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
  _atom: IAtom;
  _dao: DAO<TEntity, *>;

  constructor(dao: DAO<TEntity, *>) {
    this._dao = dao;
    this._atom = createAtom(
      `DAO_ATOM/${dao.getEntityName()}`,
      this._onStartObserved,
      this._onStopObserved,
    );
  }

  flushCache = () => this._dao.flushCache();

  flushCustomCache = () => this._dao.flushCustomCache();

  flushCacheForEntity = (entityID: EntityID) =>
    this._dao.flushCacheForEntity(entityID);

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

  getSingle(queryOptions: ?QueryOptions): LoadObject<TEntity> {
    return this.__callDAOFunction('fetchSingle', queryOptions);
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

class $DeviceStore extends DAOStore<Device> {
  getParticleAttributes(deviceID: EntityID): LoadObject<ParticleAttributes> {
    return this.__callDAOFunction('fetchParticleAttributes', deviceID);
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

class $PermissionStore extends DAOStore<Permission> {
  constructor() {
    super(DAOApi.PermissionDAO);
  }

  getForEntityByID(
    permissionEntityType: PermissionEntityType,
    entityID: EntityID,
  ): LoadObject<?Permission> {
    return this.getMany({
      filters: [
        DAOApi.createFilter(`${permissionEntityType}/id`).equals(entityID),
      ],
      take: 1,
    }).map(
      (
        permissionLoaders: Array<LoadObject<Permission>>,
      ): LoadObject<?Permission> =>
        (permissionLoaders[0]: any) || LoadObject.empty(),
    );
  }
}

class $KegStore extends DAOStore<Keg> {
  constructor() {
    super(DAOApi.KegDAO);
  }

  floatKeg(entityID: EntityID): EntityID {
    return this.__callDAOFunction('floatKeg', entityID);
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
export const DeviceStore: $DeviceStore = new $DeviceStore(DAOApi.DeviceDAO);
export const GlassStore: DAOStore<Glass> = new DAOStore(DAOApi.GlassDAO);
export const FlowSensorStore: DAOStore<FlowSensor> = new DAOStore(
  DAOApi.FlowSensorDAO,
);
export const FriendStore: DAOStore<Friend> = new DAOStore(DAOApi.FriendDAO);
export const KegStore: $KegStore = new $KegStore();
export const LocationStore: DAOStore<Location> = new DAOStore(
  DAOApi.LocationDAO,
);
export const OrganizationStore: DAOStore<Organization> = new DAOStore(
  DAOApi.OrganizationDAO,
);
export const PermissionStore: $PermissionStore = new $PermissionStore();
export const PourStore: DAOStore<Pour> = new DAOStore(DAOApi.PourDAO);
export const ReportStore: DAOStore<Report> = new DAOStore(DAOApi.ReportDAO);
export const ScheduleStore: DAOStore<Schedule> = new DAOStore(
  DAOApi.ScheduleDAO,
);
export const SrmStore: DAOStore<Srm> = new DAOStore(DAOApi.SrmDAO);
export const StyleStore: DAOStore<Style> = new DAOStore(DAOApi.StyleDAO);
export const TapStore: $TapStore = new $TapStore(DAOApi.TapDAO);

export default DAOStore;
