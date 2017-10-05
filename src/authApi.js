// @flow

import config from './config';

type UserCredentials = {
  password: string,
  userName: string,
};

export const login = ({
  password,
  userName,
}: UserCredentials): Promise<Object> =>
  fetch(`${config.HOST}token/`, {
    body: `grant_type=password&userName=${userName}&password=${password}`,
    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
  })
    .then(async (response: Object): Object => {
      if (!response.ok) {
        const errorMessage = (await response.json()).error_description;
        throw new Error(errorMessage);
      }
      return response;
    })
    .then((response: Object): Object => response.json());
