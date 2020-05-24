// @flow

import type { AuthResponse, UserCredentials } from 'brewskey.js-api';

import AsyncStorage from '@react-native-community/async-storage';
import {
  action,
  computed,
  observable,
  reaction,
  runInAction,
  when,
} from 'mobx';
import DAOApi from 'brewskey.js-api';
import Storage from '../Storage';

const AUTH_STORAGE_KEY = 'auth_state';

const initialAuthState: AuthResponse = {
  accessToken: '',
  email: '',
  expiresAt: new Date(),
  expiresIn: 0,
  id: '',
  issuedAt: new Date(),
  phoneNumber: '',
  refreshToken: '',
  roles: [],
  tokenType: '',
  userLogins: [],
  userName: '',
};

class AuthStore {
  @observable
  _authState: AuthResponse = initialAuthState;
  @observable
  isReady: boolean = false;

  constructor() {
    Storage.setGetUserID(async () => {
      await when(() => this.isAuthorized);
      return this.userID || '';
    });
    (async () => {
      await this._rehydrateState();

      reaction(
        (): AuthResponse => this._authState,
        (authState: AuthResponse) => {
          if (authState.accessToken) {
            Storage.set(AUTH_STORAGE_KEY, authState);
          } else {
            AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          }
        },
      );
    })();
  }

  @action
  login = async (userCredentials: UserCredentials): Promise<void> => {
    const authResponse = await DAOApi.Auth.login(userCredentials);

    runInAction('loginSuccess', () => {
      this._authState = authResponse;
    });
  };

  @action
  logout = () => {
    this._authState = initialAuthState;
  };

  @computed
  get accessToken(): ?string {
    return this._authState.accessToken;
  }

  @computed
  get userID(): ?string {
    return this._authState.id === '' ? null : this._authState.id.toString();
  }

  @computed
  get userName(): ?string {
    return this._authState.userName;
  }

  @computed
  get isAuthorized(): boolean {
    return !!this._authState.accessToken;
  }

  _rehydrateState = async (): Promise<void> => {
    try {
      const authState = await Storage.get(AUTH_STORAGE_KEY);
      let newAuthState = authState;

      if (authState && authState.refreshToken) {
        const newAuthResponse = await DAOApi.Auth.refreshToken(
          authState.refreshToken,
        );
        newAuthState = { ...authState, ...newAuthResponse };
      }

      runInAction(() => {
        if (newAuthState && newAuthState.accessToken) {
          this._authState = newAuthState;
        }
      });
    } catch (error) {
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      runInAction(() => {
        this.isReady = true;
      });
    }
  };
}

export default new AuthStore();
