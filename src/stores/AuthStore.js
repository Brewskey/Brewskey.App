// @flow

import type RootStore from './RootStore';

import { AsyncStorage } from 'react-native';
import { action, autorun, computed, runInAction, observable } from 'mobx';
import DAOApi from 'brewskey.js-api';
import NavigationService from '../NavigationService';
import authApi from '../authApi';

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
  roles: ?Array<string>,
  token: ?string,
  userName: string,
|};

const initialState = {
  roles: null,
  token: null,
  userName: null,
};

class AuthStore {
  _rootStore: RootStore;

  @observable authState: AuthState = initialState;
  @observable isInitialized: boolean = false;

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
    // todo may be it better to use reaction here
    // it may help to avoid isInitialized prop, but I'm not sure
    autorun(() => {
      if (!this.isInitialized) {
        return;
      }
      if (this.isAuthorized) {
        NavigationService.navigate('home');
      } else {
        NavigationService.navigate('login');
      }
    });
  }

  @action
  clearAuthState = () => {
    this.authState = initialState;
    AsyncStorage.removeItem('authState');
  };

  @action
  initialize = async (): Promise<void> => {
    const authStateString = await AsyncStorage.getItem('authState');
    // todo move to parse/stringify to helpers
    const authState = authStateString && JSON.parse(authStateString);
    runInAction(() => {
      this.isInitialized = true;
      if (authState && authState.token) {
        this.setAuthState(authState);
      }
    });
  };

  // todo handle async
  @action
  login = async (userCredentials: UserCredentials): Promise<void> => {
    const { access_token, roles, userName } = await authApi.login(
      userCredentials,
    );

    const authState = {
      roles: JSON.parse(roles),
      token: access_token,
      userName,
    };

    this.setAuthState(authState);
  };

  @action
  setAuthState = (authState: AuthState) => {
    setDAOHeaders(authState.token);
    this.authState = authState;
    // todo move json stringify to helpers
    // todo may be move to reaction
    AsyncStorage.setItem('authState', JSON.stringify(authState));
  };

  @computed
  get isAuthorized(): boolean {
    return !!this.authState.token;
  }
}

export default AuthStore;
