// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import { observer } from 'mobx-react';
import AuthStore from '../stores/AuthStore';
import BeveragesList from '../components/BeveragesList';

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@observer
class MyBeveragesScreen extends InjectedComponent<InjectedProps> {
  render(): React.Node {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newBeverage" />
          }
          showBackButton
          title="Homebrew"
        />
        <BeveragesList
          queryOptions={{
            filters: [
              DAOApi.createFilter('createdBy/id').equals(AuthStore.userID),
            ],
          }}
        />
      </Container>
    );
  }
}

export default MyBeveragesScreen;
