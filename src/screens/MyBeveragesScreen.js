// @flow

import type { Navigation } from '../types';
import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { inject, observer } from 'mobx-react';
import HeaderIcon from '../common/HeaderIcon';
import BeveragesList from '../components/BeveragesList';

type InjectedProps = {|
  authStore: AuthStore,
  navigation: Navigation,
|};

@inject('authStore')
@observer
class MyBeveragesScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = ({ navigation }: Object): Object => ({
    headerRight: (
      <HeaderIcon
        name="add"
        onPress={(): void => navigation.navigate('newBeverage')}
      />
    ),
    title: 'Homebrew',
  });

  render() {
    return (
      <BeveragesList
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

export default MyBeveragesScreen;
