import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import LocationsList from '../components/LocationsList';
import NuxNoEntity from '../components/NuxNoEntity';

const LocationsScreen: React.FC = () => {
  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="add"
            testID="header-add-button"
            screen="LoggedInStack"
            params={{
              screen: 'menu',
            params: {
              screen: 'locations',
              params: {
                screen: 'newLocation',
                params: {},
              },
            },
            }}
          />
        }
        shouldShowBackButton
        title="Locations"
        testID="header-locations"
      />
      <LocationsList ListEmptyComponent={NuxNoEntity} />
    </Container>
  );
};

export default withErrorBoundary(LocationsScreen, <ErrorScreen shouldShowBackButton />);
