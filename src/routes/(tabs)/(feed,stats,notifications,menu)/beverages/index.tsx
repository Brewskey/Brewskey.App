import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { BeveragesList } from 'components/BeveragesList';
import { useUserID } from 'hooks/context/AuthContext';

const MyBeveragesScreen: React.FC = () => {
  const userID = useUserID();

  return (
    <Container>
      <Header
        shouldShowBackButton
        title="Homebrew"
        rightComponent={
          <HeaderNavigationButton
            href={{ pathname: '/beverages/new', params: {} }}
            name="add"
            testID="header-add-button"
          />
        }
      />
      <BeveragesList
        queryOptions={{
          filters: [createFilter('createdBy/id').equals(userID)],
        }}
      />
    </Container>
  );
};

export default MyBeveragesScreen;
