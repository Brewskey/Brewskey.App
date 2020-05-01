// @flow

import makeRequestApiStore from './makeRequestApiStore';
import DAOApi from 'brewskey.js-api';

const FriendAddStore = makeRequestApiStore<void>((userName: string) =>
  DAOApi.FriendDAO.addFriend(userName),
);

export default FriendAddStore;
