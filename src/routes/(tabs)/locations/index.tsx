import * as React from 'react';

import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import LocationsList from '../../../components/LocationsList';
import NuxNoEntity from '../../../components/NuxNoEntity';

const LocationsScreen: React.FC = () => (
  <Container>
    <Header
      shouldShowBackButton
      testID="header-locations"
      title="Locations"
      rightComponent={
        <HeaderNavigationButton
          href={{ pathname: '/(tabs)/locations/new', params: {} }}
          name="add"
          testID="header-add-button"
        />
      }
    />
    <LocationsList ListEmptyComponent={NuxNoEntity} />
  </Container>
);

export default withErrorBoundary(
  LocationsScreen,
  <ErrorScreen shouldShowBackButton />,
);
