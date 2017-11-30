// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import AuthStore from '../stores/AuthStore';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import DevicesList from '../components/DevicesList';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class DevicesScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <View>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newDevice" />
          }
          title="Devices"
        />
        <DevicesList
          queryOptions={{
            filters: [
              DAOApi.createFilter('createdBy/id').equals(AuthStore.userID),
            ],
          }}
        />
      </View>
    );
  }
}

export default DevicesScreen;
