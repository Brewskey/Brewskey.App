// @flow

import { rootStore } from './App';
import CONFIG from './config';

class ProfileApi {
  static updateAvatar = (avatarData: string): Promise<void> =>
    // eslint-disable-next-line no-undef
    fetch(`${CONFIG.HOST}api/profile/photo`, {
      body: JSON.stringify({ photo: avatarData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${rootStore.authStore.token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
}

export default ProfileApi;
