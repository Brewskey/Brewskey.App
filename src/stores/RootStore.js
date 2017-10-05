// @flow

import AuthStore from './AuthStore';
import ErrorStore from './ErrorStore';
import { login } from '../authApi';
import DAOEntityStore from './DAOEntityStore';
import DAOApi from 'brewskey.js-api';

class RootStore {
  authStore: AuthStore;
  errorStore: ErrorStore;
  locationStore;

  constructor() {
    this.errorStore = new ErrorStore(this);
    this.authStore = new AuthStore(this);

    //todo add other dao stores
    this.locationStore = new DAOEntityStore(this, DAOApi.LocationDAO);
  }
}

export default RootStore;
