import * as React from 'react';

import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import LoadingIndicator from '../../../common/LoadingIndicator';
import NotFoundScreen from '../../../common/NotFoundScreen';
import SectionContent from '../../../common/SectionContent';
import SectionHeader from '../../../common/SectionHeader';
import LocationAddress from '../../../components/LocationAddress';
import { useGetLocationById } from '../../../hooks/queries/LocationQueries';
import { TYPOGRAPHY } from '../../../theme';

import type { EntityID, Location } from '@brewskey/js-api';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
  },
});

const LocationDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const {
    data: location,
    isLoading,
    error,
  } = useGetLocationById(locationId as EntityID);

  if (!locationId) {
    return (
      <NotFoundScreen
        message="The location you're looking for could not be found."
        title="Location Not Found"
      />
    );
  }

  if (isLoading || !location) {
    return (
      <Container>
        <Header shouldShowBackButton testID="header-location-details" />
        <LoadingIndicator testID="location-details-loading" />
      </Container>
    );
  }

  if (error) {
    return (
      <NotFoundScreen
        message="The location you're looking for could not be found."
        title="Location Not Found"
      />
    );
  }

  const { description, id: locId, name } = location;

  return (
    <Container>
      <Header
        shouldShowBackButton
        testID="header-location-details"
        title={name}
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            testID="button-edit-location"
            href={{
              pathname: '/(tabs)/locations/[id]/edit',
              params: { id: String(locId) },
            }}
          />
        }
      />
      <ScrollView>
        <SectionHeader title="Address" />
        <SectionContent paddedHorizontal>
          <LocationAddress location={location} />
        </SectionContent>
        {description != null && description !== '' && (
          <React.Fragment>
            <SectionHeader key="header" title="Description" />
            <SectionContent key="content" paddedHorizontal>
              <Text style={styles.description}>{description}</Text>
            </SectionContent>
          </React.Fragment>
        )}
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(
  LocationDetailsScreen,
  <ErrorScreen shouldShowBackButton />,
);
