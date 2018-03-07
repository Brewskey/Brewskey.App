// @flow

import type { UserCredentials } from '../authApi';

import { AsyncStorage } from 'react-native';
import { action, autorun, computed, runInAction, observable } from 'mobx';
import DAOApi from 'brewskey.js-api';
import NavigationService from '../NavigationService';
import authApi from '../authApi';
import { UNAUTH_ERROR_CODE } from '../constants';
import NotificationsStore from './NotificationsStore';

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
  id: string,
  roles: Array<string>,
  token: string,
  userName: string,
|};

class AuthStore {
  @observable authState: ?AuthState = null;
  @observable isInitialized: boolean = false;

  constructor() {
    // todo may be it better to use reaction here
    // it may help to avoid isInitialized prop, but I'm not sure
    autorun(async () => {
      if (!this.isInitialized) {
        return;
      }
      if (this.isAuthorized) {
        NavigationService.navigate('main');
      } else {
        NavigationService.navigate('login');
      }
    });

    DAOApi.onError(({ status }: Error) => {
      if (status === UNAUTH_ERROR_CODE) {
        this.clearAuthState();
      }
    });
  }

  @action
  clearAuthState = () => {
    this.authState = null;
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  @action
  initialize = async (): Promise<void> => {
    const authStateString = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    // todo move to parse/stringify to helpers
    const authState = authStateString && JSON.parse(authStateString);
    runInAction(() => {
      this.isInitialized = true;
      if (authState && authState.token) {
        this.setAuthState(authState);
      }
    });
  };

  @action
  login = async (userCredentials: UserCredentials): Promise<void> => {
    const { access_token, id, roles, userName } = await authApi.login(
      userCredentials,
    );

    const authState = {
      id,
      roles: JSON.parse(roles),
      token: access_token,
      userName,
    };

    this.setAuthState(authState);
    await NotificationsStore.register();
  };

  @action
  setAuthState = (authState: AuthState) => {
    setDAOHeaders(authState.token);
    this.authState = authState;
    // todo move json stringify to helpers
    // todo may be move to reaction
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  };

  @computed
  get token(): ?string {
    return this.authState && this.authState.token;
  }

  @computed
  get userID(): ?string {
    return this.authState && this.authState.id;
  }

  @computed
  get userName(): ?string {
    return this.authState && this.authState.userName;
  }

  @computed
  get isAuthorized(): boolean {
    return !!(this.authState && this.authState.token);
  }
}

export default new AuthStore();
