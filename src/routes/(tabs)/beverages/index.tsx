import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';

import { useUserID } from '../../../hooks/context/AuthContext';
import BeveragesList from '../../../components/BeveragesList';

const MyBeveragesScreen: React.FC = () => {
  const userID = useUserID();

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="add"
            testID="header-add-button"
            href={{ pathname: '/(tabs)/beverages/new', params: {} }}
          />
        }
        shouldShowBackButton
        title="Homebrew"
      />
      <BeveragesList
        queryOptions={{
          filters: [
            createFilter('createdBy/id').equals(userID),
          ],
        }}
      />
    </Container>
  );
};

export default withErrorBoundary(MyBeveragesScreen, <ErrorScreen shouldShowBackButton />);
