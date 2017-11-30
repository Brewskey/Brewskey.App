// @flow

import * as React from 'react';
import AuthStore from '../../stores/AuthStore';
import DrawerButton from './DrawerButton';

const LogoutButton = () => (
  <DrawerButton
    icon={{ name: 'logout', type: 'material-community' }}
    onPress={AuthStore.clearAuthState}
    title="log out"
  />
);

export default LogoutButton;
