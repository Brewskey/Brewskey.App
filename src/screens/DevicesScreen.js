// @flow

import type { Navigation } from '../types';
import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { inject, observer } from 'mobx-react';
import HeaderIcon from '../common/HeaderIcon';
import DevicesList from '../components/DevicesList';

type InjectedProps = {|
  authStore: AuthStore,
  navigation: Navigation,
|};

@inject('authStore')
@observer
class DevicesScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = ({ navigation }: Object): Object => ({
    headerRight: (
      <HeaderIcon
        name="add"
        onPress={(): void => navigation.navigate('newDevice')}
      />
    ),
    title: 'Brewskey boxes',
  });

  render(): React.Node {
    return (
      <DevicesList
        queryOptions={{
          filters: [
            DAOApi.createFilter('createdBy/id').equals(
              this.injectedProps.authStore.userID,
            ),
          ],
        }}
      />
    );
  }
}

export default DevicesScreen;
