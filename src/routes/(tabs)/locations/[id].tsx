import type { EntityID, Location } from '@brewskey/js-api';

import * as React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import SectionContent from '../../../common/SectionContent';
import SectionHeader from '../../../common/SectionHeader';
import LoadingIndicator from '../../../common/LoadingIndicator';
import Header from '../../../common/Header';
import NotFoundScreen from '../../../common/NotFoundScreen';
import LocationAddress from '../../../components/LocationAddress';
import { TYPOGRAPHY } from '../../../theme';
import { useGetLocationById } from '../../../hooks/queries/LocationQueries';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
  },
});

const LocationDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
  const { data: location, isLoading, error } = useGetLocationById(locationId as EntityID);

  if (!locationId) {
    return (
      <NotFoundScreen
        title="Location Not Found"
        message="The location you're looking for could not be found."
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

  if (error || !location) {
    return (
      <NotFoundScreen
        title="Location Not Found"
        message="The location you're looking for could not be found."
      />
    );
  }

  const { description, id: locId, name } = location;

  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="edit"
            href={`/(tabs)/locations/${locId}/edit`}
            testID="button-edit-location"
          />
        }
        shouldShowBackButton
        title={name}
        testID="header-location-details"
      />
      <ScrollView>
        <SectionHeader title="Address" />
        <SectionContent paddedHorizontal>
          <LocationAddress location={location} />
        </SectionContent>
        {description != null && description !== '' && (
          <>
            <SectionHeader key="header" title="Description" />
            <SectionContent key="content" paddedHorizontal>
              <Text style={styles.description}>{description}</Text>
            </SectionContent>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default withErrorBoundary(LocationDetailsScreen, <ErrorScreen shouldShowBackButton />);
