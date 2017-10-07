// @flow

import config from './config';

export type UserCredentials = {
  password: string,
  userName: string,
};

export const login = async ({
  password,
  userName,
}: UserCredentials): Promise<Object> => {
  const response = await fetch(`${config.HOST}token/`, {
    body: `grant_type=password&userName=${userName}&password=${password}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  });
  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error_description);
  }

  return responseJson;
};

export default {
  login,
};
