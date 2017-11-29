// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { View } from 'react-native';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import BeveragesList from '../components/BeveragesList';

type InjectedProps = {|
  navigation: Navigation,
|};

@observer
class MyBeveragesScreen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <View>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newBeverage" />
          }
          title="Homebrew"
        />
        <BeveragesList
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

export default MyBeveragesScreen;
