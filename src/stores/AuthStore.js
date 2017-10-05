// @flow

import type RootStore from './RootStore';

import DAOApi from 'brewskey.js-api';
import authApi from '../authApi';
import { action, autorun, computed, observable } from 'mobx';

const setDAOHeaders = (token: string) => {
  const daoHeaders = DAOApi.getHeaders().filter(
    (header: { name: string, value: string }): boolean =>
      header.name !== 'Authorization' && header.name !== 'timezoneOffset',
  );

  DAOApi.setHeaders([
    ...daoHeaders,
    {
      name: 'timezoneOffset',
      value: new Date().getTimezoneOffset().toString(),
    },
    {
      name: 'Authorization',
      value: `Bearer ${token}`,
    },
  ]);
};

class AuthStore {
  store: RootStore;

  @observable authState = new Map();

  constructor(rootStore) {
    this.store = rootStore;

    // todo move from constructor
    autorun(() => {
      if (this.store.errorStore.errorStatus === 401) {
        this.clearAuthState();
      }
    });
  }

  @action
  clearAuthState = () => {
    this.authState.clear();
  };

  @action
  setAuthState = (authState: AuthState) => {
    setDAOHeaders(authState.token);
    this.authState.merge(authState);
  };

  @computed
  get isAuthorized(): boolean {
    return !!this.authState.get('token');
  }
}

export default AuthStore;
