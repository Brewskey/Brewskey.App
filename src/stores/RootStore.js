// @flow

import type {
  Account,
  AccountMutator,
  Availability,
  Beverage,
  Device,
  DeviceMutator,
  Location,
  Organization,
  Permission,
  PermissionMutator,
  Pour,
  Report,
  ReportMutator,
  Schedule,
  ScheduleMutator,
  Srm,
  Tap,
  TapMutator,
} from 'brewskey.js-api';

import AppSettingsStore from './AppSettingsStore';
import AuthStore from './AuthStore';
import DAOEntityStore from './DAOEntityStore';
import DAOApi from 'brewskey.js-api';

class RootStore {
  appSettingsStore: AppSettingsStore;
  authStore: AuthStore;
  errorStore: ErrorStore;
  routesSettingsStore: RoutesSettingsStore;

  accountStore: DAOEntityStore<Account, AccountMutator>;
  availabilityStore: DAOEntityStore<Availability, Availability>;
  beverageStore: DAOEntityStore<Beverage, Beverage>;
  deviceStore: DAOEntityStore<Device, DeviceMutator>;
  locationStore: DAOEntityStore<Location, Location>;
  organizationStore: DAOEntityStore<Organization, Organization>;
  permissionStore: DAOEntityStore<Permission, PermissionMutator>;
  pourStore: DAOEntityStore<Pour, Pour>;
  reportStore: DAOEntityStore<Report, ReportMutator>;
  scheduleStore: DAOEntityStore<Schedule, ScheduleMutator>;
  srmStore: DAOEntityStore<Srm, Srm>;
  styleStore: DAOEntityStore<Style, Style>;
  tapStore: DAOEntityStore<Tap, TapMutator>;

  constructor() {
    this.appSettingsStore = new AppSettingsStore(this);
    this.authStore = new AuthStore(this);
    this.routesSettingsStore = new RoutesSettingsStore(this);

    this.accountStore = new DAOEntityStore(this, DAOApi.AccountDAO);
    this.availabilityStore = new DAOEntityStore(this, DAOApi.AvailabilityDAO);
    this.beverageStore = new DAOEntityStore(this, DAOApi.BeverageDAO);
    this.deviceStore = new DAOEntityStore(this, DAOApi.DeviceDAO);
    this.locationStore = new DAOEntityStore(this, DAOApi.LocationDAO);
    this.organizationStore = new DAOEntityStore(this, DAOApi.OrganizationDAO);
    this.permissionStore = new DAOEntityStore(this, DAOApi.PermissionDAO);
    this.pourStore = new DAOEntityStore(this, DAOApi.PourDAO);
    this.reportStore = new DAOEntityStore(this, DAOApi.ReportDAO);
    this.scheduleStore = new DAOEntityStore(this, DAOApi.ScheduleDAO);
    this.srmStore = new DAOEntityStore(this, DAOApi.SrmDAO);
    this.styleStore = new DAOEntityStore(this, DAOApi.StyleDAO);
    this.tapStore = new DAOEntityStore(this, DAOApi.TapDAO);
  }

  //todo not sure if its correct, since assignements in initialize actions,
  //runs in callbacks, but seems working for now.
  initialize = async (): Promise<void> => {
    await this.authStore.initialize();
    await this.appSettingsStore.initialize();
  };
}

export default RootStore;
