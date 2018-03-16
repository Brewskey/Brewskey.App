// @flow

import * as React from 'react';
import AuthStore from '../stores/AuthStore';
import MenuButton from './MenuButton';

const LogoutButton = () => (
  <MenuButton
    icon={{ name: 'logout', type: 'material-community' }}
    onPress={AuthStore.clearAuthState}
    title="log out"
  />
);

export default LogoutButton;
