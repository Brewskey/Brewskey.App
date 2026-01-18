import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView } from 'react-native';
import { StaticScreenProps } from '@react-navigation/native';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import BeverageDetailsContent from '../components/BeverageDetailsContent';
import Container from '../common/Container';
import SectionContent from '../common/SectionContent';
import Header from '../common/Header';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import LoadingIndicator from '../common/LoadingIndicator';
import { useGetBeverageById } from '../hooks/queries/BeverageQueries';

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const BeverageDetailsScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {

  const { data: beverage, isLoading, error } = useGetBeverageById(id);

  if (isLoading) {
    return (
      <Container>
        <Header showBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  if (error || !beverage) {
    return (
      <Container>
        <Header showBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            screen="LoggedInStack"
            params={{
              screen: 'menu',
              params: {
                screen: 'myBeverages',
                params: {
                  screen: 'editBeverage',
                  params: { id: beverage.id },
                },
              },
            }}
          />
        }
        showBackButton
        title={beverage.name}
      />
      <ScrollView>
        <SectionContent>
          <BeverageDetailsContent beverage={beverage} />
        </SectionContent>
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(BeverageDetailsScreen, <ErrorScreen showBackButton />);
