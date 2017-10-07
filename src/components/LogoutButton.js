// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import { Button } from 'react-native-elements';

type Props = {|
  authStore: AuthStore,
|};

const LogoutButton = inject('authStore')(({ authStore }: Props): React.Element<
  *,
> => <Button onPress={authStore.clearAuthState} title="log out" />);

export default LogoutButton;
