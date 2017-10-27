// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { inject, observer } from 'mobx-react';
import HeaderIcon from '../common/HeaderIcon';
import DevicesList from '../components/DevicesList';

type Props = {|
  authStore: AuthStore,
  navigation: Object,
|};

@inject('authStore')
@observer
class DevicesScreen extends React.Component<Props> {
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
              this.props.authStore.userID,
            ),
          ],
        }}
      />
    );
  }
}

export default DevicesScreen;
