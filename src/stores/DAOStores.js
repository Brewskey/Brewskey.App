// @flow

import type {
  Account,
  Availability,
  Beverage,
  DAO,
  Device,
  EntityID,
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
): Promise<TValue> =>
  new Promise((resolve: TValue => void, reject: (error: Error) => void) => {
    autorun(reaction => {
      const loader = getLoader().map((result: $FlowFixMe): $FlowFixMe => {
        if (!Array.isArray(result)) {
          return result;
        }

        if (
          result.some(
            (item: $FlowFixMe): boolean =>
              item instanceof LoadObject ? item.isLoading() : false,
          )
        ) {
          return LoadObject.loading();
        }

        return result;
      });

      if (loader.hasError()) {
        reject(loader.getErrorEnforcing());
        reaction.dispose();
      }

      if (loader.hasValue()) {
        resolve(loader.getValueEnforcing());
        reaction.dispose();
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
    return this._callDAOFunction('count', queryOptions);
  }

  getByID(id: EntityID): LoadObject<TEntity> {
    return this._callDAOFunction('fetchByID', id);
  }

  getMany(queryOptions: ?QueryOptions): LoadObject<Array<LoadObject<TEntity>>> {
    return this._callDAOFunction('fetchMany', queryOptions);
  }

  _callDAOFunction = (functionName: string, ...args) => {
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
    this._atom.reportChanged();
  };
}

export const AccountStore: DAOStore<Account> = new DAOStore(DAOApi.AccountDAO);
export const AvailabilityStore: DAOStore<Availability> = new DAOStore(
  DAOApi.AvailabilityDAO,
);
export const BeverageStore: DAOStore<Beverage> = new DAOStore(
  DAOApi.BeverageDAO,
);
export const DeviceStore: DAOStore<Device> = new DAOStore(DAOApi.DeviceDAO);
export const GlassStore: DAOStore<Glass> = new DAOStore(DAOApi.GlassDAO);
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
export const TapStore: DAOStore<Tap> = new DAOStore(DAOApi.TapDAO);

export default DAOStore;
