// @flow

import type { UserCredentials } from '../AuthApi';

import { AsyncStorage } from 'react-native';
import { action, autorun, computed, runInAction, observable } from 'mobx';
import DAOApi from 'brewskey.js-api';
import NavigationService from '../NavigationService';
import NotificationsStore from './NotificationsStore';
import AuthApi from '../AuthApi';
import { UNAUTH_ERROR_CODE } from '../constants';
import Storage from '../Storage';
import Signalr from '../signalr';

const AUTH_STORAGE_KEY = 'auth_state';

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

type AuthState = {|
  id: ?string,
  roles: ?Array<string>,
  token: ?string,
  userName: ?string,
|};

const initialAuthState = {
  id: null,
  roles: null,
  token: null,
  userName: null,
};

class AuthStore {
  @observable authState: AuthState = initialAuthState;

  constructor() {
    (async () => {
      await this._rehydrateState();
      autorun(async () => {
        if (this.isAuthorized) {
          NavigationService.navigate('main');
          await Signalr.startAll({ access_token: this.token });
        } else {
          NavigationService.navigate('login');
        }
      });
    })();

    DAOApi.onError(({ status }: Error) => {
      if (status === UNAUTH_ERROR_CODE) {
        this.clearAuthState();
      }
    });
  }

  @action
  clearAuthState = () => {
    this.authState = initialAuthState;
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    Signalr.stopAll();
  };

  _rehydrateState = async (): Promise<void> => {
    const authState = await Storage.get(AUTH_STORAGE_KEY);
    runInAction(() => {
      if (authState && authState.token) {
        this._setAuthState(authState);
      }
    });
  };

  @action
  login = async (userCredentials: UserCredentials): Promise<void> => {
    const { access_token, id, roles, userName } = await AuthApi.login(
      userCredentials,
    );

    const authState = {
      id,
      roles: JSON.parse(roles),
      token: access_token,
      userName,
    };

    this._setAuthState(authState);
    NotificationsStore.onLogin();
  };

  // todo waiting for server implementation
  @action
  register = async (): Promise<void> => {
    await AuthStore.register();
  };

  @action
  _setAuthState = (authState: AuthState) => {
    authState.token && setDAOHeaders(authState.token);
    this.authState = authState;
    Storage.set(AUTH_STORAGE_KEY, authState);
  };

  @computed
  get token(): ?string {
    return this.authState.token;
  }

  @computed
  get userID(): ?string {
    return this.authState.id;
  }

  @computed
  get userName(): ?string {
    return this.authState.userName;
  }

  @computed
  get isAuthorized(): boolean {
    return !!this.authState.token;
  }
}

export default new AuthStore();
