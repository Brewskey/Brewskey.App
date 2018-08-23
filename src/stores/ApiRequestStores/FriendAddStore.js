// @flow

import makeRequestApiStore from './makeRequestApiStore';
import DAOApi from 'brewskey.js-api';

const FriendAddStore = makeRequestApiStore((userName: string): Promise<void> =>
  DAOApi.FriendDAO.addFriend(userName),
);

export default FriendAddStore;
