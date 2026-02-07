import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';

import { Container } from 'common/Container';
import { Fragment } from 'common/Fragment';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { ScreenFallback } from 'common/ScreenFallback';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { BeverageDetailsContent } from 'components/BeverageDetailsContent';
import { BeveragePoursList } from 'components/poursLists/BeveragePoursList';
import { useSuspenseGetBeverageById } from 'hooks/queries/BeverageQueries';

import type { EntityID } from '@brewskey/js-api';

const BeverageDetailsContentScreen: React.FC<{ beverageId: EntityID }> = ({
  beverageId,
}) => {
  const { data: beverage } = useSuspenseGetBeverageById(beverageId);

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

const BeverageDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const beverageId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (!beverageId) {
    return (
      <NotFoundScreen
        message="The beverage you're looking for could not be found."
        title="Beverage Not Found"
      />
    );
  }

  const beverageIdAsEntity = beverageId as EntityID;

  return (
    <React.Suspense
      fallback={
        <ScreenFallback
          shouldShowBackButton
          testID="beverage-details"
          title={undefined}
        />
      }
    >
      <BeverageDetailsContentScreen beverageId={beverageIdAsEntity} />
    </React.Suspense>
  );
};

export default BeverageDetailsScreen;
