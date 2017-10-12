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

import AuthStore from './AuthStore';
import DAOEntityStore from './DAOEntityStore';
import DAOApi from 'brewskey.js-api';

class RootStore {
  authStore: AuthStore;
  errorStore: ErrorStore;

  accountStore: DAOEntityStore<Account, AccountMutator>;
  availabiltiyStore: DAOEntityStore<Availability, Availability>;
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
    this.authStore = new AuthStore(this);

    this.accountStore = new DAOEntityStore(this, DAOApi.AccountDAO);
    this.availabiltiyStore = new DAOEntityStore(this, DAOApi.AvailabilityDAO);
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
}

export default RootStore;
