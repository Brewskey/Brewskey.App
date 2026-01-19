import type { EntityID, Location } from '@brewskey/js-api';

import * as React from 'react';
import { StaticScreenProps } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text } from 'react-native';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import LoadingIndicator from '../common/LoadingIndicator';
import Header from '../common/Header';
import LocationAddress from '../components/LocationAddress';
import { TYPOGRAPHY } from '../theme';
import { useGetLocationById } from '../hooks/queries/LocationQueries';

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.paragraph,
  },
});

type Props = StaticScreenProps<{
  id: EntityID;
}>;

const LocationDetailsScreen: React.FC<Props> = ({
  route: {
    params: { id },
  },
}: Props) => {

  const { data: location, isLoading, error } = useGetLocationById(id);

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
      <Container>
        <Header shouldShowBackButton />
        <LoadingIndicator />
      </Container>
    );
  }

  const { description, id: locationId, name } = location;

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
                screen: 'locations',
                params: {
                  screen: 'editLocation',
                  params: { id: locationId },
                },
              },
            }}
          />
        }
        shouldShowBackButton
        title={name}
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
