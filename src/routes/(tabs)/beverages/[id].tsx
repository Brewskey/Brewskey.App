import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import BeverageDetailsContent from '../../../components/BeverageDetailsContent';
import Container from '../../../common/Container';
import SectionContent from '../../../common/SectionContent';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import LoadingIndicator from '../../../common/LoadingIndicator';
import NotFoundScreen from '../../../common/NotFoundScreen';
import SectionHeader from '../../../common/SectionHeader';
import BeveragePoursList from '../../../components/poursLists/BeveragePoursList';
import Fragment from '../../../common/Fragment';
import { useGetBeverageById } from '../../../hooks/queries/BeverageQueries';

const BeverageDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beverageId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const { data: beverage, isLoading, error } = useGetBeverageById(beverageId as EntityID);

  if (!beverageId) {
    return (
      <NotFoundScreen
        title="Beverage Not Found"
        message="The beverage you're looking for could not be found."
      />
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  if (error || !beverage) {
    return (
      <NotFoundScreen
        title="Beverage Not Found"
        message="The beverage you're looking for could not be found."
      />
    );
  }

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            href={`/(tabs)/beverages/${beverage.id}/edit`}
            testID="button-edit-beverage"
          />
        }
        shouldShowBackButton
        title={beverage.name}
      />
      <BeveragePoursList
        ListHeaderComponent={
          <Fragment>
            <SectionContent>
              <BeverageDetailsContent beverage={beverage} />
            </SectionContent>
            <SectionHeader title="Pour History" testID="section-header-pour-history" />
          </Fragment>
        }
        queryOptions={{
          filters: [createFilter('beverage/id').equals(beverage.id)],
          orderBy: [{ column: 'id', direction: 'desc' }],
        }}
        testID="beverage-pours-list"
      />
    </Container>
  );
};

export default withErrorBoundary(BeverageDetailsScreen, <ErrorScreen shouldShowBackButton />);
