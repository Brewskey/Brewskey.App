// @flow

import type { RegisterFormFields } from './components/RegisterForm';

import CONFIG from './config';
import { fetchJSON } from './utils';

export type UserCredentials = {
  password: string,
  userName: string,
};

class AuthApi {
  static login = ({ password, userName }: UserCredentials): Promise<Object> =>
    fetchJSON(`${CONFIG.HOST}token/`, {
      body: `grant_type=password&userName=${userName}&password=${password}`,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

  static register = (registerFields: RegisterFormFields): Promise<Object> =>
    // eslint-disable-next-line
    fetch(`${CONFIG.HOST}api/account/register`, {
      body: JSON.stringify(registerFields),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

  static resetPassword = (email: string): Promise<void> =>
    // eslint-disable-next-line
    fetch(`${CONFIG.HOST}api/account/reset-password`, {
      body: JSON.stringify({ email }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
}

export default AuthApi;
