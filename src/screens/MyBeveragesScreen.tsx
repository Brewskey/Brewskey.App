import * as React from 'react';

import DAOApi from '@brewskey/js-api';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';

import AuthStore from '../stores/AuthStore';
import BeveragesList from '../components/BeveragesList';

type InjectedProps = {
  navigation: Navigation;
};

@errorBoundary(<ErrorScreen showBackButton />)
class MyBeveragesScreen extends InjectedComponent<InjectedProps> {
  render(): React.ReactElement {
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
