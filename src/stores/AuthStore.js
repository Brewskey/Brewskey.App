// @flow

import type { UserCredentials } from '../AuthApi';

import { AsyncStorage } from 'react-native';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import AuthApi from '../AuthApi';
import Storage from '../Storage';

const AUTH_STORAGE_KEY = 'auth_state';

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
  @observable _authState: AuthState = initialAuthState;
  @observable isReady: boolean = false;

  constructor() {
    (async () => {
      await this._rehydrateState();

      reaction(
        (): AuthState => this._authState,
        (authState: AuthState) => {
          if (authState.token) {
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
    const { access_token, id, roles, userName } = await AuthApi.login(
      userCredentials,
    );

    const authState = {
      id,
      roles: JSON.parse(roles),
      token: access_token,
      userName,
    };

    runInAction('loginSuccess', () => {
      this._authState = authState;
    });
  };

  @action
  logout = () => {
    this._authState = initialAuthState;
  };

  @computed
  get token(): ?string {
    return this._authState.token;
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
    return !!this._authState.token;
  }

  _rehydrateState = async (): Promise<void> => {
    const authState = await Storage.get(AUTH_STORAGE_KEY);
    runInAction(() => {
      if (authState && authState.token) {
        this._authState = authState;
      }
      this.isReady = true;
    });
  };
}

export default new AuthStore();
