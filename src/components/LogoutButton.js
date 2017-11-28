// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import Button from '../common/buttons/Button';

type Props = {|
  authStore: AuthStore,
|};

const LogoutButton = inject('authStore')(({ authStore }: Props) => (
  <Button onPress={authStore.clearAuthState} title="log out" />
));

export default LogoutButton;
