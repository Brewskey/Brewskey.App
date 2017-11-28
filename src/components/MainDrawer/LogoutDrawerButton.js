// @flow

import type AuthStore from '../../stores/AuthStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import DrawerButton from './DrawerButton';

type Props = {|
  authStore: AuthStore,
|};

const LogoutButton = inject('authStore')(({ authStore }: Props) => (
  <DrawerButton
    icon={{ name: 'logout', type: 'material-community' }}
    onPress={authStore.clearAuthState}
    title="log out"
  />
));

export default LogoutButton;
