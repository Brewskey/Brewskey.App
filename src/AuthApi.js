// @flow

import config from './config';
import { fetchJSON } from './utils';

export type UserCredentials = {
  password: string,
  userName: string,
};

class AuthApi {
  static login = ({ password, userName }: UserCredentials): Promise<Object> =>
    fetchJSON(`${config.HOST}token/`, {
      body: `grant_type=password&userName=${userName}&password=${password}`,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

  // todo waiting for server implementation
  static register = (): Promise<Object> => Promise.resolve();

  // todo waiting for server implementation
  static resetPassword = (): Promise<void> => Promise.resolve();
}

export default AuthApi;
