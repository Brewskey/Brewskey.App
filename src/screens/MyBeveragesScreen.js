// @flow

import type { Navigation } from '../types';
import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { View } from 'react-native';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import { inject, observer } from 'mobx-react';
import BeveragesList from '../components/BeveragesList';

type InjectedProps = {|
  authStore: AuthStore,
  navigation: Navigation,
|};

@inject('authStore')
@observer
class MyBeveragesScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <View>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" to="newBeverage" />
          }
          title="Homebrew"
        />
        <BeveragesList
          queryOptions={{
            filters: [
              DAOApi.createFilter('createdBy/id').equals(
                this.injectedProps.authStore.userID,
              ),
            ],
          }}
        />
      </View>
    );
  }
}

export default MyBeveragesScreen;
