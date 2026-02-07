import * as React from 'react';

import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { NotFoundScreen } from 'common/NotFoundScreen';
import { ScreenFallback } from 'common/ScreenFallback';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { LocationAddress } from 'components/LocationAddress';
import { useSuspenseGetLocationById } from 'hooks/queries/LocationQueries';
import { TYPOGRAPHY } from 'theme';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
  },
});

const LocationDetailsContent: React.FC<{ locationId: EntityID }> = ({
  locationId,
}) => {
  const { data: location } = useSuspenseGetLocationById(locationId);
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
              pathname: '/locations/[id]/edit',
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

const LocationDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const locationId =
    typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (!locationId) {
    return (
      <NotFoundScreen
        message="The location you're looking for could not be found."
        title="Location Not Found"
      />
    );
  }

  const locationIdAsEntity = locationId as EntityID;

  return (
    <React.Suspense
      fallback={
        <ScreenFallback
          shouldShowBackButton
          testID="location-details"
          title={undefined}
        />
      }
    >
      <LocationDetailsContent locationId={locationIdAsEntity} />
    </React.Suspense>
  );
};

export default LocationDetailsScreen;
