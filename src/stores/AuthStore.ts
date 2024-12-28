import type { AuthResponse, UserCredentials } from '@brewskey/js-api';

import { Auth } from '@brewskey/js-api';
import Storage from '../Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  _authState: AuthResponse = initialAuthState;

  isReady: boolean = false;

  constructor() {
    Storage.setGetUserID(async () => {
      //await when(() => this.isAuthorized);
      return this.userID || '';
    });
    (async () => {
      await this._rehydrateState();

      // reaction(
      //   (): AuthResponse => this._authState,
      //   (authState: AuthResponse) => {
      //     if (authState.accessToken) {
      //       Storage.set(AUTH_STORAGE_KEY, authState);
      //     } else {
      //       AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      //     }
      //   },
      // );
    })();
  }

  login = async (userCredentials: UserCredentials): Promise<void> => {
    const authResponse = await Auth.login(userCredentials);

    this._authState = authResponse;
  };

  logout = () => {
    this._authState = initialAuthState;
  };

  get accessToken(): string | null | undefined {
    return this._authState.accessToken;
  }

  get userID(): string | null | undefined {
    return this._authState.id === '' ? null : this._authState.id.toString();
  }

  get userName(): string | null | undefined {
    return this._authState.userName;
  }

  get isAuthorized(): boolean {
    return !!this._authState.accessToken;
  }

  _rehydrateState = async (): Promise<void> => {
    try {
      const authState = await Storage.get<AuthResponse>(AUTH_STORAGE_KEY);
      let newAuthState = authState;

      if (authState && authState.refreshToken) {
        const newAuthResponse = await Auth.refreshToken(authState.refreshToken);
        newAuthState = { ...authState, ...newAuthResponse };
      }

      if (newAuthState && newAuthState.accessToken) {
        this._authState = newAuthState;
      }
    } catch (error) {
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      this.isReady = true;
    }
  };
}

export default new AuthStore();
