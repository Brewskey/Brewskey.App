// @flow

import type { UserCredentials } from 'brewskey.js-api';

import { AsyncStorage } from 'react-native';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import DAOApi from 'brewskey.js-api';
import Storage from '../Storage';

const AUTH_STORAGE_KEY = 'auth_state';

type AuthState = {|
  accessToken: ?string,
  id: ?string,
  refreshToken: ?string,
  roles: ?Array<string>,
  userName: ?string,
|};

const initialAuthState = {
  accessToken: null,
  id: null,
  refreshToken: null,
  roles: null,
  userName: null,
};

class AuthStore {
  @observable
  _authState: AuthState = initialAuthState;
  @observable
  isReady: boolean = false;

  constructor() {
    (async () => {
      await this._rehydrateState();

      reaction(
        (): AuthState => this._authState,
        (authState: AuthState) => {
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
    return this._authState.id;
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
