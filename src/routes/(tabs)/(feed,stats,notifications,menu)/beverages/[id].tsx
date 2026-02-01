import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Fragment } from 'common/Fragment';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { BeverageDetailsContent } from 'components/BeverageDetailsContent';
import { BeveragePoursList } from 'components/poursLists/BeveragePoursList';
import { useGetBeverageById } from 'hooks/queries/BeverageQueries';

import type { EntityID } from '@brewskey/js-api';

const BeverageDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beverageId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const {
    data: beverage,
    isLoading,
    error,
  } = useGetBeverageById(beverageId as EntityID);

  if (!beverageId) {
    return (
      <NotFoundScreen
        message="The beverage you're looking for could not be found."
        title="Beverage Not Found"
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
        message="The beverage you're looking for could not be found."
        title="Beverage Not Found"
      />
    );
  }

  return (
    <Container>
      <Header
        shouldShowBackButton
        title={beverage.name}
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            testID="button-edit-beverage"
            href={{
              pathname: '/beverages/[id]/edit',
              params: { id: beverage.id.toString() },
            }}
          />
        }
      />
      <BeveragePoursList
        testID="beverage-pours-list"
        ListHeaderComponent={
          <Fragment>
            <SectionContent>
              <BeverageDetailsContent beverage={beverage} />
            </SectionContent>
            <SectionHeader
              testID="section-header-pour-history"
              title="Pour History"
            />
          </Fragment>
        }
        queryOptions={{
          filters: [createFilter('beverage/id').equals(beverage.id)],
          orderBy: [{ column: 'id', direction: 'desc' }],
        }}
      />
    </Container>
  );
};

export default withErrorBoundary(
  BeverageDetailsScreen,
  <ErrorScreen shouldShowBackButton />,
);
